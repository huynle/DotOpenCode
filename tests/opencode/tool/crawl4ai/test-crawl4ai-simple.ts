// Simple test to verify the crawl4ai tool works
import { Crawl4AI } from "crawl4ai";

async function testCrawl4AI() {
  try {
    console.log("Testing Crawl4AI with a direct URL...");
    
    // Initialize the Crawl4AI client
    const client = new Crawl4AI({
      baseUrl: 'http://localhost:11235',
      timeout: 30000,
      debug: true
    });
    
    // Test with a simple URL
    const results = await client.crawl({
      urls: ["https://example.com"],
      browser_config: {
        headless: true
      }
    });
    
    console.log("Crawl successful!");
    console.log("Title:", results[0].metadata?.title);
    
    // Extract links
    let allLinks: string[] = [];
    if (results[0].links) {
      const internalLinks = results[0].links.internal?.map((link: any) => link.href) || [];
      const externalLinks = results[0].links.external?.map((link: any) => link.href) || [];
      allLinks = [...internalLinks, ...externalLinks];
    }
    
    console.log("First link:", allLinks.length > 0 ? allLinks[0] : "No links found");
    console.log("Total links:", allLinks.length);
  } catch (error) {
    console.error("Error testing Crawl4AI:", error);
  }
}

testCrawl4AI();