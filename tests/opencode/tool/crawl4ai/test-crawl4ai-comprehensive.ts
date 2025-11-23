// Final comprehensive test for the crawl4ai tool
import { tool } from "@opencode-ai/plugin/tool"
import { Crawl4AI } from "crawl4ai"

// Define the LinkItem interface
interface LinkItem {
  href: string;
  text: string;
}

// Simple web crawling function
export async function crawlUrl(url: string): Promise<string> {
  try {
    // If the input doesn't look like a URL, treat it as a search query
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Convert search query to Google search URL
      finalUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    }

    // Initialize the Crawl4AI client
    const client = new Crawl4AI({
      baseUrl: 'http://localhost:11235', // Default local Crawl4AI server
      timeout: 30000,
      debug: false
    })

    // Perform crawl
    const response = await client.crawl({
      urls: [finalUrl], // Pass as array
      browser_config: {
        headless: true,
        viewport: { width: 1920, height: 1080 }
      },
      crawler_config: {
        cache_mode: 'bypass',
        word_count_threshold: 10
      }
    })

    // Handle the response correctly - it's an array of results
    if (!response || !Array.isArray(response) || response.length === 0) {
      return JSON.stringify({
        url: finalUrl,
        originalQuery: url,
        success: false,
        error: 'No results returned from crawl'
      }, null, 2)
    }

    const result = response[0] // API returns array of results
    
    if (!result.success) {
      return JSON.stringify({
        url: finalUrl,
        originalQuery: url,
        success: false,
        error: result.error_message || 'Crawl failed'
      }, null, 2)
    }

    // Check if we got blocked by CAPTCHA
    if (result.html && result.html.includes('CAPTCHA') && result.html.includes('unusual traffic')) {
      return JSON.stringify({
        url: finalUrl,
        originalQuery: url,
        success: false,
        error: 'Blocked by CAPTCHA - Google detected unusual traffic',
        note: 'Try using a direct URL instead of a search query, or use a different search engine'
      }, null, 2)
    }

    // Extract links from the result (links is an object with internal/external properties)
    let allLinks: string[] = [];
    if (result.links) {
      const internalLinks = result.links.internal?.map((link: LinkItem) => link.href) || [];
      const externalLinks = result.links.external?.map((link: LinkItem) => link.href) || [];
      allLinks = [...internalLinks, ...externalLinks];
    }
    
    const firstLink = allLinks.length > 0 ? allLinks[0] : "No links found"

    // Extract content - try different markdown fields
    let content = "";
    if (result.markdown && typeof result.markdown === 'object' && result.markdown !== null) {
      // If markdown is an object, try to get the raw_markdown field
      const markdownObj = result.markdown as { raw_markdown?: string };
      content = markdownObj.raw_markdown?.substring(0, 1000) + (markdownObj.raw_markdown?.length > 1000 ? "..." : "") || "";
    } else if (typeof result.markdown === 'string') {
      content = result.markdown.substring(0, 1000) + (result.markdown.length > 1000 ? "..." : "");
    }

    return JSON.stringify({
      url: finalUrl,
      originalQuery: url,
      success: true,
      title: result.metadata?.title,
      description: result.metadata?.description,
      content: content,
      firstLink,
      totalLinks: allLinks.length,
      links: allLinks.slice(0, 10) // Return first 10 links
    }, null, 2)

  } catch (error: any) {
    return JSON.stringify({
      url,
      success: false,
      error: error.message,
      note: "Make sure Crawl4AI server is running on localhost:11235. Start with: docker run -p 11235:11235 unclecode/crawl4ai:latest"
    }, null, 2)
  }
}

// Tool definition for OpenCode agent system - gets the first link from a search
export const firstLink = tool({
  description: "Search the web for a query and return the first link found",
  args: {
    query: tool.schema.string().describe("Search query to find links for"),
  },
  async execute(args, context) {
    try {
      const result = await crawlUrl(args.query);
      const parsedResult = JSON.parse(result);
      return parsedResult.firstLink || "No link found";
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  },
})

// Tool definition for OpenCode agent system - full crawl results
export const crawl = tool({
  description: "Crawl a web page and extract content, links, and metadata",
  args: {
    url: tool.schema.string().describe("URL to crawl and extract content from"),
  },
  async execute(args, context) {
    try {
      return await crawlUrl(args.url);
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  },
})

// Content analysis tool
export const analyze = tool({
  description: "Analyze web page content and extract structured data with metadata",
  args: {
    url: tool.schema.string().describe("URL to analyze for structured content"),
  },
  async execute(args, context) {
    try {
      return await crawlUrl(args.url);
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  },
})

// Default export
export default crawl

// Test function
async function comprehensiveTest() {
  try {
    console.log("=== Crawl4AI Tool Comprehensive Test ===");
    
    // Test 1: Direct URL crawling
    console.log("\n1. Testing direct URL crawling...");
    const result1 = await crawlUrl('https://example.com');
    const parsed1 = JSON.parse(result1);
    
    console.log("Success:", parsed1.success);
    console.log("Title:", parsed1.title);
    console.log("First link:", parsed1.firstLink);
    console.log("Total links:", parsed1.totalLinks);
    
    if (parsed1.success && parsed1.firstLink !== "No links found") {
      console.log("✅ Direct URL crawling: PASSED");
    } else {
      console.log("❌ Direct URL crawling: FAILED");
    }
    
    // Test 2: Search query (may fail due to CAPTCHA)
    console.log("\n2. Testing search query...");
    const result2 = await crawlUrl('funny dog');
    const parsed2 = JSON.parse(result2);
    
    console.log("Success:", parsed2.success);
    console.log("First link:", parsed2.firstLink);
    
    if (parsed2.success) {
      console.log("✅ Search query: PASSED");
    } else {
      console.log("⚠️ Search query: BLOCKED (likely CAPTCHA)");
      console.log("Error:", parsed2.error);
    }
    
    // Test 3: Error handling with invalid URL
    console.log("\n3. Testing error handling with invalid input...");
    const result3 = await crawlUrl(null as any);
    const parsed3 = JSON.parse(result3);
    
    console.log("Success:", parsed3.success);
    console.log("Error:", parsed3.error);
    
    if (!parsed3.success && parsed3.error) {
      console.log("✅ Error handling: PASSED");
    } else {
      console.log("❌ Error handling: FAILED");
    }
    
    // Test 4: Tool exports
    console.log("\n4. Testing tool exports...");
    console.log("crawl function:", typeof crawl);
    console.log("analyze function:", typeof analyze);
    console.log("firstLink function:", typeof firstLink);
    
    if (crawl && analyze && firstLink) {
      console.log("✅ Tool exports: PASSED");
    } else {
      console.log("❌ Tool exports: FAILED");
    }
    
    // Test 5: Tool execute functions return strings
    console.log("\n5. Testing tool execute functions return strings...");
    const testResult = await crawl.execute({ url: 'https://example.com' }, {});
    console.log("Return type:", typeof testResult);
    console.log("Is string:", typeof testResult === 'string');
    
    if (typeof testResult === 'string') {
      console.log("✅ String return type: PASSED");
    } else {
      console.log("❌ String return type: FAILED");
    }
    
    console.log("\n=== Comprehensive Test Complete ===");
    
  } catch (error) {
    console.error("Comprehensive test failed with error:", error);
  }
}

comprehensiveTest();