import { Crawl4AI } from "crawl4ai";

// Simple web crawling function that matches our tool implementation
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

    console.log(`Crawling URL: ${finalUrl}`);

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

    console.log(`Crawl response:`, JSON.stringify(response, null, 2));

    // Check if response has results
    if (!response || !response.results || response.results.length === 0) {
      return JSON.stringify({
        url: finalUrl,
        originalQuery: url,
        success: false,
        error: 'No results returned from crawl'
      }, null, 2)
    }

    const result = response.results[0] // API returns results array
    
    if (!result.success) {
      return JSON.stringify({
        url: finalUrl,
        originalQuery: url,
        success: false,
        error: result.error_message || 'Crawl failed'
      }, null, 2)
    }

    // Extract links from the result (links is an object with internal/external properties)
    let allLinks: string[] = [];
    if (result.links) {
      const internalLinks = result.links.internal?.map((link: any) => link.href) || [];
      const externalLinks = result.links.external?.map((link: any) => link.href) || [];
      allLinks = [...internalLinks, ...externalLinks];
    }
    
    const firstLink = allLinks.length > 0 ? allLinks[0] : "No links found"

    // Extract content - try different markdown fields
    let content = "";
    if (result.markdown && typeof result.markdown === 'object' && result.markdown !== null) {
      // If markdown is an object, try to get the raw_markdown field
      const markdownObj = result.markdown as { raw_markdown?: string };
      content = markdownObj.raw_markdown?.substring(0, 1000) + (markdownObj.raw_markdown?.length > 1000 ? "..." : "") || "";
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

async function testTool() {
  try {
    console.log('Testing crawl4ai tool with "funny dog" query...');
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