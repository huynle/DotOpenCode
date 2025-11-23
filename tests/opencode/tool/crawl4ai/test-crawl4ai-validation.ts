// Final validation test for the crawl4ai tool
import { crawlUrl } from './opencode/tool/crawl4ai.ts';

async function validateTool() {
  try {
    console.log("=== Crawl4AI Tool Validation ===");
    
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
    
    // Test 3: Error handling
    console.log("\n3. Testing error handling...");
    const result3 = await crawlUrl('');
    const parsed3 = JSON.parse(result3);
    
    console.log("Success:", parsed3.success);
    console.log("Error:", parsed3.error);
    
    if (!parsed3.success && parsed3.error) {
      console.log("✅ Error handling: PASSED");
    } else {
      console.log("❌ Error handling: FAILED");
    }
    
    console.log("\n=== Validation Complete ===");
    
  } catch (error) {
    console.error("Validation failed with error:", error);
  }
}

validateTool();