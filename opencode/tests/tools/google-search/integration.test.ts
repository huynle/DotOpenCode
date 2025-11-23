/**
 * Integration tests for Google Search tool
 */

import { search } from "../../../tool/google-search"

describe('Google Search Integration', () => {
  test('should perform real search with valid API key', async () => {
    // This test requires a real SERPER_API_KEY
    // Skip if not available
    if (!process.env.SERPER_API_KEY) {
      console.log('Skipping integration test - SERPER_API_KEY not set')
      return
    }
    
    const result = await search.execute(
      { query: 'OpenCode AI' },
      {} as any
    )
    
    expect(typeof result).toBe('string')
    
    // Parse JSON to verify structure
    const parsed = JSON.parse(result)
    expect(Array.isArray(parsed)).toBe(true)
    
    if (parsed.length > 0) {
      const firstResult = parsed[0]
      expect(firstResult).toHaveProperty('title')
      expect(firstResult).toHaveProperty('link')
      expect(firstResult).toHaveProperty('snippet')
    }
  })

  test('should handle network errors gracefully', async () => {
    // Test with invalid API key to trigger error handling
    process.env.SERPER_API_KEY = 'invalid-key'
    
    const result = await search.execute(
      { query: 'test query' },
      {} as any
    )
    
    expect(typeof result).toBe('string')
    expect(result).toContain('error')
  })
})