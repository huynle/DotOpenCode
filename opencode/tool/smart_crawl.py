#!/usr/bin/env python3
"""
Universal Crawler Tool for OpenCode.ai
Uses crawl4ai library for advanced web crawling capabilities.
"""

import sys
import json
import asyncio
import os
from pathlib import Path
from typing import Optional, Dict, Any, List

try:
    from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
    from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
    from crawl4ai.deep_crawling import BFSDeepCrawlStrategy
except ImportError as e:
    print(json.dumps({
        "error": "crawl4ai not installed",
        "message": "Please install: pip install crawl4ai playwright && playwright install"
    }))
    sys.exit(1)


def get_chrome_profile_path(profile_name: Optional[str] = None) -> Optional[str]:
    """
    Get Chrome user data directory path.
    
    Args:
        profile_name: Optional profile name (e.g., "Default", "Profile 1")
                     If None, uses the default Chrome profile
    
    Returns:
        Path to Chrome user data directory or None if not found
    """
    import platform
    
    system = platform.system()
    
    # Base Chrome user data directories by OS
    if system == "Darwin":  # macOS
        base_path = Path.home() / "Library" / "Application Support" / "Google" / "Chrome"
    elif system == "Windows":
        base_path = Path(os.getenv("LOCALAPPDATA", "")) / "Google" / "Chrome" / "User Data"
    elif system == "Linux":
        base_path = Path.home() / ".config" / "google-chrome"
    else:
        return None
    
    if not base_path.exists():
        return None
    
    # If specific profile requested, append it
    if profile_name:
        profile_path = base_path / profile_name
        if profile_path.exists():
            return str(base_path)  # Return base path, profile specified separately
    
    # Return base path if it exists
    return str(base_path) if base_path.exists() else None


async def crawl(config: Dict[str, Any]) -> Dict[str, Any]:
    """
    Execute the crawl operation.
    
    Args:
        config: Dictionary containing:
            - url (str): Target URL
            - depth (int, optional): Crawl depth for BFS strategy
            - chrome_profile (str, optional): Chrome profile name (e.g., "Default", "Profile 1")
            - use_chrome (bool, optional): Use Chrome profile for authentication
            - css_schema (str, optional): CSS extraction schema (JSON string)
    
    Returns:
        Dictionary with crawl results or error information
    """
    url = config.get("url")
    if not url:
        return {"error": "URL is required"}
    
    depth = config.get("depth", 0)
    chrome_profile = config.get("chrome_profile", "Default")
    use_chrome = config.get("use_chrome", False)
    css_schema = config.get("css_schema")
    
    # Configure browser
    browser_config_params = {
        "headless": config.get("headless", True),
        "verbose": False,
    }
    
    # Use Chrome profile for authentication if requested
    if use_chrome:
        user_data_dir = get_chrome_profile_path(chrome_profile)
        if user_data_dir:
            browser_config_params["user_data_dir"] = user_data_dir
            # Specify which profile to use within the user data directory
            if chrome_profile:
                browser_config_params["chrome_channel"] = chrome_profile
        else:
            return {
                "error": "Chrome profile not found",
                "message": f"Could not locate Chrome profile: {chrome_profile}"
            }
    
    browser_config = BrowserConfig(**browser_config_params)
    
    # Configure crawler run
    run_config_params = {
        "url": url,
        "cache_mode": CacheMode.BYPASS,
        "magic": True,  # Enable bot detection bypass
    }
    
    # Add extraction strategy if CSS schema provided
    if css_schema:
        try:
            # Parse schema if it's a string
            schema = json.loads(css_schema) if isinstance(css_schema, str) else css_schema
            extraction_strategy = JsonCssExtractionStrategy(schema)
            run_config_params["extraction_strategy"] = extraction_strategy
        except Exception as e:
            return {
                "error": "Invalid CSS schema",
                "message": str(e)
            }
    
    # Add deep crawl strategy if depth > 0
    if depth > 0:
        try:
            deep_crawl_strategy = BFSDeepCrawlStrategy(
                max_depth=depth
            )
            run_config_params["deep_crawl_strategy"] = deep_crawl_strategy
        except Exception as e:
            return {
                "error": "Failed to configure deep crawl",
                "message": str(e)
            }
    
    # Execute crawl
    try:
        async with AsyncWebCrawler(config=browser_config) as crawler:
            run_config = CrawlerRunConfig(**run_config_params)
            result = await crawler.arun(url=url, config=run_config)
            
            # Handle result (type checker may show warnings but this is correct usage)
            success = getattr(result, 'success', False)
            
            if success:
                # Return extracted content if CSS schema was used, otherwise markdown
                extracted = getattr(result, 'extracted_content', None)
                markdown = getattr(result, 'markdown', '')
                
                if css_schema and extracted:
                    output = extracted
                else:
                    output = markdown
                
                # Truncate massive results to prevent overwhelming output
                if isinstance(output, str) and len(output) > 50000:
                    output = output[:50000] + "\n\n[... truncated ...]"
                
                return {
                    "success": True,
                    "url": url,
                    "content": output,
                    "type": "structured" if css_schema else "markdown"
                }
            else:
                error_msg = getattr(result, 'error_message', 'Unknown error')
                return {
                    "error": "Crawl failed",
                    "message": error_msg,
                    "url": url
                }
                
    except Exception as e:
        return {
            "error": "Crawl exception",
            "message": str(e),
            "url": url
        }


async def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "Missing arguments",
            "usage": "smart_crawl.py '<json_config>'"
        }))
        sys.exit(1)
    
    try:
        config = json.loads(sys.argv[1])
    except json.JSONDecodeError as e:
        print(json.dumps({
            "error": "Invalid JSON",
            "message": str(e)
        }))
        sys.exit(1)
    
    result = await crawl(config)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
