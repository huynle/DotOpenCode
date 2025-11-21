import { tool } from "@opencode-ai/plugin/tool"

// Core validation functions
function validateFormat(url: string): { valid: boolean; error?: string } {
  try {
    new URL(url)
    return { valid: true }
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Invalid URL format' }
  }
}

function validateSecurity(url: string): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  const urlObj = new URL(url)
  
  // Check for suspicious patterns
  if (urlObj.protocol === 'javascript:') {
    issues.push('JavaScript protocol detected')
  }
  
  if (url.includes('..')) {
    issues.push('Path traversal pattern detected')
  }
  
  if (urlObj.username || urlObj.password) {
    issues.push('Credentials in URL')
  }
  
  return { valid: issues.length === 0, issues }
}

// Main tool function
async function validateUrl(url: string, options: {
  checkFormat?: boolean
  checkSecurity?: boolean
  checkAccessibility?: boolean
} = {}): Promise<string> {
  const {
    checkFormat = true,
    checkSecurity = true,
    checkAccessibility = false
  } = options

  const result: any = {
    url,
    timestamp: new Date().toISOString(),
    validations: {}
  }

  // Format validation
  if (checkFormat) {
    const formatResult = validateFormat(url)
    result.validations.format = formatResult
    if (!formatResult.valid) {
      result.valid = false
      return JSON.stringify(result)
    }
  }

  // Security validation
  if (checkSecurity) {
    result.validations.security = validateSecurity(url)
  }

  // Accessibility check
  if (checkAccessibility) {
    result.validations.accessibility = await checkAccessibility(url)
  }

  // Overall validity
  result.valid = Object.values(result.validations).every((v: any) => 
    v.valid !== false && v.accessible !== false
  )

  return JSON.stringify(result, null, 2)
}

// Tool definition for OpenCode
export const validate = tool({
  description: "Validate URLs for format, security, and accessibility",
  args: {
    url: tool.schema.string().describe("The URL to validate"),
    checkFormat: tool.schema.boolean().optional().describe("Check URL format (default: true)"),
    checkSecurity: tool.schema.boolean().optional().describe("Check for security issues (default: true)"),
    checkAccessibility: tool.schema.boolean().optional().describe("Check if URL is accessible (default: false)")
  },
  async execute(args, context) {
    try {
      return await validateUrl(args.url, {
        checkFormat: args.checkFormat,
        checkSecurity: args.checkSecurity,
        checkAccessibility: args.checkAccessibility
      })
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
    }
  },
})

// Convenience export for accessibility check
export const checkAccessibility = tool({
  description: "Check if a URL is accessible (returns HTTP status)",
  args: {
    url: tool.schema.string().describe("The URL to check accessibility for")
  },
  async execute(args, context) {
    try {
      const result = await validateUrl(args.url, {
        checkFormat: true,
        checkSecurity: false,
        checkAccessibility: true
      })
      return result
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
    }
  },
})

// Default export
export default validate
