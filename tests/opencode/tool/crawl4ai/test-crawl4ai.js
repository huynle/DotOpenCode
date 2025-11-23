import Crawl4AI from 'crawl4ai';

async function testCrawl() {
  try {
    const client = new Crawl4AI({
      baseUrl: 'http://localhost:11235',
      timeout: 30000,
      debug: false
    });
    
    console.log('Client created, starting crawl...');
    
    const results = await client.crawl({
      urls: ['https://example.com'],
      browser_config: {
        headless: true,
        viewport: { width: 1920, height: 1080 }
      },
      crawler_config: {
        cache_mode: 'bypass',
        word_count_threshold: 10
      }
    });
    
    console.log('Crawl results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCrawl();
