# Crawl4AI

A powerful web crawling and content extraction tool for OpenCode that leverages the Crawl4AI library to fetch, analyze, and extract structured data from web pages.

**Note:** This tool has been rebuilt to follow the correct OpenCode pattern. The tool file is now located at `opencode/tool/crawl4ai.ts` rather than in a subdirectory.

## Features

- Web page crawling and content extraction
- Search result fetching from Google
- Link extraction and analysis
- Content analysis with metadata extraction
- File downloading from websites
- Deep crawling with multiple strategies (BFS, DFS, BestFirst)
- Structured data extraction from web pages

## Installation

### Prerequisites
- Crawl4AI server running on localhost:11235
- Node.js and Bun package manager
- crawl4ai npm package

### Setup
```bash
# Install dependencies
cd ~/.config/opencode
bun add crawl4ai

# Start Crawl4AI server
docker run -p 11235:11235 unclecode/crawl4ai:latest
```

### File Location
The tool file should be located at:
```
~/.config/opencode/tool/crawl4ai.ts
```

For this project, the file is located at:
```
/Users/huy/projects/DotOpenCode/crawl4ai/opencode/tool/crawl4ai.ts
```

## Usage

### Basic Usage
```
Use crawl4ai to fetch https://example.com
```

**Example:**
```
Use crawl4ai to fetch https://example.com
```

**Output:**
```json
{
  "url": "https://example.com",
  "originalQuery": "https://example.com",
  "success": true,
  "title": "Example Domain",
  "description": "This domain is for use in illustrative examples in documents.",
  "content": "# Example Domain\n\nThis domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.\n\n[More information...](https://www.iana.org/domains/example)",
  "firstLink": "https://iana.org/domains/example",
  "totalLinks": 1,
  "links": [
    "https://iana.org/domains/example"
  ]
}
```

### Advanced Usage

#### Search Google for Results
```
Use crawl4ai to search google.com for 'funny dog' and return top 2 results
```

**Example:**
```
Use crawl4ai to get the top 2 results from google.com for 'funny dog'
```

#### With Parameters
```
Use crawl4ai_crawl with url=https://example.com to fetch content
```

#### Multiple Variants
```
Use crawl4ai_analyze to extract structured data from https://example.com
```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| url | string | Yes | - | URL to crawl and extract content from |
| query | string | Yes (for firstLink) | - | Search query to find links for |

## Tool Variants

### crawl4ai
Main tool for web crawling and content extraction (default export)

### crawl4ai_crawl
Specialized tool for web crawling with detailed configuration

### crawl4ai_analyze
Specialized tool for content analysis and structured data extraction

### crawl4ai_deepCrawlTool
Specialized tool for deep crawling with multiple strategies (BFS, DFS, BestFirst)

### crawl4ai_download
Specialized tool for downloading files from websites

### crawl4ai_URLFilterManager
Utility tool for URL filtering

### crawl4ai_ContentScorer
Utility tool for content relevance scoring

## Error Handling

### Common Errors

**Error: Service not running**
```
Error: connect ECONNREFUSED 127.0.0.1:11235
```
**Solution:** Start the Crawl4AI server with: `docker run -p 11235:11235 unclecode/crawl4ai:latest`

**Error: Blocked by CAPTCHA**
```
Error: Blocked by CAPTCHA - Google detected unusual traffic
```
**Solution:** Use direct URLs instead of search queries, or use a different search engine

**Error: Invalid parameter**
```
Error: Invalid value for url
```
**Solution:** Check that the URL is properly formatted with http:// or https://

## Known Limitations

- Requires Crawl4AI server to be running locally
- May be blocked by CAPTCHA when searching Google
- Limited to websites that allow crawling per their robots.txt
- Content extraction quality depends on website structure

## Troubleshooting

### Tool not found
**Symptoms:** "unavailable tool" error
**Causes:**
- File not in correct location
- OpenCode not restarted
- Agent doesn't have permission

**Solutions:**
1. Check file location: `ls ~/.config/opencode/tool/crawl4ai.ts` (or the correct path for your installation)
2. Restart OpenCode TUI
3. Verify agent configuration

### Return type errors
**Symptoms:** "expected string, received object" error
**Cause:** Tool implementation issue
**Solution:** Report to tool maintainer

### Crawl4AI server issues
**Symptoms:** Connection refused errors
**Causes:**
- Crawl4AI server not running
- Wrong port configuration
- Docker not installed or running

**Solutions:**
1. Start Crawl4AI server: `docker run -p 11235:11235 unclecode/crawl4ai:latest`
2. Check if Docker is running
3. Verify port 11235 is available

## Integration with Agents

### Configuration
```yaml
tools:
  crawl4ai: true
  crawl4ai_crawl: true
  crawl4ai_analyze: true
  crawl4ai_deepCrawlTool: true
  crawl4ai_download: true
```

### Permissions
```yaml
permission:
  crawl4ai*: allow
```

### Example Usage
```
# In agent conversation
"Use crawl4ai to fetch https://example.com"
"Use crawl4ai to search google.com for 'funny dog' and return top 2 results"
"Use crawl4ai_analyze to extract all links and images from https://example.com"
```

## Validation Status

✅ **Validated:** Sat Nov 22 2025
✅ **Static Analysis:** Passed
✅ **CLI Testing:** Passed
✅ **Production Ready:** Yes

See [VALIDATION_REPORT.md](./VALIDATION_REPORT.md) for details.

## Examples

### Example 1: Basic Web Crawling
**Scenario:** Extract content from a web page

**Command:**
```
Use crawl4ai to fetch https://example.com
```

**Result:**
```json
{
  "url": "https://example.com",
  "originalQuery": "https://example.com",
  "success": true,
  "title": "Example Domain",
  "description": "This domain is for use in illustrative examples in documents.",
  "content": "# Example Domain\n\nThis domain is for use in illustrative examples in documents...",
  "firstLink": "https://iana.org/domains/example",
  "totalLinks": 1,
  "links": [
    "https://iana.org/domains/example"
  ]
}
```

### Example 2: Google Search Results
**Scenario:** Get search results from Google

**Command:**
```
Use crawl4ai to get the top 2 results from google.com for 'funny dog'
```

**Result:**
```json
{
  "url": "https://www.google.com/search?q=funny%20dog",
  "originalQuery": "funny dog",
  "success": true,
  "title": "funny dog - Google Search",
  "content": "Search results for funny dog...",
  "firstLink": "https://example.com/funny-dog-video",
  "totalLinks": 20,
  "links": [
    "https://example.com/funny-dog-video",
    "https://example.com/funny-dog-pictures"
  ]
}
```

## Contributing

To report issues or suggest improvements:
1. Check existing issues
2. Provide reproduction steps
3. Include validation report

## License

MIT License

## Changelog

### Version 1.0.0 (Sat Nov 22 2025)
- Initial release
- Features: Web crawling, content extraction, link analysis, search result fetching