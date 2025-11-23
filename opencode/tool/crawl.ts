import { tool } from "@opencode-ai/plugin/tool"

export const smart_crawl = tool({
  description: "Advanced web crawler with Chrome profile support. Capabilities: 1) Read single pages (Markdown). 2) Deep crawl a website (follow links). 3) Extract structured data (JSON) using CSS selectors. 4) Access authenticated content using your Chrome profile (stays logged in automatically).",
  args: {
    url: tool.schema.string().describe("The target URL to crawl"),
    depth: tool.schema.number().optional().describe("Recursion depth for deep crawling (0 = single page, 1-2 = follow links). Default: 0"),
    use_chrome: tool.schema.boolean().optional().describe("Use your Chrome profile for authentication (recommended). This keeps you logged into sites automatically. Default: false"),
    chrome_profile: tool.schema.string().optional().describe("Chrome profile name to use (e.g., 'Default', 'Profile 1'). Only used if use_chrome is true. Default: 'Default'"),
    headless: tool.schema.boolean().optional().describe("Run browser in headless mode (invisible). Set to false to see the browser. Default: true"),
    css_schema: tool.schema.string().optional().describe("Stringified JSON object defining CSS selectors for structured data extraction. Use this to get clean JSON instead of raw markdown."),
  },
  async execute(args, context) {
    try {
      // Serialize arguments to JSON
      const jsonConfig = JSON.stringify(args)
      
      // Execute Python script with JSON config
      const result = await Bun.$`python3 opencode/tool/smart_crawl.py ${jsonConfig}`.text()
      
      // Return the result (already JSON formatted from Python)
      return result.trim()
    } catch (error) {
      return JSON.stringify({
        error: "Execution failed",
        message: error instanceof Error ? error.message : String(error)
      })
    }
  },
})

// Export as default for convenience
export default smart_crawl
