// Simple test to verify crawl4ai exports are accessible
import { describe, it, expect } from 'bun:test'

describe('Tool Index Exports', () => {
  it('should export crawl4ai functions correctly', async () => {
    // Test importing from updated index
    const toolModule = await import('./index')
    
    // Check that crawl4ai functions are exported
    expect(typeof toolModule.crawl).toBe('function')
    expect(typeof toolModule.deepCrawlTool).toBe('function')
    expect(typeof toolModule.download).toBe('function')
    expect(typeof toolModule.analyzeContent).toBe('function')
    expect(typeof toolModule.crawl4ai).toBe('function')
    
    console.log('✅ All crawl4ai exports are accessible')
  })
  
  it('should still export existing tools', async () => {
    const toolModule = await import('./index')
    
    // Check that existing exports still work
    expect(typeof toolModule.validate).toBe('function')
    expect(typeof toolModule.generate).toBe('function')
    expect(typeof toolModule.analyze).toBe('function') // gemini analyze
    expect(typeof toolModule.getEnvVariable).toBe('function')
    
    console.log('✅ All existing exports still work')
  })
  
  it('should have correct export names', async () => {
    const toolModule = await import('./index')
    
    // Check export names to avoid conflicts
    const exportNames = Object.keys(toolModule)
    
    // Should have both gemini analyze and crawl4ai analyzeContent (no conflict)
    expect(exportNames).toContain('analyze') // gemini analyze
    expect(exportNames).toContain('analyzeContent') // crawl4ai analyze
    
    // Should have crawl4ai exports
    expect(exportNames).toContain('crawl')
    expect(exportNames).toContain('deepCrawlTool')
    expect(exportNames).toContain('download')
    expect(exportNames).toContain('crawl4ai')
    
    console.log('✅ Export names are correct and non-conflicting')
  })
})