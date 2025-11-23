# Quick Start: Universal Crawler (smart_crawl)

## Installation

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install
```

## Quick Test

### Test 1: Simple Page Crawl

```bash
# Test the Python script directly
python3 opencode/tool/smart_crawl.py '{"url": "https://example.com"}'
```

Expected output:
```json
{
  "success": true,
  "url": "https://example.com",
  "content": "# Example Domain\n\nThis domain is for use in...",
  "type": "markdown"
}
```

### Test 2: Using Chrome Profile (Authenticated Crawling)

```bash
# Use your Chrome profile to stay logged in
python3 opencode/tool/smart_crawl.py '{
  "url": "https://linkedin.com",
  "use_chrome": true,
  "chrome_profile": "Default",
  "headless": false
}'
```

**This is the recommended approach!** Your Chrome profile contains all your cookies, so you'll automatically be logged into sites.

### Test 3: Structured Data Extraction

```bash
# Extract GitHub repository info
python3 opencode/tool/smart_crawl.py '{
  "url": "https://github.com/microsoft/vscode",
  "css_schema": "{\"name\": \"h1 strong a\", \"stars\": \"#repo-stars-counter-star\"}"
}'
```

## Using with OpenCode Agent

### Simple Crawl
```
Agent: Use smart_crawl to fetch the content from https://example.com
```

### Authenticated Crawl (Recommended)
```
Agent: Use smart_crawl with use_chrome=true to access my LinkedIn profile at https://linkedin.com/in/myprofile
```

### Structured Extraction
```
Agent: Use smart_crawl to extract the repository name and star count from https://github.com/microsoft/vscode
```

## Chrome Profile Authentication (Recommended)

### Why Use Chrome Profile?

✅ **No cookie export needed** - Uses your existing Chrome cookies  
✅ **Always up-to-date** - Cookies refresh automatically  
✅ **More secure** - No cookie files to manage  
✅ **Easier** - Just set `use_chrome: true`  
✅ **Persistent sessions** - Stays logged in across crawls  

### How to Use Chrome Profile

```typescript
{
  url: "https://linkedin.com/in/profile",
  use_chrome: true,              // Enable Chrome profile
  chrome_profile: "Default",     // Which profile to use
  headless: false                // Set to false to see browser (optional)
}
```

### Finding Your Chrome Profile Name

**macOS:**
```bash
ls ~/Library/Application\ Support/Google/Chrome/
# Output: Default, Profile 1, Profile 2, etc.
```

**Windows:**
```powershell
dir %LOCALAPPDATA%\Google\Chrome\User Data\
# Output: Default, Profile 1, Profile 2, etc.
```

**Linux:**
```bash
ls ~/.config/google-chrome/
# Output: Default, Profile 1, Profile 2, etc.
```

### Chrome Profile Locations

| OS | Chrome Profile Path |
|----|---------------------|
| macOS | `~/Library/Application Support/Google/Chrome/` |
| Windows | `%LOCALAPPDATA%\Google\Chrome\User Data\` |
| Linux | `~/.config/google-chrome/` |

## Common Use Cases

### 1. Authenticated Social Media Scraping

```typescript
{
  url: "https://linkedin.com/in/someprofile",
  use_chrome: true,
  chrome_profile: "Default",
  css_schema: JSON.stringify({
    name: "h1.text-heading-xlarge",
    headline: "div.text-body-medium"
  })
}
```

### 2. Research & Content Extraction

```typescript
{
  url: "https://blog.example.com/latest-post",
  depth: 0  // Single page
}
```

### 3. Competitive Analysis

```typescript
{
  url: "https://competitor.com/pricing",
  css_schema: JSON.stringify({
    plans: "div.pricing-card h3",
    prices: "span.price"
  })
}
```

### 4. Documentation Crawling

```typescript
{
  url: "https://docs.example.com",
  depth: 2  // Crawl multiple levels
}
```

## Parameters Reference

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `url` | string | ✅ Yes | - | Target URL to crawl |
| `use_chrome` | boolean | No | `false` | Use Chrome profile for auth |
| `chrome_profile` | string | No | `"Default"` | Chrome profile name |
| `headless` | boolean | No | `true` | Run browser invisibly |
| `depth` | number | No | `0` | Crawl depth (0=single page) |
| `css_schema` | string | No | - | JSON schema for extraction |

## Output Format

### Markdown Mode (default)

```json
{
  "success": true,
  "url": "https://example.com",
  "content": "# Page Title\n\nPage content...",
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
    "stars": "1234"
  },
  "type": "structured"
}
```

## Troubleshooting

### Issue: "Chrome profile not found"

**Solution:**
```bash
# Find your Chrome profiles
# macOS:
ls ~/Library/Application\ Support/Google/Chrome/

# Use the exact name (e.g., "Default", "Profile 1")
{
  "url": "https://example.com",
  "use_chrome": true,
  "chrome_profile": "Default"
}
```

### Issue: "crawl4ai not installed"

**Solution:**
```bash
pip install crawl4ai playwright
playwright install
```

### Issue: Not logged in when using Chrome profile

**Solution:**
1. Make sure you're logged into the site in Chrome
2. Use the correct profile name (check Chrome → Settings → People)
3. Try with `headless: false` to see what's happening
4. Close Chrome before running (Chrome locks the profile)

### Issue: Browser doesn't close

**Solution:**
- The script should auto-close the browser
- If stuck, manually close or use `headless: true`

## Best Practices

1. **Use Chrome Profile for Auth** - Much easier than cookie files
2. **Close Chrome First** - Chrome locks profiles when running
3. **Test with headless: false** - See what's happening during development
4. **Use CSS Schemas** - Extract only what you need
5. **Start Simple** - Test single page before deep crawling
6. **Respect Rate Limits** - Don't crawl too aggressively

## Examples in Practice

### Example 1: LinkedIn Profile Analysis

```typescript
// Make sure you're logged into LinkedIn in Chrome first
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

### Example 2: GitHub Repository Research

```typescript
{
  url: "https://github.com/microsoft/vscode",
  css_schema: JSON.stringify({
    name: "h1 strong a",
    stars: "#repo-stars-counter-star",
    description: "p.f4"
  })
}
```

### Example 3: Documentation Deep Crawl

```typescript
{
  url: "https://docs.example.com",
  depth: 2,
  use_chrome: true  // In case docs require login
}
```

## Security Notes

- ✅ Chrome profile is more secure than cookie files
- ✅ No cookie files to accidentally commit to git
- ✅ Cookies stay in Chrome's secure storage
- ⚠️ Close Chrome before running to avoid profile lock
- ⚠️ Use `headless: true` in production

## Next Steps

1. Install dependencies: `pip install -r requirements.txt && playwright install`
2. Test with your Chrome profile: Set `use_chrome: true`
3. Find sites you're logged into and try crawling them
4. Experiment with CSS schemas for structured data

## File Structure

```
opencode/
├── tool/
│   ├── crawl.ts              # TypeScript tool definition
│   ├── smart_crawl.py        # Python crawler (Chrome profile support)
│   ├── index.ts              # Exports smart_crawl tool
│   └── SMART_CRAWL_README.md # Full documentation
requirements.txt              # Python dependencies
```

The tool is ready to use with Chrome profile support! 🎉
