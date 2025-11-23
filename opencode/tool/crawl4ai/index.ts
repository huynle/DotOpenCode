import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Advanced web crawler. Can crawl single pages, deeply crawl a site, or extract specific data using schemas. Supports authenticated crawling if cookies are provided.",
  args: {
    url: tool.schema.string().describe("The URL to start crawling"),
    depth: tool.schema.number().optional().describe("0 for single page, 1 or 2 for deep crawling links found on the page."),
    auth_file: tool.schema.string().optional().describe("Filename of cookies.json in .opencode/auth/ for logged-in sites (e.g. 'linkedin.json')"),
    schema: tool.schema.string().optional().describe("JSON string defining CSS selectors for extraction. Use this to get clean JSON data instead of raw text."),
  },
  async execute(args) {
    // We pass arguments as a single JSON string to avoid command line parsing issues
    const jsonArgs = JSON.stringify(args).replace(/"/g, '\\"'); 
    const result = await Bun.$`python3 .opencode/tool/smart_crawl.py "${jsonArgs}"`.text()
    return result.trim()
  },
})
