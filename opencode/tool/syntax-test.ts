// Simple syntax test - checking if exports are properly structured
export const test = "test"

// Mock the crawl4ai exports for syntax testing
const mockCrawl = () => "crawl"
const mockDeepCrawlTool = () => "deepCrawlTool"
const mockDownload = () => "download"
const mockAnalyzeContent = () => "analyzeContent"

export {
  mockCrawl as crawl,
  mockDeepCrawlTool,
  mockDownload as download,
  mockAnalyzeContent as analyzeContent
}

export default mockCrawl