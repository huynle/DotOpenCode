import sys
import os
import json
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode

async def main():
    # Parse Arguments (JSON string for flexibility)
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No arguments provided"}))
        return

    try:
        args = json.loads(sys.argv[1])
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON arguments"}))
        return

    url = args.get("url")
    if not url:
        print(json.dumps({"error": "URL is required"}))
        return
        
    depth = args.get("depth", 0) # 0 = single page, 1+ = deep crawl
    auth_file = args.get("auth_file") # e.g., "linkedin_cookies.json"
    css_schema = args.get("schema") # Optional: JSON schema for structured data

    # 1. Setup Browser Configuration
    browser_conf = BrowserConfig(
        headless=True,
        verbose=False,
    )

    # 2. Setup Run Configuration
    run_conf_args = {
        "cache_mode": CacheMode.BYPASS,  # Always get fresh data
    }

    # 3. Handle Authentication (The "Spy" Mode)
    if auth_file:
        cookie_path = os.path.join(".opencode/auth", auth_file)
        if os.path.exists(cookie_path):
            with open(cookie_path, 'r') as f:
                cookies = json.load(f)
                # TODO: Implement cookie injection
                pass 
        else:
             print(json.dumps({"error": f"Auth file {auth_file} not found"}))
             return

    # 4. Handle Deep Crawling
    # Note: Deep crawling requires different approach in newer crawl4ai
    # For now, we'll focus on single page crawling
    if depth > 0:
        print(json.dumps({"warning": "Deep crawling not yet implemented in this version"}))

    # 5. Handle Structured Extraction
    # Note: Extraction strategy needs to be implemented differently
    if css_schema:
        print(json.dumps({"warning": "CSS schema extraction not yet implemented in this version"}))

    # Execute
    try:
        async with AsyncWebCrawler(config=browser_conf) as crawler:
            config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)
            result_container = await crawler.arun(url=url, crawler_config=config)
            
            # Get the first result from the container
            result = None
            for r in result_container:
                result = r
                break
                
            if result and result.success:
                # Return the markdown content
                output = result.markdown or result.html
                print(json.dumps({
                    "url": result.url,
                    "status_code": result.status_code,
                    "content": output[:50000] if output else ""  # Truncate massive results
                }))
            elif result:
                print(json.dumps({
                    "error": result.error_message or "Unknown error",
                    "url": url
                }))
            else:
                print(json.dumps({
                    "error": "No result returned from crawler",
                    "url": url
                }))
                
    except Exception as e:
        print(json.dumps({
            "error": f"Crawl failed: {str(e)}",
            "url": url
        }))

if __name__ == "__main__":
    asyncio.run(main())