import { Crawl4AI } from "crawl4ai";

async function testCrawl4AI() {
  try {
    console.log("Testing Crawl4AI client...");
    
    // Initialize the Crawl4AI client
    const client = new Crawl4AI({
      baseUrl: 'http://localhost:11235',
      timeout: 30000,
      debug: true
    });
    
    console.log("Client initialized");
    
    // Test with a simple URL
    const results = await client.crawl({
      urls: ["https://example.com"],
      browser_config: {
        headless: true
      }
    });
    
    console.log("Crawl results:", JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Error testing Crawl4AI:", error);
  }
}

testCrawl4AI();