import { tool } from "@opencode-ai/plugin/tool"
import { mkdir } from "fs/promises"
import { join, resolve, basename, extname } from "path"

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

// URL filtering class
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

    // Check pattern exclusions
    if (this.filter.excludePatterns.length > 0) {
      if (this.filter.excludePatterns.some(pattern => url.includes(pattern))) {
        return false
      }
    }

    // Check pattern inclusions
    if (this.filter.includePatterns.length > 0) {
      if (!this.filter.includePatterns.some(pattern => url.includes(pattern))) {
        return false
      }
    }

    return true
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

// Main crawling function
export async function crawlUrl(config: CrawlConfig): Promise<string> {
  // Validate input
  if (!config.url || !isValidUrl(config.url)) {
    throw new Error(`Invalid URL: ${config.url}`)
  }

  // Set defaults
  const depth = config.depth || 1
  const maxPages = config.maxPages || 10
  const outputDir = config.outputDir || getDefaultOutputDir()
  const format = config.format || 'markdown'

  // Test mode - return mock response
  if (isTestMode()) {
    const result = await mockCrawl(config.url, config)
    return `[TEST MODE] Would crawl ${config.url} (depth: ${depth}, maxPages: ${maxPages}, format: ${format})\n\nMock Result:\n${JSON.stringify(result, null, 2)}`
  }

  try {
    // TODO: Implement actual Crawl4AI integration
    // For now, return a placeholder response
    await ensureDirectoryExists(outputDir)
    
    return `Crawling ${config.url} with depth ${depth}, max pages ${maxPages}, format ${format}\n\nNote: This is a placeholder implementation. Full Crawl4AI integration will be implemented in the next phase.\n\nOutput directory: ${outputDir}`
  } catch (error) {
    throw new Error(`Crawling failed: ${error.message}`)
  }
}

// Deep crawling function
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

  // Test mode
  if (isTestMode()) {
    const result = await mockDeepCrawl(config.url, config)
    return `[TEST MODE] Deep crawl results:\n\n${JSON.stringify(result, null, 2)}`
  }

  try {
    // TODO: Implement actual deep crawling with Crawl4AI strategies
    // For now, return enhanced placeholder with strategy logic
    let strategyDescription = ''
    switch (strategy) {
      case CrawlStrategy.BFS:
        strategyDescription = 'Breadth-First Search: Explore all links at current depth before going deeper'
        break
      case CrawlStrategy.DFS:
        strategyDescription = 'Depth-First Search: Follow each path completely before backtracking'
        break
      case CrawlStrategy.BEST_FIRST:
        strategyDescription = 'Best-First: Prioritize pages based on keyword relevance scoring'
        break
    }

    return `Deep crawling ${config.url} using ${strategy.toUpperCase()} strategy\n\nStrategy: ${strategyDescription}\nDepth: ${depth}, Max pages: ${maxPages}\nKeywords: ${keywords.join(', ')}\n\nNote: This is a placeholder implementation. Full deep crawling with ${strategy} will be implemented in the next phase.`
  } catch (error) {
    throw new Error(`Deep crawling failed: ${error.message}`)
  }
}

// File downloading function
export async function downloadFiles(config: CrawlConfig & { fileTypes?: string[] }): Promise<string> {
  // Validate input
  if (!config.url || !isValidUrl(config.url)) {
    throw new Error(`Invalid URL: ${config.url}`)
  }

  const fileTypes = config.fileTypes || ['pdf', 'jpg', 'png', 'doc', 'docx']
  const outputDir = config.outputDir || getDefaultOutputDir()
  const maxFileSize = config.maxFileSize || 50 * 1024 * 1024 // 50MB default

  // Test mode
  if (isTestMode()) {
    const mockFiles = [
      { url: `${config.url}/documents/report.pdf`, size: 1024 * 1024, type: 'pdf' },
      { url: `${config.url}/images/logo.png`, size: 256 * 1024, type: 'png' },
      { url: `${config.url}/files/presentation.docx`, size: 5 * 1024 * 1024, type: 'docx' },
      { url: `${config.url}/downloads/archive.zip`, size: 100 * 1024 * 1024, type: 'zip' } // Over limit
    ].filter(file => fileTypes.includes(file.type) && file.size <= maxFileSize)

    const totalSize = mockFiles.reduce((sum, file) => sum + file.size, 0)
    
    return `[TEST MODE] File download analysis for ${config.url}\n\nFile types: [${fileTypes.join(', ')}]\nMax file size: ${maxFileSize / (1024 * 1024)}MB\nOutput directory: ${outputDir}\n\nFiles to download (${mockFiles.length} files, ${(totalSize / (1024 * 1024)).toFixed(2)}MB):\n${mockFiles.map(f => `- ${f.url} (${(f.size / 1024).toFixed(0)}KB, ${f.type})`).join('\n')}`
  }

  try {
    // TODO: Implement actual file downloading with Crawl4AI
    await ensureDirectoryExists(outputDir)
    
    return `Downloading files from ${config.url}\nFile types: ${fileTypes.join(', ')}\nMax file size: ${(maxFileSize / (1024 * 1024)).toFixed(0)}MB\nOutput directory: ${outputDir}\n\nNote: This is a placeholder implementation. Full file downloading will be implemented in the next phase.`
  } catch (error) {
    throw new Error(`File downloading failed: ${error.message}`)
  }
}

// Content analysis function
export async function analyzeContent(config: CrawlConfig): Promise<string> {
  // Validate input
  if (!config.url || !isValidUrl(config.url)) {
    throw new Error(`Invalid URL: ${config.url}`)
  }

  const extractImages = config.extractImages !== false
  const extractLinks = config.extractLinks !== false
  const extractMetadata = config.extractMetadata !== false
  const format = config.format || 'json'

  // Test mode
  if (isTestMode()) {
    const mockAnalysis = {
      url: config.url,
      timestamp: new Date().toISOString(),
      metadata: config.extractMetadata ? {
        title: "Example Page Title",
        description: "This is a mock page description for testing purposes",
        author: "Test Author",
        publishDate: "2024-01-15",
        wordCount: 1250,
        language: "en",
        contentType: "text/html"
      } : null,
      content: {
        summary: "This page discusses web crawling technologies, OpenCode tools, and AI integration for automated data extraction.",
        topics: ["Web Crawling", "OpenCode", "AI Integration", "Data Extraction", "Automation"],
        sentiment: "Neutral",
        readabilityScore: 7.2,
        keywordDensity: {
          "crawling": 3.2,
          "opencode": 2.8,
          "automation": 1.9
        }
      },
      links: config.extractLinks ? [
        { url: `${config.url}/about`, text: "About Us", type: "internal" },
        { url: `${config.url}/contact`, text: "Contact", type: "internal" },
        { url: "https://external.com", text: "External Resource", type: "external" }
      ] : null,
      images: config.extractImages ? [
        { src: `${config.url}/images/logo.png`, alt: "Company Logo", size: "245x80" },
        { src: `${config.url}/images/hero.jpg`, alt: "Hero Image", size: "1200x400" }
      ] : null,
      performance: {
        loadTime: "1.2s",
        pageSize: "2.3MB",
        requests: 24
      }
    }
    
    return `[TEST MODE] Content analysis for ${config.url}\n\n${config.format === 'json' ? JSON.stringify(mockAnalysis, null, 2) : `# Content Analysis Report\n\n${JSON.stringify(mockAnalysis, null, 2)}`}`
  }

  try {
    // TODO: Implement actual content analysis with Crawl4AI
    return `Analyzing content from ${config.url}\n\nExtract options:\n- Images: ${config.extractImages}\n- Links: ${config.extractLinks}\n- Metadata: ${config.extractMetadata}\n- Format: ${config.format}\n\nNote: This is a placeholder implementation. Full content analysis will be implemented in the next phase.`
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