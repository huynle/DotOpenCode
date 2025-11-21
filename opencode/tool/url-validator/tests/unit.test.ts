/**
 * Unit Tests for URL Validator Tool
 * Tests individual functions in isolation
 */

import { describe, it, expect, beforeEach } from 'bun:test'

// Import the core functions (not the tool definitions)
// We'll need to export these from the main file for testing
// For now, we'll test via the tool interface

describe('URL Validator Tool - Unit Tests', () => {
  
  describe('Format Validation', () => {
    it('should validate correct URLs', async () => {
      // Test via tool interface
      const result = await validateUrl('https://example.com', { checkFormat: true })
      const parsed = JSON.parse(result)
      
      expect(parsed.valid).toBe(true)
      expect(parsed.validations.format.valid).toBe(true)
    })

    it('should reject invalid URLs', async () => {
      const result = await validateUrl('not-a-url', { checkFormat: true })
      const parsed = JSON.parse(result)
      
      expect(parsed.valid).toBe(false)
      expect(parsed.validations.format.valid).toBe(false)
      expect(parsed.validations.format.error).toBeDefined()
    })

    it('should handle edge cases', async () => {
      const testCases = [
        { url: 'http://localhost:3000', valid: true },
        { url: 'ftp://files.example.com', valid: true },
        { url: 'javascript:alert(1)', valid: true }, // Format is valid, security will catch
        { url: '', valid: false },
        { url: 'http://', valid: false }
      ]

      for (const testCase of testCases) {
        const result = await validateUrl(testCase.url, { checkFormat: true })
        const parsed = JSON.parse(result)
        
        if (testCase.valid) {
          expect(parsed.validations.format.valid).toBe(true)
        } else {
          expect(parsed.validations.format.valid).toBe(false)
        }
      }
    })
  })

  describe('Security Validation', () => {
    it('should detect JavaScript protocol', async () => {
      const result = await validateUrl('javascript:alert(1)', { 
        checkFormat: true, 
        checkSecurity: true 
      })
      const parsed = JSON.parse(result)
      
      expect(parsed.validations.security.valid).toBe(false)
      expect(parsed.validations.security.issues).toContain('JavaScript protocol detected')
    })

    it('should detect path traversal', async () => {
      const result = await validateUrl('https://example.com/../../../etc/passwd', { 
        checkFormat: true, 
        checkSecurity: true 
      })
      const parsed = JSON.parse(result)
      
      expect(parsed.validations.security.valid).toBe(false)
      expect(parsed.validations.security.issues).toContain('Path traversal pattern detected')
    })

    it('should detect credentials in URL', async () => {
      const result = await validateUrl('https://user:pass@example.com', { 
        checkFormat: true, 
        checkSecurity: true 
      })
      const parsed = JSON.parse(result)
      
      expect(parsed.validations.security.valid).toBe(false)
      expect(parsed.validations.security.issues).toContain('Credentials in URL')
    })

    it('should pass clean URLs', async () => {
      const result = await validateUrl('https://example.com/path', { 
        checkFormat: true, 
        checkSecurity: true 
      })
      const parsed = JSON.parse(result)
      
      expect(parsed.validations.security.valid).toBe(true)
      expect(parsed.validations.security.issues).toHaveLength(0)
    })
  })

  describe('Accessibility Check', () => {
    it('should check accessible URLs', async () => {
      // Using a reliable public URL
      const result = await validateUrl('https://httpbin.org/status/200', { 
        checkFormat: true, 
        checkAccessibility: true 
      })
      const parsed = JSON.parse(result)
      
      expect(parsed.validations.accessibility.accessible).toBe(true)
      expect(parsed.validations.accessibility.status).toBe(200)
    })

    it('should handle inaccessible URLs', async () => {
      const result = await validateUrl('https://httpbin.org/status/404', { 
        checkFormat: true, 
        checkAccessibility: true 
      })
      const parsed = JSON.parse(result)
      
      expect(parsed.validations.accessibility.accessible).toBe(false)
      expect(parsed.validations.accessibility.status).toBe(404)
    })

    it('should handle network errors gracefully', async () => {
      const result = await validateUrl('https://nonexistent-domain-12345.com', { 
        checkFormat: true, 
        checkAccessibility: true 
      })
      const parsed = JSON.parse(result)
      
      expect(parsed.validations.accessibility.accessible).toBe(false)
      expect(parsed.validations.accessibility.error).toBeDefined()
    })
  })

  describe('Combined Validation', () => {
    it('should run all validations together', async () => {
      const result = await validateUrl('https://example.com', {
        checkFormat: true,
        checkSecurity: true,
        checkAccessibility: true
      })
      const parsed = JSON.parse(result)
      
      expect(parsed.url).toBe('https://example.com')
      expect(parsed.timestamp).toBeDefined()
      expect(parsed.validations.format).toBeDefined()
      expect(parsed.validations.security).toBeDefined()
      expect(parsed.validations.accessibility).toBeDefined()
      expect(parsed.valid).toBeDefined()
    })

    it('should fail overall if any validation fails', async () => {
      const result = await validateUrl('javascript:alert(1)', {
        checkFormat: true,
        checkSecurity: true,
        checkAccessibility: false
      })
      const parsed = JSON.parse(result)
      
      expect(parsed.valid).toBe(false)
    })
  })

  describe('Output Format', () => {
    it('should return valid JSON string', async () => {
      const result = await validateUrl('https://example.com')
      
      expect(typeof result).toBe('string')
      
      const parsed = JSON.parse(result)
      expect(parsed).toBeObject()
      expect(parsed.url).toBe('https://example.com')
      expect(parsed.timestamp).toBeDefined()
      expect(parsed.validations).toBeDefined()
    })

    it('should include all required fields', async () => {
      const result = await validateUrl('https://example.com', {
        checkFormat: true,
        checkSecurity: true,
        checkAccessibility: true
      })
      const parsed = JSON.parse(result)
      
      // Required top-level fields
      expect(parsed).toHaveProperty('url')
      expect(parsed).toHaveProperty('timestamp')
      expect(parsed).toHaveProperty('validations')
      expect(parsed).toHaveProperty('valid')
      
      // Required validation fields
      expect(parsed.validations).toHaveProperty('format')
      expect(parsed.validations).toHaveProperty('security')
      expect(parsed.validations).toHaveProperty('accessibility')
    })
  })
})

// Helper function for testing (would be exported from main file)
async function validateUrl(url: string, options: any = {}): Promise<string> {
  // This would be imported from the main module
  // For now, we'll simulate the expected behavior
  return JSON.stringify({
    url,
    timestamp: new Date().toISOString(),
    valid: true,
    validations: {
      format: { valid: true },
      security: { valid: true, issues: [] },
      accessibility: { accessible: true, status: 200 }
    }
  })
}