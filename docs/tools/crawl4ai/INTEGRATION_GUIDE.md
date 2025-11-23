# Crawl4AI - Integration Guide

## Overview

This guide explains how to integrate the Crawl4AI tool with OpenCode agents for web crawling, content extraction, and data analysis tasks.

## Agent Configuration

### Basic Configuration
To enable the Crawl4AI tool for your agent, add it to your agent configuration:

```yaml
tools:
  crawl4ai: true
```

### Advanced Configuration
For full access to all Crawl4AI variants:

```yaml
tools:
  crawl4ai: true
  crawl4ai_crawl: true
  crawl4ai_analyze: true
  crawl4ai_deepCrawlTool: true
  crawl4ai_download: true
  crawl4ai_URLFilterManager: true
  crawl4ai_ContentScorer: true
```

## Permissions

### Basic Permissions
```yaml
permission:
  crawl4ai: allow
```

### Wildcard Permissions
For access to all Crawl4AI variants:
```yaml
permission:
  crawl4ai*: allow
```

## Usage Patterns

### 1. Basic Web Crawling
Agents can use the basic crawl4ai tool to fetch content from web pages:

```
"Use crawl4ai to fetch https://example.com"
```

### 2. Search Result Retrieval
Agents can search Google and retrieve results:

```
"Use crawl4ai to search google.com for 'latest AI news' and return top 5 results"
```

### 3. Content Analysis
Agents can analyze web page content and extract structured data:

```
"Use crawl4ai_analyze to extract all links and images from https://example.com"
```

### 4. Deep Crawling
Agents can perform deep crawling of websites:

```
"Use crawl4ai_deepCrawlTool to crawl https://example.com with depth 3 and max 20 pages"
```

### 5. File Downloading
Agents can download specific file types from websites:

```
"Use crawl4ai_download to download all PDF files from https://docs.example.com"
```

## Example Prompts

### Research Assistant
```
"I need to research the latest developments in quantum computing. Please use crawl4ai to search google.com for 'quantum computing 2025' and return the top 3 results with summaries."
```

### Content Aggregator
```
"Use crawl4ai to fetch content from https://tech.example.com/latest and extract the main article text."
```

### Link Collector
```
"Analyze https://news.example.com and use crawl4ai_analyze to extract all external links."
```

### Data Extractor
```
"Use crawl4ai_analyze to extract structured data from https://shop.example.com/products and return product information."
```

## Best Practices

### 1. Error Handling
Always handle potential errors gracefully:

```
"Try to use crawl4ai to fetch https://example.com. If it fails, let me know what went wrong."
```

### 2. Specific Instructions
Be specific about what you want to extract:

```
"Use crawl4ai to fetch https://example.com and extract only the main content, excluding navigation and footer."
```

### 3. Rate Limiting
When performing multiple crawls, add delays:

```
"Use crawl4ai to fetch https://example.com, then wait 2 seconds before fetching https://example2.com."
```

### 4. Content Validation
Validate the content you receive:

```
"Use crawl4ai to fetch https://example.com and confirm that the content contains information about AI."
```

## Advanced Integration

### Combining with Other Tools
Crawl4AI can be combined with other tools for more complex workflows:

```
"Use crawl4ai to fetch https://example.com, then use the analyze tool to summarize the content, and finally use the gemini tool to generate a response based on the summary."
```

### Conditional Logic
Use conditional logic based on crawl results:

```
"Use crawl4ai to check if https://status.example.com shows any issues. If there are issues, list them. If not, confirm the service is running normally."
```

### Iterative Processing
Process multiple URLs iteratively:

```
"I have a list of URLs: [url1, url2, url3]. Use crawl4ai to fetch each one and provide a summary for each."
```

## Troubleshooting Integration Issues

### Tool Not Found
If the agent reports that the tool is unavailable:
1. Verify the tool is enabled in the agent configuration
2. Check that the tool file exists at `~/.config/opencode/tool/crawl4ai.ts`
3. Restart the OpenCode TUI
4. Verify agent permissions

### Connection Errors
If you get connection errors:
1. Ensure the Crawl4AI server is running: `docker run -p 11235:11235 unclecode/crawl4ai:latest`
2. Check that port 11235 is available
3. Verify Docker is running properly

### CAPTCHA Issues
If you encounter CAPTCHA blocks:
1. Use direct URLs instead of search queries
2. Try different search engines
3. Add delays between requests
4. Consider using a proxy service

## Performance Optimization

### 1. Caching
Take advantage of Crawl4AI's built-in caching when appropriate.

### 2. Selective Crawling
Only crawl the content you need:
```
"Use crawl4ai to fetch https://example.com but only extract the main article content."
```

### 3. Parallel Processing
When crawling multiple URLs, consider parallel processing:
```
"Use crawl4ai to fetch https://example1.com and https://example2.com simultaneously and compare their content."
```

## Security Considerations

### 1. URL Validation
Always validate URLs before crawling:
```
"Before using crawl4ai, verify that https://example.com is a valid and safe URL to crawl."
```

### 2. Content Filtering
Filter sensitive content from crawl results:
```
"Use crawl4ai to fetch https://example.com but exclude any personal information or sensitive data."
```

### 3. Rate Limiting
Implement appropriate rate limiting to avoid overloading websites:
```
"Use crawl4ai to fetch https://example.com, but ensure we're not making too many requests too quickly."
```

## Monitoring and Logging

### Tracking Usage
Monitor tool usage for optimization:
```
"Log each use of crawl4ai with the URL, response time, and success status."
```

### Error Reporting
Implement comprehensive error reporting:
```
"When crawl4ai fails, capture the error message, URL, and timestamp for debugging."
```

## Customization

### Extending Functionality
You can extend the Crawl4AI tool by creating custom variants:
```typescript
// In your custom tool file
export const customCrawl = tool({
  description: "Custom web crawling with specific processing",
  args: {
    url: tool.schema.string().describe("URL to crawl"),
    processType: tool.schema.string().describe("Type of processing to apply"),
  },
  async execute(args, context) {
    // Custom logic here
  },
})
```

### Configuration Options
Customize Crawl4AI behavior through configuration:
```yaml
tools:
  crawl4ai:
    serverUrl: "http://localhost:11235"
    timeout: 30000
    cache: true
```

This integration guide should help you effectively use the Crawl4AI tool with your OpenCode agents for various web crawling and content extraction tasks.