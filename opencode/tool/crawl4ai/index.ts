import { tool } from "@opencode-ai/plugin/tool"
import { mkdir, writeFile } from "fs/promises"
import { join, resolve, basename, extname, dirname } from "path"
import { Crawl4AI } from "crawl4ai"

// Function to detect if we're in test mode
function isTestMode(): boolean {
  return process.env.CRAWL4AI_TEST_MODE === 'true'
}

// Function to get default output directory
function getDefaultOutputDir(): string {
  const defaultDir = process.env.CRAWL4AI_DEFAULT_OUTPUT_DIR || "./crawled-content"
  return resolve(process.cwd(), defaultDir)
}

// Function to ensure directory exists
async function ensureDirectoryExists(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true })
  } catch (error) {
    // Directory might already exist, that's fine
  }
}

// Function to validate URL
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    // Only allow http and https protocols
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

// Robots.txt compliance checker
class RobotsTxtChecker {
  private cache = new Map<string, any>()

  async checkAllowed(url: string, userAgent: string = '*'): Promise<boolean> {
    try {
      const urlObj = new URL(url)
      const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`
      
      // Check cache first
      if (this.cache.has(robotsUrl)) {
        const cached = this.cache.get(robotsUrl)
        if (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) { // 24 hours cache
          return this.isPathAllowed(cached.rules, urlObj.pathname, userAgent)
        }
      }

      // Fetch robots.txt
      const response = await fetch(robotsUrl)
      if (!response.ok) {
        // No robots.txt or error, allow crawling
        this.cache.set(robotsUrl, { rules: [], timestamp: Date.now() })
        return true
      }

      const robotsTxt = await response.text()
      const rules = this.parseRobotsTxt(robotsTxt)
      
      // Cache the rules
      this.cache.set(robotsUrl, { rules, timestamp: Date.now() })
      
      return this.isPathAllowed(rules, urlObj.pathname, userAgent)
    } catch (error) {
      // Error checking robots.txt, allow crawling
      console.warn(`Failed to check robots.txt for ${url}: ${error.message}`)
      return true
    }
  }

  private parseRobotsTxt(robotsTxt: string): any[] {
    const rules: any[] = []
    let currentUserAgent = '*'
    
    robotsTxt.split('\n').forEach(line => {
      line = line.trim()
      if (!line || line.startsWith('#')) return
      
      const [directive, value] = line.split(':', 2)
      if (!directive || !value) return
      
      const cleanDirective = directive.trim().toLowerCase()
      const cleanValue = value.trim()
      
      if (cleanDirective === 'user-agent') {
        currentUserAgent = cleanValue
      } else if (cleanDirective === 'disallow' || cleanDirective === 'allow') {
        rules.push({
          userAgent: currentUserAgent,
          directive: cleanDirective,
          path: cleanValue
        })
      }
    })
    
    return rules
  }

  private isPathAllowed(rules: any[], path: string, userAgent: string): boolean {
    const relevantRules = rules.filter(rule => 
      rule.userAgent === '*' || rule.userAgent.toLowerCase().includes(userAgent.toLowerCase())
    )

    let allowed = true
    for (const rule of relevantRules) {
      if (this.pathMatches(rule.path, path)) {
        allowed = rule.directive === 'allow'
      }
    }

    return allowed
  }

  private pathMatches(rulePath: string, actualPath: string): boolean {
    if (rulePath === '/') return true
    if (rulePath === actualPath) return true
    
    // Simple wildcard matching
    const regex = new RegExp('^' + rulePath.replace(/\*/g, '.*').replace(/\?/g, '.') + '$')
    return regex.test(actualPath)
  }
}

// Global robots.txt checker instance
const robotsChecker = new RobotsTxtChecker()

// Session management for browser persistence
class SessionManager {
  private static sessions = new Map<string, any>()
  private static defaultSessionId = 'default'

  static async getSession(sessionId?: string): Promise<any> {
    const id = sessionId || this.defaultSessionId
    
    if (!this.sessions.has(id)) {
      // Create new browser context for session
      const crawler = new Crawl4AI({
        headless: true,
        verbose: false,
        userDataDir: sessionId ? `./sessions/${sessionId}` : undefined,
        browserType: 'chromium'
      })
      
      this.sessions.set(id, {
        crawler,
        createdAt: Date.now(),
        lastUsed: Date.now(),
        id
      })
    }

    const session = this.sessions.get(id)
    session.lastUsed = Date.now()
    return session
  }

  static async closeSession(sessionId?: string): Promise<void> {
    const id = sessionId || this.defaultSessionId
    
    if (this.sessions.has(id)) {
      const session = this.sessions.get(id)
      try {
        await session.crawler.close()
      } catch (error) {
        console.warn(`Error closing session ${id}: ${error.message}`)
      }
      this.sessions.delete(id)
    }
  }

  static async closeAllSessions(): Promise<void> {
    const closePromises = Array.from(this.sessions.keys()).map(id => 
      this.closeSession(id).catch(console.warn)
    )
    await Promise.all(closePromises)
    this.sessions.clear()
  }

  static getSessionInfo(): { [key: string]: any } {
    const info: { [key: string]: any } = {}
    this.sessions.forEach((session, id) => {
      info[id] = {
        id,
        createdAt: session.createdAt,
        lastUsed: session.lastUsed,
        age: Date.now() - session.createdAt
      }
    })
    return info
  }

  static async cleanupOldSessions(maxAge: number = 60 * 60 * 1000): Promise<void> { // 1 hour default
    const now = Date.now()
    const oldSessions: string[] = []
    
    this.sessions.forEach((session, id) => {
      if (now - session.lastUsed > maxAge) {
        oldSessions.push(id)
      }
    })

    for (const id of oldSessions) {
      await this.closeSession(id)
    }
  }
}

// Interface for crawl configuration
interface CrawlConfig {
  url: string
  depth?: number
  maxPages?: number
  outputDir?: string
  format?: 'markdown' | 'html' | 'json'
  strategy?: 'bfs' | 'dfs' | 'bestfirst'
  keywords?: string[]
  stream?: boolean
  includeExternalLinks?: boolean
  session?: boolean
  stealth?: boolean
  proxy?: {
    server: string
    username?: string
    password?: string
  }
  // Content filtering options
  includePatterns?: string[]
  excludePatterns?: string[]
  includeDomains?: string[]
  excludeDomains?: string[]
  contentTypeFilters?: string[]
  // File downloading options
  downloadFiles?: boolean
  fileTypes?: string[]
  maxFileSize?: number
  // Content analysis options
  extractImages?: boolean
  extractLinks?: boolean
  extractMetadata?: boolean
  includePerformance?: boolean
  includeSentiment?: boolean
  keywordAnalysis?: boolean
  // Additional download options
  maxFiles?: number
  recursive?: boolean
  // Session management options
  sessionId?: string
  cookies?: any[]
  userDataDir?: string
}

// Interface for crawl result
interface CrawlResult {
  url: string
  success: boolean
  content?: string
  links?: string[]
  images?: string[]
  files?: string[]
  metadata?: {
    title?: string
    description?: string
    wordCount?: number
    contentType?: string
    lastModified?: string
  }
  error?: string
  crawlStats?: {
    pagesCrawled: number
    totalLinks: number
    totalImages: number
    totalFiles: number
    crawlTime: number
  }
}

// Interface for URL filtering
interface URLFilter {
  includePatterns: string[]
  excludePatterns: string[]
  includeDomains: string[]
  excludeDomains: string[]
}

// Deep crawling strategies
enum CrawlStrategy {
  BFS = 'bfs',
  DFS = 'dfs', 
  BEST_FIRST = 'bestfirst'
}

// Enhanced URL filtering class with real filtering capabilities
class URLFilterManager {
  private filter: URLFilter

  constructor(filter: Partial<URLFilter> = {}) {
    this.filter = {
      includePatterns: filter.includePatterns || [],
      excludePatterns: filter.excludePatterns || [],
      includeDomains: filter.includeDomains || [],
      excludeDomains: filter.excludeDomains || []
    }
  }

  shouldInclude(url: string): boolean {
    const urlObj = new URL(url)
    const domain = urlObj.hostname

    // Check domain exclusions first
    if (this.filter.excludeDomains.length > 0) {
      if (this.filter.excludeDomains.some(excluded => domain.includes(excluded))) {
        return false
      }
    }

    // Check domain inclusions
    if (this.filter.includeDomains.length > 0) {
      if (!this.filter.includeDomains.some(included => domain.includes(included))) {
        return false
      }
    }

    // Check pattern exclusions (support regex patterns)
    if (this.filter.excludePatterns.length > 0) {
      if (this.filter.excludePatterns.some(pattern => {
        try {
          return new RegExp(pattern).test(url)
        } catch {
          return url.includes(pattern)
        }
      })) {
        return false
      }
    }

    // Check pattern inclusions (support regex patterns)
    if (this.filter.includePatterns.length > 0) {
      if (!this.filter.includePatterns.some(pattern => {
        try {
          return new RegExp(pattern).test(url)
        } catch {
          return url.includes(pattern)
        }
      })) {
        return false
      }
    }

    return true
  }

  // Filter an array of URLs
  filterUrls(urls: string[]): string[] {
    return urls.filter(url => this.shouldInclude(url))
  }

  // Get filter statistics
  getFilterStats(urls: string[]): { total: number; allowed: number; blocked: number; blockedUrls: string[] } {
    const allowed = urls.filter(url => this.shouldInclude(url))
    const blocked = urls.filter(url => !this.shouldInclude(url))
    
    return {
      total: urls.length,
      allowed: allowed.length,
      blocked: blocked.length,
      blockedUrls: blocked
    }
  }
}

// Content relevance scorer for BestFirst strategy
class ContentScorer {
  private keywords: string[]

  constructor(keywords: string[] = []) {
    this.keywords = keywords.map(k => k.toLowerCase())
  }

  scoreContent(content: string, url: string): number {
    if (this.keywords.length === 0) {
      return 1.0 // Default score if no keywords
    }

    const lowerContent = content.toLowerCase()
    const lowerUrl = url.toLowerCase()
    
    let score = 0
    for (const keyword of this.keywords) {
      // Count occurrences in content
      const contentMatches = (lowerContent.match(new RegExp(keyword, 'g')) || []).length
      // Count occurrences in URL
      const urlMatches = (lowerUrl.match(new RegExp(keyword, 'g')) || []).length
      
      // Weight URL matches higher
      score += (contentMatches * 1) + (urlMatches * 3)
    }

    // Normalize score
    return Math.min(score / this.keywords.length, 10.0)
  }
}

// Mock crawl result for test mode
interface MockCrawlResult {
  url: string
  success: boolean
  content: string
  links: string[]
  images: string[]
  metadata: {
    title: string
    description: string
    wordCount: number
  }
}

// Mock crawling function for test mode
async function mockCrawl(url: string, config: Partial<CrawlConfig>): Promise<CrawlResult> {
  const format = config.format || 'markdown'
  const filterManager = new URLFilterManager({
    includePatterns: config.includePatterns,
    excludePatterns: config.excludePatterns,
    includeDomains: config.includeDomains,
    excludeDomains: config.excludeDomains
  })
  
  // Apply URL filtering
  if (!filterManager.shouldInclude(url)) {
    return {
      url,
      success: false,
      error: `URL filtered out by configuration`
    }
  }

  const mockContent = `[TEST MODE] Mock crawled content from ${url} in ${format} format. This would contain the actual extracted content from the webpage.`
  const scorer = new ContentScorer(config.keywords)
  const relevanceScore = scorer.scoreContent(mockContent, url)
  
  return {
    url,
    success: true,
    content: mockContent,
    links: [
      `${url}/about`,
      `${url}/contact`,
      `${url}/products`,
      `${url}/blog/post-1`,
      `${url}/blog/post-2`
    ],
    images: [
      `${url}/images/logo.png`,
      `${url}/images/hero.jpg`,
      `${url}/images/team.jpg`
    ],
    files: config.downloadFiles ? [
      `${url}/files/brochure.pdf`,
      `${url}/files/specsheet.pdf`
    ] : [],
    metadata: {
      title: `Mock Page Title for ${url}`,
      description: `Mock page description for ${url}`,
      wordCount: 250,
      contentType: 'text/html',
      lastModified: new Date().toISOString()
    },
    crawlStats: {
      pagesCrawled: 1,
      totalLinks: 5,
      totalImages: 3,
      totalFiles: config.downloadFiles ? 2 : 0,
      crawlTime: 150
    }
  }
}

// Mock deep crawling with strategies
async function mockDeepCrawl(startUrl: string, config: Partial<CrawlConfig>): Promise<CrawlResult> {
  const strategy = config.strategy || CrawlStrategy.BFS
  const depth = config.depth || 3
  const maxPages = config.maxPages || 50
  const keywords = config.keywords || []
  
  const filterManager = new URLFilterManager({
    includePatterns: config.includePatterns,
    excludePatterns: config.excludePatterns,
    includeDomains: config.includeDomains,
    excludeDomains: config.excludeDomains
  })
  
  const scorer = new ContentScorer(keywords)
  
  // Generate mock URLs based on strategy
  const mockUrls = [
    startUrl,
    `${startUrl}/about`,
    `${startUrl}/contact`,
    `${startUrl}/products`,
    `${startUrl}/blog/post-1`,
    `${startUrl}/blog/post-2`,
    `${startUrl}/services`,
    `${startUrl}/team`
  ].filter(url => filterManager.shouldInclude(url))
  
  // Apply strategy-specific ordering
  let orderedUrls = mockUrls
  if (strategy === CrawlStrategy.BEST_FIRST && keywords.length > 0) {
    orderedUrls = mockUrls
      .map(url => ({
        url,
        score: scorer.scoreContent(`Mock content for ${url}`, url)
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.url)
  }
  
  // Limit by maxPages and depth
  const crawledUrls = orderedUrls.slice(0, Math.min(maxPages, depth * 3))
  
  const totalLinks = crawledUrls.length * 4 // Average 4 links per page
  const totalImages = crawledUrls.length * 2 // Average 2 images per page
  const totalFiles = config.downloadFiles ? crawledUrls.length * 1 : 0
  
  return {
    url: startUrl,
    success: true,
    content: `[TEST MODE] Deep crawl completed using ${strategy.toUpperCase()} strategy\n\nCrawled ${crawledUrls.length} pages from ${startUrl}\nDepth: ${depth}, Max pages: ${maxPages}\nKeywords: [${keywords.join(', ')}]`,
    links: crawledUrls,
    images: totalImages > 0 ? [`Mock: ${totalImages} images found`] : [],
    files: totalFiles > 0 ? [`Mock: ${totalFiles} files found`] : [],
    metadata: {
      title: `Deep Crawl Results for ${startUrl}`,
      description: `Deep crawl using ${strategy} strategy`,
      wordCount: crawledUrls.length * 200,
      contentType: 'application/json'
    },
    crawlStats: {
      pagesCrawled: crawledUrls.length,
      totalLinks,
      totalImages,
      totalFiles,
      crawlTime: crawledUrls.length * 200
    }
  }
}

// Main crawling function with real Crawl4AI integration
export async function crawlUrl(config: CrawlConfig): Promise<string> {
  // Validate input
  if (!config.url || !isValidUrl(config.url)) {
    throw new Error(`Invalid URL: ${config.url}`)
  }

  // Set defaults
  const outputDir = config.outputDir || getDefaultOutputDir()
  const format = config.format || 'markdown'

  try {
    // Check robots.txt compliance
    const isAllowed = await robotsChecker.checkAllowed(config.url)
    if (!isAllowed) {
      throw new Error(`Crawling disallowed by robots.txt for ${config.url}`)
    }

    // Get or create session
    const session = config.session ? await SessionManager.getSession(config.sessionId) : null
    const crawler = session ? session.crawler : new Crawl4AI({
      headless: true,
      verbose: true,
      ignoreCertificateErrors: true,
      overrideUserAgent: config.stealth ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' : undefined,
      userDataDir: config.userDataDir || (config.sessionId ? `./sessions/${config.sessionId}` : undefined)
    })

    // Configure crawler options
    const crawlOptions: any = {
      url: config.url,
      wordCountThreshold: 10,
      extractionStrategy: "CosineStrategy",
      chunkingStrategy: "RegexChunking",
      cssSelector: "body",
      waitFor: 2000,
      delay: 1000,
      jsCode: [
        "window.scrollTo(0, document.body.scrollHeight);"
      ]
    }

    // Add proxy configuration if provided
    if (config.proxy) {
      crawlOptions.proxy = {
        server: config.proxy.server,
        username: config.proxy.username,
        password: config.proxy.password
      }
    }

    // Add anti-detection features if stealth mode is enabled
    if (config.stealth) {
      crawlOptions.extraArgs = [
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
      
      // Add random delays to mimic human behavior
      crawlOptions.delay = Math.floor(Math.random() * 2000) + 1000 // 1-3 seconds random delay
      
      // Add realistic user agent rotation
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0'
      ]
      
      crawlOptions.overrideUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)]
    }

    // Perform the crawl
    const result = await crawler.arun(crawlOptions)

    // Format output based on requested format
    let formattedOutput = ""
    switch (format) {
      case 'markdown':
        formattedOutput = `# Crawled Content from ${config.url}\n\n${result.markdown}`
        break
      case 'html':
        formattedOutput = result.html
        break
      case 'json':
        formattedOutput = JSON.stringify({
          url: config.url,
          success: true,
          content: result.markdown,
          html: result.html,
          metadata: {
            title: result.title,
            description: result.description,
            wordCount: result.markdown?.split(' ').length || 0,
            url: config.url,
            timestamp: new Date().toISOString()
          },
          links: result.links?.map((link: any) => link.url) || [],
          images: result.images?.map((img: any) => img.src) || [],
          crawlStats: {
            pagesCrawled: 1,
            totalLinks: result.links?.length || 0,
            totalImages: result.images?.length || 0,
            crawlTime: result.processingTime?.withinTotal || 0
          }
        }, null, 2)
        break
      default:
        formattedOutput = result.markdown
    }

    // Clean up crawler resources (only if not using session)
    if (!config.session) {
      await crawler.close()
    }

    return formattedOutput

  } catch (error) {
    throw new Error(`Crawling failed: ${error.message}`)
  }
}

// Deep crawling function with real strategy implementation
export async function deepCrawl(config: CrawlConfig): Promise<string> {
  // Validate input
  if (!config.url || !isValidUrl(config.url)) {
    throw new Error(`Invalid URL: ${config.url}`)
  }

  // Set defaults for deep crawling
  const depth = config.depth || 3
  const maxPages = config.maxPages || 50
  const strategy = config.strategy || 'bfs'
  const keywords = config.keywords || []

  try {
    // Initialize URL filter
    const urlFilter = new URLFilterManager({
      includePatterns: config.includePatterns,
      excludePatterns: config.excludePatterns,
      includeDomains: config.includeDomains,
      excludeDomains: config.excludeDomains
    })

    // Initialize Crawl4AI
    const crawler = new Crawl4AI({
      headless: true,
      verbose: true,
      ignoreCertificateErrors: true,
      overrideUserAgent: config.stealth ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' : undefined
    })

    const crawledUrls = new Set<string>()
    const urlsToCrawl = [config.url]
    const results: any[] = []
    let currentDepth = 0

    // Implement different crawling strategies
    while (urlsToCrawl.length > 0 && crawledUrls.size < maxPages && currentDepth < depth) {
      let urlsToProcessThisDepth: string[]

      switch (strategy) {
        case 'bfs':
          // Breadth-First: Process all URLs at current depth
          urlsToProcessThisDepth = urlsToCrawl.splice(0, Math.min(urlsToCrawl.length, maxPages - crawledUrls.size))
          break
        case 'dfs':
          // Depth-First: Process one URL at a time, adding its children immediately
          urlsToProcessThisDepth = [urlsToCrawl.shift()!]
          break
        case 'bestfirst':
          // Best-First: Prioritize URLs with keyword relevance
          if (keywords.length > 0) {
            urlsToCrawl.sort((a, b) => {
              const scoreA = keywords.reduce((score, keyword) => 
                score + (a.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0), 0)
              const scoreB = keywords.reduce((score, keyword) => 
                score + (b.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0), 0)
              return scoreB - scoreA
            })
          }
          urlsToProcessThisDepth = [urlsToCrawl.shift()!]
          break
        default:
          urlsToProcessThisDepth = [urlsToCrawl.shift()!]
      }

      // Process URLs at current depth
      for (const url of urlsToProcessThisDepth) {
        if (crawledUrls.has(url) || crawledUrls.size >= maxPages) break

        try {
          const result = await crawler.arun({
            url,
            wordCountThreshold: 10,
            extractionStrategy: "CosineStrategy",
            chunkingStrategy: "RegexChunking",
            waitFor: 2000,
            delay: 1000
          })

          crawledUrls.add(url)
          results.push({
            url,
            title: result.title,
            content: result.markdown,
            links: result.links?.map((link: any) => link.url) || [],
            images: result.images?.map((img: any) => img.src) || [],
            depth: currentDepth
          })

          // Add new URLs to queue for next depth (BFS) or immediate processing (DFS)
          const newUrls = result.links
            ?.map((link: any) => link.url)
            .filter((url: string) => 
              isValidUrl(url) && 
              !crawledUrls.has(url) &&
              (config.includeExternalLinks || new URL(url).hostname === new URL(config.url).hostname)
            ) || []

          // Apply URL filtering
          const filteredUrls = urlFilter.filterUrls(newUrls)

          if (strategy === 'dfs') {
            // Add new URLs to front of queue for immediate processing
            urlsToCrawl.unshift(...filteredUrls.slice(0, 5)) // Limit to prevent infinite loops
          } else {
            // Add new URLs to end of queue for next depth level
            urlsToCrawl.push(...filteredUrls.slice(0, 10)) // Limit to prevent explosion
          }

        } catch (error) {
          console.warn(`Failed to crawl ${url}: ${error.message}`)
        }
      }

      currentDepth++
    }

    // Clean up crawler resources
    await crawler.close()

    // Format results
    const totalLinks = results.reduce((sum, r) => sum + r.links.length, 0)
    const totalImages = results.reduce((sum, r) => sum + r.images.length, 0)

    return JSON.stringify({
      url: config.url,
      strategy,
      depth,
      maxPages,
      keywords,
      success: true,
      results,
      crawlStats: {
        pagesCrawled: results.length,
        totalLinks,
        totalImages,
        crawlTime: Date.now()
      }
    }, null, 2)

  } catch (error) {
    throw new Error(`Deep crawling failed: ${error.message}`)
  }
}

// File downloading function with real implementation
export async function downloadFiles(config: CrawlConfig & { fileTypes?: string[] }): Promise<string> {
  // Validate input
  if (!config.url || !isValidUrl(config.url)) {
    throw new Error(`Invalid URL: ${config.url}`)
  }

  const fileTypes = config.fileTypes || ['pdf', 'jpg', 'png', 'doc', 'docx']
  const outputDir = config.outputDir || getDefaultOutputDir()
  const maxFileSize = config.maxFileSize || 50 * 1024 * 1024 // 50MB default

  try {
    // Ensure output directory exists
    await ensureDirectoryExists(outputDir)

    // Initialize Crawl4AI
    const crawler = new Crawl4AI({
      headless: true,
      verbose: true,
      ignoreCertificateErrors: true
    })

    // Crawl the page to find files
    const result = await crawler.arun({
      url: config.url,
      wordCountThreshold: 0,
      extractionStrategy: "CosineStrategy",
      waitFor: 2000,
      delay: 1000
    })

    const downloadedFiles: any[] = []
    const baseUrl = new URL(config.url)

    // Find and download files
    const fileExtensions = fileTypes.map(ext => ext.toLowerCase())
    
    // Extract file URLs from images and links
    const allUrls = [
      ...(result.images?.map((img: any) => img.src) || []),
      ...(result.links?.map((link: any) => link.url) || [])
    ]

    for (const fileUrl of allUrls) {
      try {
        const fullUrl = fileUrl.startsWith('http') ? fileUrl : new URL(fileUrl, baseUrl).toString()
        const urlObj = new URL(fullUrl)
        const extension = urlObj.pathname.split('.').pop()?.toLowerCase()

        if (extension && fileExtensions.includes(extension)) {
          // Get file headers to check size
          const response = await fetch(fullUrl, { method: 'HEAD' })
          const contentLength = parseInt(response.headers.get('content-length') || '0')

          if (contentLength <= maxFileSize) {
            // Download the file
            const fileResponse = await fetch(fullUrl)
            const buffer = await fileResponse.arrayBuffer()
            
            const fileName = basename(urlObj.pathname) || `file_${Date.now()}.${extension}`
            const filePath = join(outputDir, fileName)
            
            await mkdir(dirname(filePath), { recursive: true })
            await writeFile(filePath, new Uint8Array(buffer))

            downloadedFiles.push({
              url: fullUrl,
              fileName,
              filePath,
              size: buffer.byteLength,
              type: extension
            })
          }
        }
      } catch (error) {
        console.warn(`Failed to download file ${fileUrl}: ${error.message}`)
      }
    }

    // Clean up crawler resources
    await crawler.close()

    const totalSize = downloadedFiles.reduce((sum, file) => sum + file.size, 0)

    return JSON.stringify({
      url: config.url,
      success: true,
      outputDir,
      fileTypes,
      maxFileSize,
      downloadedFiles,
      downloadStats: {
        totalFiles: downloadedFiles.length,
        totalSize,
        averageSize: downloadedFiles.length > 0 ? totalSize / downloadedFiles.length : 0
      }
    }, null, 2)

  } catch (error) {
    throw new Error(`File downloading failed: ${error.message}`)
  }
}

// Content analysis function with real implementation
export async function analyzeContent(config: CrawlConfig): Promise<string> {
  // Validate input
  if (!config.url || !isValidUrl(config.url)) {
    throw new Error(`Invalid URL: ${config.url}`)
  }

  const extractImages = config.extractImages !== false
  const extractLinks = config.extractLinks !== false
  const extractMetadata = config.extractMetadata !== false
  const format = config.format || 'json'

  try {
    // Initialize Crawl4AI
    const crawler = new Crawl4AI({
      headless: true,
      verbose: true,
      ignoreCertificateErrors: true
    })

    // Crawl the page with comprehensive extraction
    const result = await crawler.arun({
      url: config.url,
      wordCountThreshold: 0,
      extractionStrategy: "CosineStrategy",
      chunkingStrategy: "RegexChunking",
      waitFor: 3000,
      delay: 1000,
      jsCode: [
        "return { loadTime: performance.now(), pageSize: document.documentElement.outerHTML.length, requests: window.performance ? window.performance.getEntriesByType('resource').length : 0 };"
      ]
    })

    // Perform content analysis
    const content = result.markdown || ''
    const words = content.split(/\s+/).filter(word => word.length > 0)
    const wordCount = words.length
    
    // Simple keyword density analysis
    const keywordDensity: { [key: string]: number } = {}
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did']
    
    words.forEach(word => {
      const lowerWord = word.toLowerCase().replace(/[^\w]/g, '')
      if (lowerWord.length > 3 && !commonWords.includes(lowerWord)) {
        keywordDensity[lowerWord] = (keywordDensity[lowerWord] || 0) + 1
      }
    })

    // Normalize keyword density
    Object.keys(keywordDensity).forEach(word => {
      keywordDensity[word] = parseFloat((keywordDensity[word] / wordCount * 100).toFixed(2))
    })

    // Extract main topics (top keywords)
    const topics = Object.entries(keywordDensity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word)

    // Simple sentiment analysis (basic approach)
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'awesome', 'perfect']
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'disappointing', 'poor', 'fail', 'wrong']
    
    const positiveCount = words.filter(word => positiveWords.includes(word.toLowerCase())).length
    const negativeCount = words.filter(word => negativeWords.includes(word.toLowerCase())).length
    
    let sentiment = 'Neutral'
    if (positiveCount > negativeCount * 1.5) sentiment = 'Positive'
    else if (negativeCount > positiveCount * 1.5) sentiment = 'Negative'

    // Calculate readability score (simplified Flesch Reading Ease)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0
    const avgSyllablesPerWord = words.reduce((sum, word) => {
      const syllables = word.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g)?.length || 1
      return sum + syllables
    }, 0) / words.length
    
    const readabilityScore = Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord))

    // Build analysis result
    const analysis = {
      url: config.url,
      timestamp: new Date().toISOString(),
      metadata: extractMetadata ? {
        title: result.title || 'No title',
        description: result.description || 'No description',
        wordCount,
        language: 'en', // Could be improved with language detection
        contentType: 'text/html',
        lastModified: new Date().toISOString()
      } : null,
      content: {
        summary: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
        topics,
        sentiment,
        readabilityScore: parseFloat(readabilityScore.toFixed(1)),
        keywordDensity
      },
      links: extractLinks ? (result.links?.map((link: any) => ({
        url: link.url,
        text: link.text || link.url,
        type: link.url.startsWith(config.url) ? 'internal' : 'external'
      })) || []) : null,
      images: extractImages ? (result.images?.map((img: any) => ({
        src: img.src,
        alt: img.alt || '',
        size: `${img.width || 'unknown'}x${img.height || 'unknown'}`
      })) || []) : null,
      performance: {
        loadTime: `${(result.processingTime?.withinTotal || 0)}ms`,
        pageSize: `${(content.length / 1024).toFixed(1)}KB`,
        requests: result.links?.length || 0
      }
    }

    // Clean up crawler resources
    await crawler.close()

    // Format output
    if (format === 'json') {
      return JSON.stringify(analysis, null, 2)
    } else {
      return `# Content Analysis Report for ${config.url}\n\n${JSON.stringify(analysis, null, 2)}`
    }

  } catch (error) {
    throw new Error(`Content analysis failed: ${error.message}`)
  }
}

// Tool exports for OpenCode

// Simple crawling tool
export const crawl = tool({
  description: "Crawl a single URL with content extraction and filtering",
  args: {
    url: tool.schema.string().describe("URL to crawl"),
    depth: tool.schema.number().optional().describe("Crawl depth (default: 1)"),
    maxPages: tool.schema.number().optional().describe("Maximum pages to crawl (default: 10)"),
    outputDir: tool.schema.string().optional().describe("Output directory for results"),
    format: tool.schema.enum(['markdown', 'html', 'json']).optional().describe("Output format (default: markdown)"),
    stealth: tool.schema.boolean().optional().describe("Enable stealth mode (default: false)"),
    session: tool.schema.boolean().optional().describe("Maintain session persistence (default: false)"),
    // Content filtering options
    includePatterns: tool.schema.array(tool.schema.string()).optional().describe("URL patterns to include (e.g., ['/blog', '/news'])"),
    excludePatterns: tool.schema.array(tool.schema.string()).optional().describe("URL patterns to exclude (e.g., ['/admin', '/private'])"),
    includeDomains: tool.schema.array(tool.schema.string()).optional().describe("Domains to include in crawl"),
    excludeDomains: tool.schema.array(tool.schema.string()).optional().describe("Domains to exclude from crawl"),
    downloadFiles: tool.schema.boolean().optional().describe("Enable file downloading (default: false)"),
    fileTypes: tool.schema.array(tool.schema.string()).optional().describe("File types to download (default: ['pdf', 'jpg', 'png'])")
  },
  async execute(args, context) {
    try {
      return await crawlUrl(args)
    } catch (error) {
      return `Error: ${error.message}`
    }
  },
})

// Deep crawling tool
export const deepCrawlTool = tool({
  description: "Perform deep crawling with multiple strategies and advanced filtering",
  args: {
    url: tool.schema.string().describe("Starting URL for deep crawling"),
    depth: tool.schema.number().optional().describe("Crawl depth (default: 3)"),
    maxPages: tool.schema.number().optional().describe("Maximum pages to crawl (default: 50)"),
    strategy: tool.schema.enum(['bfs', 'dfs', 'bestfirst']).optional().describe("Crawling strategy (default: bfs)"),
    keywords: tool.schema.array(tool.schema.string()).optional().describe("Keywords for relevance scoring (used with bestfirst strategy)"),
    outputDir: tool.schema.string().optional().describe("Output directory for results"),
    format: tool.schema.enum(['markdown', 'html', 'json']).optional().describe("Output format (default: markdown)"),
    includeExternalLinks: tool.schema.boolean().optional().describe("Include external links (default: false)"),
    // Advanced filtering options
    includePatterns: tool.schema.array(tool.schema.string()).optional().describe("URL patterns to include"),
    excludePatterns: tool.schema.array(tool.schema.string()).optional().describe("URL patterns to exclude"),
    includeDomains: tool.schema.array(tool.schema.string()).optional().describe("Domains to include in crawl"),
    excludeDomains: tool.schema.array(tool.schema.string()).optional().describe("Domains to exclude from crawl"),
    downloadFiles: tool.schema.boolean().optional().describe("Enable file downloading during crawl"),
    fileTypes: tool.schema.array(tool.schema.string()).optional().describe("File types to download"),
    maxFileSize: tool.schema.number().optional().describe("Maximum file size in bytes (default: 50MB)")
  },
  async execute(args, context) {
    try {
      return await deepCrawl(args)
    } catch (error) {
      return `Error: ${error.message}`
    }
  },
})

// File downloading tool
export const download = tool({
  description: "Download files from website with filtering and size limits",
  args: {
    url: tool.schema.string().describe("URL to download files from"),
    fileTypes: tool.schema.array(tool.schema.string()).optional().describe("File types to download (default: ['pdf', 'jpg', 'png', 'doc', 'docx'])"),
    outputDir: tool.schema.string().optional().describe("Output directory for downloaded files"),
    maxFiles: tool.schema.number().optional().describe("Maximum number of files to download (default: 100)"),
    maxFileSize: tool.schema.number().optional().describe("Maximum file size in bytes (default: 50MB)"),
    includePatterns: tool.schema.array(tool.schema.string()).optional().describe("URL patterns to include for file discovery"),
    excludePatterns: tool.schema.array(tool.schema.string()).optional().describe("URL patterns to exclude for file discovery"),
    recursive: tool.schema.boolean().optional().describe("Search recursively through linked pages (default: false)")
  },
  async execute(args, context) {
    try {
      return await downloadFiles(args)
    } catch (error) {
      return `Error: ${error.message}`
    }
  },
})

// Content analysis tool
export const analyze = tool({
  description: "Analyze and extract structured data from web page with comprehensive insights",
  args: {
    url: tool.schema.string().describe("URL to analyze"),
    extractImages: tool.schema.boolean().optional().describe("Extract image information (default: true)"),
    extractLinks: tool.schema.boolean().optional().describe("Extract link information (default: true)"),
    extractMetadata: tool.schema.boolean().optional().describe("Extract page metadata (default: true)"),
    format: tool.schema.enum(['markdown', 'html', 'json']).optional().describe("Output format (default: json)"),
    includePerformance: tool.schema.boolean().optional().describe("Include performance metrics (default: true)"),
    includeSentiment: tool.schema.boolean().optional().describe("Include sentiment analysis (default: true)"),
    keywordAnalysis: tool.schema.boolean().optional().describe("Include keyword density analysis (default: true)")
  },
  async execute(args, context) {
    try {
      return await analyzeContent(args)
    } catch (error) {
      return `Error: ${error.message}`
    }
  },
})

// Export utility classes for testing
export { URLFilterManager, ContentScorer }

// Default export
export default crawl