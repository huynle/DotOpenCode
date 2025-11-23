import { Crawl4AI } from "crawl4ai";

async function testDirectCrawl4AI() {
  console.log("Testing Crawl4AI directly without tool wrapper...");
  
  try {
    // Initialize the Crawl4AI client
    const client = new Crawl4AI({
      baseUrl: "http://localhost:11235",
      timeout: 30000,
      debug: false
    });
    
    // Test with a simple URL
    const results = await client.crawl({
      urls: ["https://example.com"],
      browser_config: {
        headless: true
      }
    });
    
    console.log("Direct Crawl4AI test successful!");
    console.log("Title:", results[0].metadata?.title);
    console.log("Success:", results[0].success);
  } catch (error) {
    console.error("Error in direct Crawl4AI test:", error.message);
  }
}

testDirectCrawl4AI();
