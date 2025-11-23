// Test the crawl4ai tool directly
import { crawlUrl } from './opencode/tool/crawl4ai.ts';

async function testTool() {
  try {
    console.log('Testing crawl4ai tool with a direct URL...');
    const result = await crawlUrl('https://example.com');
    console.log('Result:', result);
    
    // Parse the result to get the first link
    const parsedResult = JSON.parse(result);
    console.log('First link:', parsedResult.firstLink);
  } catch (error) {
    console.error('Error:', error);
  }
}

testTool();