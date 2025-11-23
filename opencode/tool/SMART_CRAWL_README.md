# Universal Crawler Tool (smart_crawl)

A robust web crawling tool for OpenCode.ai agents using the `crawl4ai` Python library.

## Features

1. **Simple Page Reads** - Extract content from single web pages as Markdown
2. **Deep Crawling** - Follow links and crawl multiple pages (BFS strategy)
3. **Structured Data Extraction** - Use CSS selectors to extract specific data as JSON
4. **Chrome Profile Authentication** - Use your Chrome profile to stay logged in automatically (recommended!)
5. **Bot Detection Bypass** - Magic mode handles anti-bot protection automatically

## Installation

### 1. Install Python Dependencies

```bash
pip install crawl4ai playwright
playwright install
```

Or use the provided `requirements.txt`:

```bash
pip install -r requirements.txt
playwright install
```

### 2. Verify Installation

The tool is automatically available to OpenCode agents once the dependencies are installed.

## Usage

### Basic Page Crawl (Markdown)

```typescript
// Simple page read - returns markdown content
{
  url: "https://example.com"
}
```

### Deep Crawl (Follow Links)

```typescript
// Crawl with depth 1 (follow links on the page)
{
  url: "https://example.com",
  depth: 1
}
```

### Structured Data Extraction

```typescript
// Extract specific data using CSS selectors
{
  url: "https://github.com/user/repo",
  css_schema: JSON.stringify({
    name: "h1.repo-title",
    stars: "span.star-count",
    description: "p.repo-description"
  })
}
```

### Authenticated Crawling (Chrome Profile - Recommended!)

```typescript
// Use your Chrome profile - stays logged in automatically!
{
  url: "https://linkedin.com/in/profile",
  use_chrome: true,
  chrome_profile: "Default"
}
```

**Why Chrome Profile?**
- ✅ No cookie export needed
- ✅ Always up-to-date
- ✅ More secure
- ✅ Easier to use

## Chrome Profile Setup (Recommended)

### Why Use Chrome Profile Instead of Cookie Files?

| Chrome Profile | Cookie Files |
|----------------|--------------|
| ✅ No export needed | ❌ Manual export required |
| ✅ Auto-updates | ❌ Cookies expire |
| ✅ More secure | ⚠️ Files can leak |
| ✅ One-time setup | ❌ Re-export often |
| ✅ All sites at once | ❌ One site at a time |

### How to Use Chrome Profile

1. **Find your Chrome profile name:**

   **macOS:**
   ```bash
   ls ~/Library/Application\ Support/Google/Chrome/
   # Output: Default, Profile 1, Profile 2, etc.
   ```

   **Windows:**
   ```powershell
   dir %LOCALAPPDATA%\Google\Chrome\User Data\
   ```

   **Linux:**
   ```bash
   ls ~/.config/google-chrome/
   ```

2. **Use in tool call:**

   ```typescript
   {
     url: "https://linkedin.com/in/profile",
     use_chrome: true,
     chrome_profile: "Default"  // or "Profile 1", etc.
   }
   ```

3. **Important:** Close Chrome before running the crawler (Chrome locks the profile)

### Chrome Profile Locations

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Google/Chrome/` |
| Windows | `%LOCALAPPDATA%\Google\Chrome\User Data\` |
| Linux | `~/.config/google-chrome/` |

## Advanced Examples

### Example 1: Scrape GitHub Repository Info

```typescript
{
  url: "https://github.com/microsoft/vscode",
  css_schema: JSON.stringify({
    repository_name: "h1 strong a",
    stars: "#repo-stars-counter-star",
    forks: "#repo-network-counter",
    description: "p.f4"
  })
}
```

### Example 2: Deep Crawl Documentation Site

```typescript
{
  url: "https://docs.example.com",
  depth: 2  // Crawl main page + linked pages + their links
}
```

### Example 3: Authenticated LinkedIn Profile Scrape (Chrome Profile)

```typescript
{
  url: "https://www.linkedin.com/in/someprofile",
  use_chrome: true,
  chrome_profile: "Default",
  css_schema: JSON.stringify({
    name: "h1.text-heading-xlarge",
    headline: "div.text-body-medium",
    location: "span.text-body-small"
  })
}
```

**Note:** Make sure you're logged into LinkedIn in your Chrome browser first!

## Output Format

### Markdown Mode (default)

```json
{
  "success": true,
  "url": "https://example.com",
  "content": "# Page Title\n\nPage content in markdown...",
  "type": "markdown"
}
```

### Structured Mode (with css_schema)

```json
{
  "success": true,
  "url": "https://example.com",
  "content": {
    "name": "Repository Name",
    "stars": "1234",
    "description": "A great project"
  },
  "type": "structured"
}
```

### Error Response

```json
{
  "error": "Crawl failed",
  "message": "Connection timeout",
  "url": "https://example.com"
}
```

## Technical Details

### Architecture

- **TypeScript Tool** (`opencode/tool/crawl.ts`) - OpenCode tool definition
- **Python Script** (`opencode/tool/smart_crawl.py`) - Core crawling logic
- **crawl4ai Library** - Advanced web crawling with anti-bot detection

### Key Features

- **Magic Mode** - Bypasses bot detection automatically
- **BFS Deep Crawl** - Breadth-first search for multi-page crawling
- **CSS Extraction** - Clean JSON output using CSS selectors
- **Cookie Support** - Session-based authentication
- **Result Truncation** - Prevents overwhelming output (50KB limit)

### File Locations

- Tool definition: `opencode/tool/crawl.ts`
- Python script: `opencode/tool/smart_crawl.py`
- Cookie storage: `opencode/auth/` or `~/.config/opencode/auth/`
- Dependencies: `requirements.txt`

## Troubleshooting

### "crawl4ai not installed" Error

```bash
pip install crawl4ai playwright
playwright install
```

### "Authentication failed" Error

- Verify cookie file exists in `opencode/auth/`
- Check cookie format (must be JSON array)
- Ensure cookies are not expired
- Try re-exporting cookies from browser

### "Crawl failed" Error

- Check URL is accessible
- Verify internet connection
- Try reducing depth parameter
- Check if site blocks automated access

### Empty or Truncated Results

- Results are limited to 50KB to prevent overwhelming output
- Use CSS schema to extract only needed data
- Reduce crawl depth if getting too much content

## Best Practices

1. **Start Simple** - Test with single page before deep crawling
2. **Use CSS Schemas** - Extract only what you need for cleaner output
3. **Respect Robots.txt** - Be mindful of site crawling policies
4. **Rate Limiting** - Don't crawl too aggressively
5. **Cookie Security** - Keep auth files private and secure
6. **Test Selectors** - Verify CSS selectors in browser DevTools first

## Examples in Practice

### Research Assistant Use Case

```typescript
// Agent prompt: "Research the latest features of Next.js"
{
  url: "https://nextjs.org/blog",
  depth: 1,
  css_schema: JSON.stringify({
    title: "h1",
    date: "time",
    content: "article"
  })
}
```

### Competitive Analysis Use Case

```typescript
// Agent prompt: "Analyze competitor's product features"
{
  url: "https://competitor.com/features",
  css_schema: JSON.stringify({
    features: "div.feature-card h3",
    pricing: "span.price",
    description: "p.feature-desc"
  })
}
```

### Content Monitoring Use Case

```typescript
// Agent prompt: "Monitor changes to documentation"
{
  url: "https://docs.example.com/api",
  depth: 0  // Single page only
}
```

## Security Considerations

- **Cookie Storage** - Store cookies securely, never commit to git
- **Private Data** - Be careful with authenticated crawling
- **Rate Limiting** - Respect server resources
- **Legal Compliance** - Follow site terms of service
- **Data Privacy** - Handle scraped data responsibly

## Contributing

To improve this tool:

1. Update Python script: `opencode/tool/smart_crawl.py`
2. Update TypeScript definition: `opencode/tool/crawl.ts`
3. Test thoroughly with various websites
4. Update this documentation

## License

Part of the OpenCode.ai project.
