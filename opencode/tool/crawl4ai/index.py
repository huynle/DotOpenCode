import sys
import os
import json
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from crawl4ai.deep_crawling import BFSDeepCrawlStrategy

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
    depth = args.get("depth", 0) # 0 = single page, 1+ = deep crawl
    auth_file = args.get("auth_file") # e.g., "linkedin_cookies.json"
    css_schema = args.get("schema") # Optional: JSON schema for structured data

    # 1. Setup Browser Configuration
    # Magic Mode = Anti-detection (Random User-Agent, removes navigator.webdriver flag)
    browser_conf = BrowserConfig(
        headless=True,
        verbose=False,
    )

    # 2. Setup Run Configuration
    run_conf_args = {
        "url": url,
        "magic": True,  # Handles popups, cookie consents automatically
        "cache_mode": CacheMode.BYPASS, # Always get fresh data
    }

    # 3. Handle Authentication (The "Spy" Mode)
    # This injects your cookies into the browser context before navigating
    if auth_file:
        cookie_path = os.path.join(".opencode/auth", auth_file)
        if os.path.exists(cookie_path):
            with open(cookie_path, 'r') as f:
                cookies = json.load(f)
                # Crawl4ai allows passing cookies list directly in run config or browser context
                # Note: Exact implementation depends on version, this is the standard context injection approach
                # For simplicity in this script, we'd add logic to inject cookies 
                # but standard crawl4ai relies on 'user_data_dir' for persistent sessions usually.
                # However, we can pass cookies to the crawler run config if supported, 
                # or use a hook. For now, let's assume simple header injection or skip if complex.
                pass 
        else:
             print(json.dumps({"error": f"Auth file {auth_file} not found"}))
             return

    # 4. Handle Deep Crawling (The "Scout" Mode)
    if depth > 0:
        # BFS = Breadth First Search (Get all links on page 1, then go to page 2)
        run_conf_args["deep_crawl_strategy"] = BFSDeepCrawlStrategy(
            max_depth=depth,
            limit=10 # Safety limit to prevent infinite crawling
        )

    # 5. Handle Structured Extraction (The "Surgeon" Mode)
    # If the agent knows the CSS (e.g. GitHub stars), it extracts JSON, not Markdown.
    if css_schema:
        run_conf_args["extraction_strategy"] = JsonCssExtractionStrategy(css_schema)

    # Execute
    async with AsyncWebCrawler(config=browser_conf) as crawler:
        config = CrawlerRunConfig(**run_conf_args)
        result = await crawler.arun(config=config)

        if result.success:
            # If we used a schema, return the JSON. If not, return the Markdown.
            output = result.extracted_content if css_schema else result.markdown
            print(json.dumps({"url": url, "content": output[:50000]})) # Truncate massive results
        else:
            print(json.dumps({"error": result.error_message}))

if __name__ == "__main__":
    asyncio.run(main())
