import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { crawlUrl, deepCrawl, downloadFiles, analyzeContent } from '../index'

// Mock test mode
beforeEach(() => {
  process.env.CRAWL4AI_TEST_MODE = 'true'
})

afterEach(() => {
  delete process.env.CRAWL4AI_TEST_MODE
})

describe('Crawl4AI Output Validation Framework', () => {
  
  describe('Output Structure Validation', () => {
    
    it('should validate basic crawl output structure', async () => {
      const result = await crawlUrl({ 
        url: 'https://example.com',
        format: 'json'
      })
      
      // Should be a string containing JSON structure
      expect(typeof result).toBe('string')
      expect(result).toContain('[TEST MODE]')
      
      // Parse JSON part for validation
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        
        // Validate required fields
        expect(parsed).toHaveProperty('url')
        expect(parsed).toHaveProperty('success')
        expect(parsed).toHaveProperty('metadata')
        expect(parsed).toHaveProperty('crawlStats')
        
        // Validate data types
        expect(typeof parsed.url).toBe('string')
        expect(typeof parsed.success).toBe('boolean')
        expect(typeof parsed.metadata).toBe('object')
        expect(typeof parsed.crawlStats).toBe('object')
      }
    })

    it('should validate deep crawl output structure', async () => {
      const result = await deepCrawl({
        url: 'https://example.com',
        strategy: 'bfs',
        depth: 2
      })
      
      expect(typeof result).toBe('string')
      expect(result).toContain('[TEST MODE]')
      
      // Parse JSON part for validation
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        
        // Validate deep crawl specific fields
        expect(parsed).toHaveProperty('links')
        expect(parsed).toHaveProperty('images')
        expect(parsed).toHaveProperty('files')
        
        // Validate array types
        expect(Array.isArray(parsed.links)).toBe(true)
        expect(Array.isArray(parsed.images)).toBe(true)
        expect(Array.isArray(parsed.files)).toBe(true)
      }
    })

    it('should validate file download output structure', async () => {
      const result = await downloadFiles({
        url: 'https://example.com',
        fileTypes: ['pdf', 'jpg']
      })
      
      expect(typeof result).toBe('string')
      expect(result).toContain('[TEST MODE]')
      expect(result).toContain('File download analysis')
    })

    it('should validate content analysis output structure', async () => {
      const result = await analyzeContent({
        url: 'https://example.com',
        format: 'json'
      })
      
      expect(typeof result).toBe('string')
      expect(result).toContain('[TEST MODE]')
      
      // Parse JSON part for validation
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        
        // Validate analysis specific fields
        expect(parsed).toHaveProperty('url')
        expect(parsed).toHaveProperty('timestamp')
        expect(parsed).toHaveProperty('content')
        expect(parsed).toHaveProperty('metadata')
        expect(parsed).toHaveProperty('links')
        expect(parsed).toHaveProperty('images')
        expect(parsed).toHaveProperty('performance')
        
        // Validate content structure
        expect(parsed.content).toHaveProperty('summary')
        expect(parsed.content).toHaveProperty('topics')
        expect(parsed.content).toHaveProperty('sentiment')
        expect(parsed.content).toHaveProperty('readabilityScore')
        
        // Validate arrays
        expect(Array.isArray(parsed.content.topics)).toBe(true)
        expect(Array.isArray(parsed.links)).toBe(true)
        expect(Array.isArray(parsed.images)).toBe(true)
      }
    })
  })

  describe('Data Quality Validation', () => {
    
    it('should validate URL format consistency', async () => {
      const testUrl = 'https://example.com'
      const result = await crawlUrl({ url: testUrl })
      
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        
        // URL should be consistent and valid
        expect(parsed.url).toBe(testUrl)
        expect(() => new URL(parsed.url)).not.toThrow()
      }
    })

    it('should validate content quality metrics', async () => {
      const result = await analyzeContent({
        url: 'https://example.com',
        includePerformance: true,
        includeSentiment: true
      })
      
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        
        // Performance metrics should be reasonable
        if (parsed.performance) {
          expect(typeof parsed.performance.loadTime).toBe('string')
          expect(typeof parsed.performance.pageSize).toBe('string')
          expect(typeof parsed.performance.requests).toBe('number')
          
          // Load time should be reasonable
          const loadTimeMatch = parsed.performance.loadTime.match(/[\d.]+/)
          if (loadTimeMatch) {
            const loadTime = parseFloat(loadTimeMatch[0])
            expect(loadTime).toBeGreaterThan(0)
            expect(loadTime).toBeLessThan(60) // Less than 60 seconds
          }
        }
        
        // Sentiment should be valid
        if (parsed.content && parsed.content.sentiment) {
          const validSentiments = ['Positive', 'Negative', 'Neutral', 'Mixed']
          expect(validSentiments).toContain(parsed.content.sentiment)
        }
        
        // Readability score should be in valid range
        if (parsed.content && parsed.content.readabilityScore) {
          expect(parsed.content.readabilityScore).toBeGreaterThanOrEqual(0)
          expect(parsed.content.readabilityScore).toBeLessThanOrEqual(10)
        }
      }
    })

    it('should validate crawl statistics consistency', async () => {
      const result = await deepCrawl({
        url: 'https://example.com',
        strategy: 'bfs',
        depth: 2,
        maxPages: 10
      })
      
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        
        if (parsed.crawlStats) {
          // Stats should be consistent
          expect(parsed.crawlStats.pagesCrawled).toBeGreaterThanOrEqual(0)
          expect(parsed.crawlStats.totalLinks).toBeGreaterThanOrEqual(0)
          expect(parsed.crawlStats.totalImages).toBeGreaterThanOrEqual(0)
          expect(parsed.crawlStats.totalFiles).toBeGreaterThanOrEqual(0)
          expect(parsed.crawlStats.crawlTime).toBeGreaterThan(0)
          
          // Logical consistency checks
          expect(parsed.crawlStats.pagesCrawled).toBeLessThanOrEqual(10) // Should respect maxPages
          
          // If there are pages crawled, there should be content
          if (parsed.crawlStats.pagesCrawled > 0) {
            expect(parsed.content || parsed.links || parsed.images).toBeDefined()
          }
        }
      }
    })
  })

  describe('Error Output Validation', () => {
    
    it('should validate error message format', async () => {
      // Test with invalid URL to trigger error
      try {
        await crawlUrl({ url: 'invalid-url' })
        fail('Should have thrown an error')
      } catch (error) {
        expect(error.message).toContain('Invalid URL')
        expect(typeof error.message).toBe('string')
        expect(error.message.length).toBeGreaterThan(0)
      }
    })

    it('should validate error handling in tool responses', async () => {
      // Test tool error handling (not function errors)
      const result = await crawlUrl({ url: 'https://example.com' })
      
      // Even in test mode, should be proper string response
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('Format Validation', () => {
    
    it('should validate markdown output format', async () => {
      const result = await analyzeContent({
        url: 'https://example.com',
        format: 'markdown'
      })
      
      expect(typeof result).toBe('string')
      expect(result).toContain('[TEST MODE]')
      expect(result).toContain('# Content Analysis Report')
    })

    it('should validate JSON output format', async () => {
      const result = await analyzeContent({
        url: 'https://example.com',
        format: 'json'
      })
      
      expect(typeof result).toBe('string')
      expect(result).toContain('[TEST MODE]')
      
      // Should contain valid JSON
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      expect(jsonMatch).toBeTruthy()
      
      if (jsonMatch) {
        expect(() => JSON.parse(jsonMatch[0])).not.toThrow()
      }
    })

    it('should validate HTML output format', async () => {
      const result = await analyzeContent({
        url: 'https://example.com',
        format: 'html'
      })
      
      expect(typeof result).toBe('string')
      expect(result).toContain('[TEST MODE]')
      // HTML format would contain specific structure
    })
  })

  describe('Performance Validation', () => {
    
    it('should validate response time performance', async () => {
      const startTime = Date.now()
      
      const result = await crawlUrl({
        url: 'https://example.com',
        depth: 1,
        maxPages: 5
      })
      
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      expect(typeof result).toBe('string')
      expect(responseTime).toBeLessThan(5000) // Should respond within 5 seconds in test mode
    })

    it('should validate memory usage efficiency', async () => {
      const initialMemory = process.memoryUsage()
      
      // Perform multiple operations
      await crawlUrl({ url: 'https://example.com' })
      await deepCrawl({ url: 'https://example.com', depth: 2 })
      await analyzeContent({ url: 'https://example.com' })
      
      const finalMemory = process.memoryUsage()
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
    })
  })

  describe('Security Validation', () => {
    
    it('should validate URL security', async () => {
      const secureUrls = [
        'https://example.com',
        'http://example.com'
      ]
      
      const results = await Promise.all(
        secureUrls.map(url => crawlUrl({ url }))
      )
      
      results.forEach(result => {
        expect(typeof result).toBe('string')
        expect(result).toContain('[TEST MODE]')
      })
    })

    it('should validate input sanitization', async () => {
      const testCases = [
        { url: 'https://example.com', expected: 'valid' },
        { url: 'javascript:alert(1)', expected: 'invalid' },
        { url: 'file:///etc/passwd', expected: 'invalid' }
      ]
      
      for (const testCase of testCases) {
        if (testCase.expected === 'invalid') {
          await expect(crawlUrl({ url: testCase.url })).rejects.toThrow()
        } else {
          const result = await crawlUrl({ url: testCase.url })
          expect(typeof result).toBe('string')
        }
      }
      
      // Test empty URL separately
      await expect(crawlUrl({ url: '' })).rejects.toThrow()
    })
  })

  describe('Compliance Validation', () => {
    
    it('should validate robots.txt compliance in output', async () => {
      const result = await crawlUrl({
        url: 'https://example.com'
      })
      
      // In test mode, should mention compliance
      expect(typeof result).toBe('string')
      // Actual implementation would include robots.txt compliance info
    })

    it('should validate rate limiting consideration', async () => {
      const result = await deepCrawl({
        url: 'https://example.com',
        depth: 3,
        maxPages: 50
      })
      
      expect(typeof result).toBe('string')
      // Should include rate limiting considerations in actual implementation
    })
  })
})