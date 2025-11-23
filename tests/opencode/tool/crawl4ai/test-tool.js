import { crawlUrl } from './opencode/tool/crawl4ai/index.ts';

async function testTool() {
  try {
    console.log('Testing crawl4ai tool...');
    const result = await crawlUrl('funny dog');
    console.log('Result:', result);
    
    // Parse the result to get the first link
    const parsedResult = JSON.parse(result);
    console.log('First link:', parsedResult.firstLink);
  } catch (error) {
    console.error('Error:', error);
  }
}

testTool();
