import { Crawl4AI } from "crawl4ai";

async function testErrorHandling() {
  try {
    console.log("Testing Crawl4AI with an invalid URL...");
    
    // Initialize the Crawl4AI client
    const client = new Crawl4AI({
      baseUrl: "http://localhost:11235",
      timeout: 30000,
      debug: true
    });
    
    // Test with an invalid URL
    const results = await client.crawl({
      urls: ["https://this-is-an-invalid-url-that-does-not-exist.com"],
      browser_config: {
        headless: true
      }
    });
    
    console.log("Results:", JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testErrorHandling();
