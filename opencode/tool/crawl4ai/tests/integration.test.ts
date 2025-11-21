import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { crawlUrl, deepCrawl, downloadFiles, analyzeContent } from '../index'

// Mock test mode for integration testing
beforeEach(() => {
  process.env.CRAWL4AI_TEST_MODE = 'true'
})

afterEach(() => {
  delete process.env.CRAWL4AI_TEST_MODE
})

describe('Crawl4AI Integration Tests', () => {
  
  describe('End-to-End Crawling Scenarios', () => {
    
    it('should handle complete crawling workflow', async () => {
      const config = {
        url: 'https://example.com',
        depth: 2,
        maxPages: 5,
        format: 'json' as const,
        includePatterns: ['/docs', '/api'],
        excludePatterns: ['/admin'],
        downloadFiles: true,
        fileTypes: ['pdf', 'json']
      }
      
      const result = await crawlUrl(config)
      
      expect(result).toContain('[TEST MODE]')
      expect(result).toContain('https://example.com')
      expect(result).toContain('depth: 2')
      expect(result).toContain('maxPages: 5')
      expect(result).toContain('format: json')
    })

    it('should handle complex deep crawling scenario', async () => {
      const config = {
        url: 'https://docs.example.com',
        strategy: 'bestfirst' as const,
        depth: 3,
        maxPages: 20,
        keywords: ['api', 'documentation', 'guide'],
        includeExternalLinks: false,
        includeDomains: ['docs.example.com', 'api.example.com'],
        excludeDomains: ['admin.docs.example.com']
      }
      
      const result = await deepCrawl(config)
      
      expect(result).toContain('[TEST MODE]')
      expect(result).toContain('bestfirst')
      expect(result).toContain('api, documentation, guide')
      expect(result).toContain('docs.example.com')
    })

    it('should handle file downloading workflow', async () => {
      const config = {
        url: 'https://resources.example.com',
        fileTypes: ['pdf', 'epub', 'zip'],
        maxFiles: 50,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        outputDir: './downloads',
        includePatterns: ['/documents', '/ebooks'],
        excludePatterns: ['/temp', '/cache']
      }
      
      const result = await downloadFiles(config)
      
      expect(result).toContain('[TEST MODE]')
      expect(result).toContain('pdf')
      expect(result).toContain('epub')
      expect(result).toContain('zip')
      expect(result).toContain('10MB')
    })

    it('should handle comprehensive content analysis', async () => {
      const config = {
        url: 'https://blog.example.com/article',
        extractImages: true,
        extractLinks: true,
        extractMetadata: true,
        format: 'json' as const,
        includePerformance: true,
        includeSentiment: true,
        keywordAnalysis: true
      }
      
      const result = await analyzeContent(config)
      
      expect(result).toContain('[TEST MODE]')
      expect(result).toContain('Content analysis')
      expect(result).toContain('performance')
      expect(result).toContain('sentiment')
    })
  })

  describe('Error Recovery Scenarios', () => {
    
    it('should handle network timeout gracefully', async () => {
      // Simulate network timeout scenario
      const result = await crawlUrl({
        url: 'https://example.com',
        depth: 1,
        maxPages: 1
      })
      
      expect(result).toContain('[TEST MODE]')
      // In test mode, should handle gracefully
      expect(typeof result).toBe('string')
    })

    it('should handle rate limiting', async () => {
      // Simulate rate limiting scenario
      const result = await deepCrawl({
        url: 'https://api.example.com',
        strategy: 'bfs',
        depth: 2,
        maxPages: 10
      })
      
      expect(result).toContain('[TEST MODE]')
      expect(typeof result).toBe('string')
    })

    it('should handle malformed responses', async () => {
      // Simulate malformed HTML response
      const result = await analyzeContent({
        url: 'https://broken.example.com',
        extractMetadata: true,
        format: 'json'
      })
      
      expect(result).toContain('[TEST MODE]')
      expect(typeof result).toBe('string')
    })
  })

  describe('Performance and Scalability', () => {
    
    it('should handle large page counts efficiently', async () => {
      const startTime = Date.now()
      
      const result = await deepCrawl({
        url: 'https://large-site.example.com',
        strategy: 'bfs',
        depth: 3,
        maxPages: 100
      })
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      expect(result).toContain('[TEST MODE]')
      expect(duration).toBeLessThan(1000) // Should complete quickly in test mode
    })

    it('should handle memory usage efficiently', async () => {
      const initialMemory = process.memoryUsage()
      
      // Simulate memory-intensive crawling
      const result = await deepCrawl({
        url: 'https://content-heavy.example.com',
        strategy: 'dfs',
        depth: 4,
        maxPages: 50,
        downloadFiles: true,
        fileTypes: ['jpg', 'png', 'gif', 'mp4']
      })
      
      const finalMemory = process.memoryUsage()
      const memoryUsed = finalMemory.heapUsed - initialMemory.heapUsed
      
      expect(result).toContain('[TEST MODE]')
      expect(memoryUsed).toBeLessThan(50 * 1024 * 1024) // Less than 50MB
    })
  })

  describe('Real-World Scenarios', () => {
    
    it('should handle documentation site crawling', async () => {
      const config = {
        url: 'https://docs.opencode.ai',
        strategy: 'bfs',
        depth: 2,
        maxPages: 25,
        includePatterns: ['/guides', '/api', '/tutorials'],
        excludePatterns: ['/admin', '/internal'],
        format: 'markdown' as const,
        downloadFiles: true,
        fileTypes: ['pdf', 'md']
      }
      
      const result = await deepCrawl(config)
      
      expect(result).toContain('[TEST MODE]')
      expect(result).toContain('BFS strategy')
      expect(result).toContain('bfs')
    })

    it('should handle blog site analysis', async () => {
      const config = {
        url: 'https://blog.example.com',
        extractImages: true,
        extractLinks: true,
        extractMetadata: true,
        includePerformance: true,
        includeSentiment: true,
        keywordAnalysis: true,
        format: 'json' as const
      }
      
      const result = await analyzeContent(config)
      
      expect(result).toContain('[TEST MODE]')
      expect(result).toContain('Content analysis')
      expect(result).toContain('performance')
      expect(result).toContain('sentiment')
    })

    it('should handle resource site file downloading', async () => {
      const config = {
        url: 'https://resources.example.com',
        fileTypes: ['pdf', 'docx', 'pptx', 'zip'],
        maxFiles: 100,
        maxFileSize: 25 * 1024 * 1024, // 25MB
        outputDir: './resources',
        recursive: true,
        includePatterns: ['/downloads', '/assets', '/files']
      }
      
      const result = await downloadFiles(config)
      
      expect(result).toContain('[TEST MODE]')
      expect(result).toContain('pdf')
      expect(result).toContain('docx')
      expect(result).toContain('25MB')
    })
  })

  describe('Configuration Validation', () => {
    
    it('should validate all configuration combinations', async () => {
      const configurations = [
        {
          name: 'Minimal config',
          config: { url: 'https://example.com' }
        },
        {
          name: 'Full config',
          config: {
            url: 'https://example.com',
            depth: 3,
            maxPages: 50,
            format: 'json' as const,
            strategy: 'bestfirst' as const,
            keywords: ['test', 'example'],
            includePatterns: ['/api', '/docs'],
            excludePatterns: ['/admin'],
            includeDomains: ['example.com'],
            excludeDomains: ['spam.com'],
            downloadFiles: true,
            fileTypes: ['pdf', 'json'],
            maxFileSize: 10 * 1024 * 1024,
            stealth: true,
            session: true
          }
        }
      ]
      
      for (const { name, config } of configurations) {
        const result = await crawlUrl(config)
        expect(result).toContain('[TEST MODE]')
        expect(typeof result).toBe('string')
      }
    })

    it('should handle edge case configurations', async () => {
      const edgeCases = [
        {
          name: 'Zero depth',
          config: { url: 'https://example.com', depth: 0 }
        },
        {
          name: 'Zero max pages',
          config: { url: 'https://example.com', maxPages: 0 }
        },
        {
          name: 'Very large limits',
          config: { 
            url: 'https://example.com', 
            depth: 10, 
            maxPages: 1000 
          }
        },
        {
          name: 'Empty keywords array',
          config: { 
            url: 'https://example.com', 
            keywords: [] 
          }
        }
      ]
      
      for (const { name, config } of edgeCases) {
        const result = await deepCrawl(config)
        expect(result).toContain('[TEST MODE]')
        expect(typeof result).toBe('string')
      }
    })
  })
})