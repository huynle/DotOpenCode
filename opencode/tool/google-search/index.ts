/**
 * Google Search Tool for OpenCode
 * Provides real-time internet research capabilities using serper.dev API
 */

import { tool } from "@opencode-ai/plugin/tool"

/**
 * Google Search Tool
 * Performs real-time web searches using serper.dev API
 */
export const search = tool({
  description: "Perform real-time internet research using Google Search. Returns top 5 organic results with title, link, and snippet. Requires SERPER_API_KEY environment variable.",
  args: {
    query: tool.schema.string().describe("Search query string (e.g., 'latest AI developments', 'TypeScript best practices')"),
  },
  async execute(args, context) {
    try {
      // Get the directory where this tool is located
      // In Bun, we can use import.meta.dir
      const toolDir = import.meta.dir
      const scriptPath = `${toolDir}/index.py`
      
      // Execute Python script with query argument
      const result = await Bun.$`python3 ${scriptPath} ${args.query}`.text()
      
      // Return the JSON result as a string
      return result.trim()
      
    } catch (error) {
      // Handle execution errors
      const errorMessage = error instanceof Error ? error.message : String(error)
      return JSON.stringify({
        error: "Failed to execute Google search",
        details: errorMessage,
        hint: "Ensure Python 3 is installed and SERPER_API_KEY is set"
      })
    }
  },
})

// Default export
export default search
