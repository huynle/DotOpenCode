# Crawl4AI Tool

Advanced web crawling and content extraction tool powered by Crawl4AI, with support for authenticated sessions and GUI monitoring.

## Features

- **Web Crawling**: Extract content, links, and metadata from any web page
- **Chrome Profile Support**: Use your Chrome profile for authenticated sessions
- **GUI Monitoring**: Watch the crawling process in real-time
- **Verbose Logging**: Detailed progress tracking
- **Smart Search**: Automatically converts search queries to Google searches
- **Link Extraction**: Get first link or all links from pages

## Tools Available

### `crawl4ai_crawl`
Main web crawling tool with full feature support.

**Parameters:**
- `url` (required): URL to crawl
- `userDataDir` (optional): Path to Chrome user data directory for authentication
- `headless` (optional): Run in headless mode (default: true if no profile, false with profile)
- `verbose` (optional): Enable detailed logging (default: false)

**Example:**
```bash
# Basic crawl
opencode run "use crawl4ai to crawl https://example.com"

# With Chrome profile for authenticated pages
opencode run "use crawl4ai to crawl https://twitter.com with userDataDir=/Users/you/.chrome-profile"

# With GUI monitoring
opencode run "use crawl4ai to crawl https://example.com with headless=false"

# With verbose logging
opencode run "use crawl4ai to crawl https://example.com with verbose=true"
```

### `crawl4ai_firstLink`
Get the first link from a search query or web page.

**Parameters:**
- `query` (required): Search query or direct URL

**Example:**
```bash
opencode run "use crawl4ai to get the first link of 'funny dog'"
```

### `crawl4ai_analyzeWeb`
Analyze web page content and extract structured data.

**Parameters:**
- `url` (required): URL to analyze
- `userDataDir` (optional): Chrome profile path
- `headless` (optional): Headless mode toggle
- `verbose` (optional): Verbose logging

**Example:**
```bash
opencode run "use crawl4ai to analyze https://news.ycombinator.com"
```

## Chrome Profile Setup

To use authenticated sessions (for pages requiring login):

### Method 1: Create a Profile Directory

1. **Find your Playwright Chromium binary:**
```bash
python -m playwright install --dry-run
```

2. **Launch Chromium with a custom profile:**
```bash
# macOS
~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium \
    --user-data-dir=/Users/you/my-chrome-profile

# Linux
~/.cache/ms-playwright/chromium-*/chrome-linux/chrome \
    --user-data-dir=/home/you/my-chrome-profile

# Windows
"C:\Users\you\AppData\Local\ms-playwright\chromium-*\chrome-win\chrome.exe" ^
    --user-data-dir="C:\Users\you\my-chrome-profile"
```

3. **Log in to your accounts** in the opened browser

4. **Close the browser** to save the profile

5. **Use the profile path** in the tool:
```bash
opencode run "use crawl4ai to crawl https://twitter.com/home with userDataDir=/Users/you/my-chrome-profile"
```

### Method 2: Use Your Existing Chrome Profile

You can point to your existing Chrome profile directory:

**macOS:**
```
/Users/you/Library/Application Support/Google/Chrome/Default
```

**Linux:**
```
/home/you/.config/google-chrome/Default
```

**Windows:**
```
C:\Users\you\AppData\Local\Google\Chrome\User Data\Default
```

**⚠️ Warning:** Close Chrome before using its profile with the tool to avoid conflicts.

## GUI Monitoring

To watch the crawling process in real-time:

```bash
# Enable GUI mode
opencode run "use crawl4ai to crawl https://example.com with headless=false"

# Combine with verbose logging
opencode run "use crawl4ai to crawl https://example.com with headless=false and verbose=true"
```

This is useful for:
- Debugging crawling issues
- Watching authentication flows
- Monitoring dynamic content loading
- Understanding page interactions

## Advanced Usage

### Authenticated Crawling with GUI

```bash
opencode run "use crawl4ai to crawl https://linkedin.com/feed with userDataDir=/Users/you/.chrome-profile and headless=false and verbose=true"
```

This will:
1. Open a visible Chrome window
2. Load your saved authentication from the profile
3. Show detailed logging of the crawl process
4. Extract content from the authenticated page

### Debugging Failed Crawls

```bash
# Enable all debugging features
opencode run "use crawl4ai to crawl https://difficult-site.com with headless=false and verbose=true"
```

## Configuration

The tool connects to a local Crawl4AI server:
- **Default URL:** `http://localhost:11235`
- **Timeout:** 30 seconds
- **Viewport:** 1920x1080

### Starting the Crawl4AI Server

```bash
docker run -p 11235:11235 unclecode/crawl4ai:latest
```

## Return Format

All tools return JSON strings with the following structure:

```json
{
  "url": "https://example.com",
  "originalQuery": "example.com",
  "success": true,
  "title": "Example Domain",
  "description": "Example description",
  "content": "Markdown content...",
  "firstLink": "https://first-link.com",
  "totalLinks": 10,
  "links": ["link1", "link2", "..."]
}
```

## Error Handling

The tool handles various error scenarios:

- **CAPTCHA Detection**: Detects and reports when Google blocks automated searches
- **Server Offline**: Clear error message with instructions to start the server
- **Failed Crawls**: Returns detailed error information
- **Network Issues**: Timeout and connection error handling

## Best Practices

1. **Use Direct URLs**: Search queries may be blocked by CAPTCHA
2. **Profile Management**: Keep separate profiles for different use cases
3. **Headless for Production**: Use `headless=true` for automated workflows
4. **GUI for Debugging**: Use `headless=false` when troubleshooting
5. **Verbose Logging**: Enable when you need detailed progress information
6. **Close Chrome**: Always close Chrome before using its profile directory

## Troubleshooting

### "Server not running" error
Start the Crawl4AI server:
```bash
docker run -p 11235:11235 unclecode/crawl4ai:latest
```

### "Blocked by CAPTCHA" error
Use a direct URL instead of a search query, or use your Chrome profile with saved authentication.

### Profile conflicts
Make sure Chrome is closed before using its profile directory with the tool.

### Slow crawling
Enable verbose logging to see what's taking time:
```bash
opencode run "use crawl4ai to crawl https://slow-site.com with verbose=true"
```

## Documentation

For more information about Crawl4AI capabilities:
- [Crawl4AI Documentation](https://docs.crawl4ai.com/)
- [Identity-Based Crawling](https://docs.crawl4ai.com/advanced/identity-based-crawling/)
- [Browser Configuration](https://docs.crawl4ai.com/api/parameters/)

## Examples

### Example 1: Basic News Crawl
```bash
opencode run "use crawl4ai to crawl https://news.ycombinator.com"
```

### Example 2: Authenticated Twitter Crawl
```bash
opencode run "use crawl4ai to crawl https://twitter.com/home with userDataDir=/Users/you/.twitter-profile"
```

### Example 3: Debug a Complex Site
```bash
opencode run "use crawl4ai to crawl https://complex-spa.com with headless=false and verbose=true"
```

### Example 4: Extract First Link
```bash
opencode run "use crawl4ai to get the first link of 'best pizza near me'"
```

### Example 5: Analyze Page Content
```bash
opencode run "use crawl4ai to analyze https://blog.example.com/article with verbose=true"
```
