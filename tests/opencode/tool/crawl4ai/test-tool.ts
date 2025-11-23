import { crawlUrl } from "./opencode/tool/crawl4ai/index";

async function testCrawlUrl() {
  console.log("Testing crawlUrl function directly...");
  
  try {
    const result = await crawlUrl("https://example.com");
    console.log("crawlUrl result:", result.substring(0, 200) + "...");
    console.log("crawlUrl function works correctly!");
  } catch (error) {
    console.error("Error testing crawlUrl:", error);
  }
}

testCrawlUrl();
