/**
 * Validation tests for Google Search tool
 */

import { search } from "../../../tool/google-search"

describe('Google Search Validation', () => {
  test('should return string type', async () => {
    const result = await search.execute(
      { query: 'test' },
      {} as any
    )
    
    expect(typeof result).toBe('string')
  })

  test('should validate query parameter', () => {
    const schema = search.args.query
    expect(schema._def.type).toBe('string')
    expect(schema._def.description).toContain('Search query')
  })

  test('should handle empty queries', async () => {
    const result = await search.execute(
      { query: '' },
      {} as any
    )
    
    expect(typeof result).toBe('string')
    // Should either return results or error, but not crash
  })

  test('should handle special characters in queries', async () => {
    const result = await search.execute(
      { query: 'TypeScript "best practices" 2024' },
      {} as any
    )
    
    expect(typeof result).toBe('string')
  })

  test('should handle long queries', async () => {
    const longQuery = 'a'.repeat(1000)
    const result = await search.execute(
      { query: longQuery },
      {} as any
    )
    
    expect(typeof result).toBe('string')
  })
})