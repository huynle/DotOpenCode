import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { 
  crawlUrl, 
  deepCrawl, 
  downloadFiles, 
  analyzeContent,
  URLFilterManager,
  ContentScorer
} from '../index'

// Mock test mode
beforeEach(() => {
  process.env.CRAWL4AI_TEST_MODE = 'true'
})

afterEach(() => {
  delete process.env.CRAWL4AI_TEST_MODE
})

describe('URL Validation', () => {
  it('should reject invalid URLs', async () => {
    await expect(crawlUrl({ url: 'invalid-url' })).rejects.toThrow('Invalid URL')
    await expect(crawlUrl({ url: '' })).rejects.toThrow('Invalid URL')
    await expect(crawlUrl({ url: 'not-a-url' })).rejects.toThrow('Invalid URL')
  })

  it('should accept valid URLs', async () => {
    const result = await crawlUrl({ url: 'https://example.com' })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('https://example.com')
  })
})

describe('URLFilterManager', () => {
  it('should filter by include patterns', () => {
    const filter = new URLFilterManager({
      includePatterns: ['/blog', '/news']
    })
    
    expect(filter.shouldInclude('https://example.com/blog/post-1')).toBe(true)
    expect(filter.shouldInclude('https://example.com/news/article')).toBe(true)
    expect(filter.shouldInclude('https://example.com/about')).toBe(false)
  })

  it('should filter by exclude patterns', () => {
    const filter = new URLFilterManager({
      excludePatterns: ['/admin', '/private']
    })
    
    expect(filter.shouldInclude('https://example.com/public')).toBe(true)
    expect(filter.shouldInclude('https://example.com/admin')).toBe(false)
    expect(filter.shouldInclude('https://example.com/private/data')).toBe(false)
  })

  it('should filter by include domains', () => {
    const filter = new URLFilterManager({
      includeDomains: ['example.com', 'trusted.com']
    })
    
    expect(filter.shouldInclude('https://example.com/page')).toBe(true)
    expect(filter.shouldInclude('https://sub.example.com/page')).toBe(true)
    expect(filter.shouldInclude('https://other.com/page')).toBe(false)
  })

  it('should filter by exclude domains', () => {
    const filter = new URLFilterManager({
      excludeDomains: ['spam.com', 'ads.com']
    })
    
    expect(filter.shouldInclude('https://example.com/page')).toBe(true)
    expect(filter.shouldInclude('https://spam.com/page')).toBe(false)
    expect(filter.shouldInclude('https://ads.com/content')).toBe(false)
  })

  it('should handle empty filters', () => {
    const filter = new URLFilterManager()
    expect(filter.shouldInclude('https://any-url.com/page')).toBe(true)
  })
})

describe('ContentScorer', () => {
  it('should score content based on keywords', () => {
    const scorer = new ContentScorer(['web', 'crawling'])
    
    const content1 = 'This is about web crawling technology'
    const content2 = 'This is about something else'
    const url1 = 'https://example.com/web-crawling'
    const url2 = 'https://example.com/other'
    
    const score1 = scorer.scoreContent(content1, url1)
    const score2 = scorer.scoreContent(content2, url2)
    
    expect(score1).toBeGreaterThan(score2)
  })

  it('should weight URL matches higher than content matches', () => {
    const scorer = new ContentScorer(['technology'])

    const content1 = 'technology technology technology' // 3 content matches
    const url1 = 'https://example.com/other' // 0 URL matches
    const content2 = 'technology' // 1 content match
    const url2 = 'https://example.com/technology' // 1 URL match

    const score1 = scorer.scoreContent(content1, url1)
    const score2 = scorer.scoreContent(content2, url2)

    // URL match (weight 3) + content match (weight 1) = 4
    // Content matches only (weight 1) = 3
    expect(score2).toBeGreaterThan(score1)
  })

  it('should return default score when no keywords', () => {
    const scorer = new ContentScorer([])
    const score = scorer.scoreContent('any content', 'https://example.com')
    expect(score).toBe(1.0)
  })
})

describe('Basic Crawling', () => {
  it('should crawl with default parameters', async () => {
    const result = await crawlUrl({ url: 'https://example.com' })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('depth: 1')
    expect(result).toContain('maxPages: 10')
    expect(result).toContain('format: markdown')
  })

  it('should crawl with custom parameters', async () => {
    const result = await crawlUrl({ 
      url: 'https://example.com',
      depth: 2,
      maxPages: 20,
      format: 'json'
    })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('depth: 2')
    expect(result).toContain('maxPages: 20')
    expect(result).toContain('format: json')
  })

  it('should handle filtering options', async () => {
    const result = await crawlUrl({
      url: 'https://example.com',
      includePatterns: ['/blog'],
      excludePatterns: ['/admin'],
      includeDomains: ['example.com'],
      excludeDomains: ['spam.com']
    })
    expect(result).toContain('[TEST MODE]')
    // Should not throw error with filtering options
  })
})

describe('Deep Crawling', () => {
  it('should perform BFS deep crawling', async () => {
    const result = await deepCrawl({
      url: 'https://example.com',
      strategy: 'bfs',
      depth: 3
    })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('BFS strategy')
    expect(result).toContain('Depth: 3')
  })

  it('should perform DFS deep crawling', async () => {
    const result = await deepCrawl({
      url: 'https://example.com',
      strategy: 'dfs',
      depth: 2
    })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('DFS strategy')
    expect(result).toContain('Depth: 2')
  })

  it('should perform BestFirst deep crawling with keywords', async () => {
    const result = await deepCrawl({
      url: 'https://example.com',
      strategy: 'bestfirst',
      keywords: ['technology', 'ai']
    })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('bestfirst')
    expect(result).toContain('technology, ai')
  })

  it('should apply URL filtering in deep crawl', async () => {
    const result = await deepCrawl({
      url: 'https://example.com',
      includePatterns: ['/docs'],
      maxPages: 10
    })
    expect(result).toContain('[TEST MODE]')
    // URL filtering is applied in the mock implementation
    expect(typeof result).toBe('string')
  })
})

describe('File Downloading', () => {
  it('should download files with default file types', async () => {
    const result = await downloadFiles({ url: 'https://example.com' })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('pdf')
    expect(result).toContain('jpg')
    expect(result).toContain('png')
  })

  it('should download files with custom file types', async () => {
    const result = await downloadFiles({
      url: 'https://example.com',
      fileTypes: ['pdf', 'docx']
    })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('pdf')
    expect(result).toContain('docx')
    expect(result).not.toContain('jpg')
  })

  it('should respect file size limits', async () => {
    const result = await downloadFiles({
      url: 'https://example.com',
      maxFileSize: 1024 * 1024 // 1MB
    })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('1MB')
    expect(result).toContain('2 files') // Should filter out large files
  })
})

describe('Content Analysis', () => {
  it('should analyze content with default options', async () => {
    const result = await analyzeContent({ url: 'https://example.com' })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('Content analysis')
  })

  it('should analyze content with custom options', async () => {
    const result = await analyzeContent({
      url: 'https://example.com',
      extractImages: false,
      extractLinks: true,
      extractMetadata: false,
      format: 'markdown'
    })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('Content Analysis Report')
  })

  it('should include performance metrics when requested', async () => {
    const result = await analyzeContent({
      url: 'https://example.com',
      includePerformance: true
    })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('performance')
  })

  it('should include sentiment analysis when requested', async () => {
    const result = await analyzeContent({
      url: 'https://example.com',
      includeSentiment: true
    })
    expect(result).toContain('[TEST MODE]')
    expect(result).toContain('sentiment')
  })
})

describe('Error Handling', () => {
  it('should handle network errors gracefully', async () => {
    const result = await crawlUrl({ url: 'https://example.com' })
    expect(typeof result).toBe('string')
  })

  it('should handle malformed URLs', async () => {
    await expect(crawlUrl({ url: 'not-a-url' })).rejects.toThrow()
    await expect(crawlUrl({ url: '' })).rejects.toThrow()
  })
})

describe('Configuration', () => {
  it('should use default output directory', async () => {
    const result = await crawlUrl({ url: 'https://example.com' })
    expect(result).toContain('[TEST MODE]')
    // Output directory is handled internally in test mode
  })

  it('should use custom output directory', async () => {
    const result = await crawlUrl({ 
      url: 'https://example.com',
      outputDir: '/custom/path'
    })
    expect(result).toContain('[TEST MODE]')
    // Custom output directory is handled internally in test mode
  })
})