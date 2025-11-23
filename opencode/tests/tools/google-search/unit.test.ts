/**
 * Unit tests for Google Search tool
 */

import { search } from "../../../tool/google-search"

describe('Google Search Tool', () => {
  test('should have correct tool definition', () => {
    expect(search.description).toContain('real-time internet research')
    expect(search.args).toHaveProperty('query')
    expect(search.args.query).toHaveProperty('description')
  })

  test('should execute successfully with valid query', async () => {
    // Mock test mode
    process.env.SERPER_API_KEY = 'test-key'
    
    const result = await search.execute(
      { query: 'test query' },
      {} as any
    )
    
    expect(typeof result).toBe('string')
    expect(result).toContain('title')
    expect(result).toContain('link')
    expect(result).toContain('snippet')
  })

  test('should handle missing API key gracefully', async () => {
    // Remove API key
    delete process.env.SERPER_API_KEY
    
    const result = await search.execute(
      { query: 'test query' },
      {} as any
    )
    
    expect(typeof result).toBe('string')
    expect(result).toContain('SERPER_API_KEY')
  })
})