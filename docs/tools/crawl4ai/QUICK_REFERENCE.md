# Crawl4AI - Quick Reference

## Quick Start

### Basic Crawling
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run "Use crawl4ai to fetch https://example.com"
```

### Search Google
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run "Use crawl4ai to search google.com for 'funny dog' and return top 2 results"
```

## Common Commands

### Basic Crawling
```
Use crawl4ai to fetch https://example.com
```

### Search Results
```
Use crawl4ai to search google.com for 'funny dog' and return top 2 results
```

### Deep Crawling
```
Use crawl4ai_deepCrawlTool to crawl https://example.com with depth 2 and max 10 pages
```

### Content Analysis
```
Use crawl4ai_analyze to extract all links and images from https://example.com
```

### Download Files
```
Use crawl4ai_download to download all PDF files from https://example.com
```

## Parameter Reference

| Tool Variant | Parameter | Type | Required | Description |
|--------------|-----------|------|----------|-------------|
| crawl4ai, crawl4ai_crawl | url | string | Yes | URL to crawl and extract content from |
| crawl4ai_analyze | url | string | Yes | URL to analyze for structured content |
| crawl4ai_deepCrawlTool | url | string | Yes | URL to deep crawl |
| crawl4ai_deepCrawlTool | depth | number | No | Crawling depth (default: 2) |
| crawl4ai_deepCrawlTool | maxPages | number | No | Maximum pages to crawl (default: 10) |
| crawl4ai_download | url | string | Yes | URL to download files from |
| crawl4ai_download | fileType | string | No | File type to download (e.g., 'pdf', 'jpg') |

## Tool Variants

| Tool Name | Description | Use Case |
|-----------|-------------|----------|
| `crawl4ai` | Basic web crawling (default) | General web content extraction |
| `crawl4ai_crawl` | Same as default | Alternative name for basic crawling |
| `crawl4ai_deepCrawlTool` | Multi-page crawling with strategies | Crawling entire websites |
| `crawl4ai_download` | Download files from websites | File downloading |
| `crawl4ai_analyze` | Extract structured data and metadata | Content analysis |
| `crawl4ai_URLFilterManager` | URL filtering utilities | URL management |
| `crawl4ai_ContentScorer` | Content relevance scoring utilities | Content quality assessment |

## Error Codes

| Error | Meaning | Solution |
|-------|---------|----------|
| "connect ECONNREFUSED 127.0.0.1:11235" | Crawl4AI server not running | Start Crawl4AI server: `docker run -p 11235:11235 unclecode/crawl4ai:latest` |
| "Blocked by CAPTCHA" | Google detected unusual traffic | Use direct URLs instead of search queries |
| "Invalid value for url" | Malformed URL | Ensure URL starts with http:// or https:// |
| "No results returned from crawl" | Empty response | Check URL validity and website accessibility |

## Troubleshooting Checklist

### Tool Not Working
- [ ] Check if Crawl4AI server is running (`docker ps`)
- [ ] Verify tool file exists at `~/.config/opencode/tool/crawl4ai.ts`
- [ ] Restart OpenCode TUI
- [ ] Check agent permissions

### Connection Issues
- [ ] Start Crawl4AI server: `docker run -p 11235:11235 unclecode/crawl4ai:latest`
- [ ] Check if port 11235 is available
- [ ] Verify Docker is running
- [ ] Check firewall settings

### CAPTCHA Blocks
- [ ] Use direct URLs instead of search queries
- [ ] Try a different search engine
- [ ] Add delays between requests
- [ ] Use a proxy service

### Content Extraction Issues
- [ ] Check if website allows crawling in robots.txt
- [ ] Verify website structure hasn't changed
- [ ] Try different crawling parameters
- [ ] Check Crawl4AI server logs for details

## Example Prompts

### For General Web Crawling
- "Use crawl4ai to fetch the content of https://example.com"
- "Get me the main content from https://news.example.com/latest"
- "Extract the text from https://blog.example.com/post-123"

### For Search Results
- "Use crawl4ai to get the top 3 results from google.com for 'machine learning'"
- "Find the latest news about AI from google.com"
- "Search for 'best restaurants near me' and return the first 5 results"

### For Content Analysis
- "Use crawl4ai_analyze to extract all links from https://example.com"
- "Analyze https://shop.example.com and extract product information"
- "Get all images from https://gallery.example.com"

### For File Downloading
- "Use crawl4ai_download to download all PDF files from https://docs.example.com"
- "Download all images from https://photos.example.com"
- "Get all CSV files from https://data.example.com"

## Common Use Cases

1. **Web Research**: Extract content from multiple websites for research purposes
2. **Content Aggregation**: Collect articles, news, or blog posts from various sources
3. **Link Analysis**: Extract and analyze links from web pages
4. **SEO Analysis**: Analyze web page structure and metadata
5. **Data Extraction**: Extract structured data from websites
6. **File Downloading**: Download specific file types from websites
7. **Search Result Analysis**: Analyze search engine results for specific queries