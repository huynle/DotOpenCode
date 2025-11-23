import { Crawl4AI } from "crawl4ai";

async function run() {
  // Use the stars page which redirects to the user's star list if logged in
  // If not logged in, it redirects to login (and the crawl will likely capture the login page)
  const url = "https://github.com/stars";
  const userDataDir = "/Users/huy/Library/Application Support/Google/Chrome";
  
  console.log(`Crawling ${url}...`);
  console.log(`Using Chrome Profile at: ${userDataDir}`);

  // Initialize client
  const client = new Crawl4AI({
    baseUrl: 'http://localhost:11235',
    timeout: 60000, 
    debug: false
  });

  // Configure browser with user data dir
  const browserConfig = {
    headless: true, // Headless with profile might be tricky, but let's try true first. 
                    // Some profiles/extensions might interfere in headless.
    viewport: { width: 1920, height: 1080 },
    user_data_dir: userDataDir
  };

  try {
    const response = await client.crawl({
      urls: [url],
      browser_config: browserConfig,
      crawler_config: {
        cache_mode: 'bypass',
        word_count_threshold: 10
      }
    });

    if (response && response.length > 0) {
        const result = response[0];
        if (result.success) {
            console.log("--- CRAWL SUCCESS ---");
            console.log("URL:", result.url);
            console.log("Title:", result.metadata?.title);
            
            let md = "";
            if (result.markdown) {
                 md = typeof result.markdown === 'string' ? result.markdown : result.markdown.raw_markdown;
            }
            
            console.log("\n--- MARKDOWN START ---");
            console.log(md.substring(0, 2000)); // Print first 2000 chars
            console.log("--- MARKDOWN END ---");

            // Simple heuristic parsing for the latest starred repo
            // GitHub stars page usually lists repos like "owner / repo_name" as links
            // We can look for the first link that matches owner/repo pattern that isn't a nav link
        } else {
            console.log("--- CRAWL FAILED ---");
            console.error("Error:", result.error_message);
        }
    } else {
        console.log("--- NO RESPONSE ---");
    }

  } catch (error) {
    console.error("Execution Error:", error);
  }
}

run();
