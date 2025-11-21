# Crawl4AI Tool for OpenCode

A comprehensive web crawling tool that enables OpenCode users to perform web research, content extraction, and data collection with advanced crawling capabilities.

## 🚀 Features

### Simple Crawling
- **Single-page web crawling** with content extraction
- **Multiple output formats** (markdown, HTML, JSON)
- **Link and media resource discovery**
- **Error handling and validation**
- **Session persistence** for authenticated content

### Deep Crawling
- **Multiple crawling strategies** (BFS, DFS, BestFirst)
- **Configurable depth limits** and page constraints
- **Content filtering** and URL pattern matching
- **Progress reporting** and statistics
- **Keyword-based relevance scoring**

### Advanced Features
- **File downloading** and media handling
- **Browser control** and anti-detection
- **Proxy support** and stealth mode
- **Content analysis** with sentiment detection
- **Performance metrics** and readability scores

## 📖 Usage

### Basic URL Crawling
```typescript
// Simple page crawling
const result = await crawl({
  url: "https://example.com",
  format: "markdown",
  depth: 1,
  maxPages: 10
});
```

### Deep Crawling with Strategies
```typescript
// BFS Strategy - Breadth-First Search
const bfsResult = await deepCrawl({
  url: "https://docs.example.com",
  strategy: "bfs",
  depth: 3,
  maxPages: 50,
  includePatterns: ["/docs", "/api"],
  excludePatterns: ["/admin", "/private"]
});

// DFS Strategy - Depth-First Search
const dfsResult = await deepCrawl({
  url: "https://docs.example.com",
  strategy: "dfs",
  depth: 2,
  maxPages: 25
});

// BestFirst Strategy - Keyword-based prioritization
const bestFirstResult = await deepCrawl({
  url: "https://docs.example.com",
  strategy: "bestfirst",
  keywords: ["api", "documentation", "tutorial"],
  depth: 3,
  maxPages: 30
});
```

### Content Filtering
```typescript
// URL pattern filtering
const filteredResult = await crawl({
  url: "https://example.com",
  includePatterns: ["/blog", "/news"],
  excludePatterns: ["/admin", "/private"],
  includeDomains: ["example.com", "trusted.com"],
  excludeDomains: ["spam.com", "ads.com"]
});
```

### File Downloading
```typescript
// Download specific file types
const downloadResult = await downloadFiles({
  url: "https://example.com",
  outputDir: "./downloads",
  fileTypes: ["pdf", "jpg", "png", "docx"],
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxFiles: 100,
  recursive: true
});
```

### Content Analysis
```typescript
// Comprehensive content analysis
const analysisResult = await analyze({
  url: "https://example.com",
  extractImages: true,
  extractLinks: true,
  extractMetadata: true,
  includePerformance: true,
  includeSentiment: true,
  keywordAnalysis: true,
  format: "json"
});
```

## ⚙️ Configuration

### Environment Variables
```bash
# Core Configuration
CRAWL4AI_DEFAULT_OUTPUT_DIR="./crawled-content"
CRAWL4AI_MAX_DEPTH=3
CRAWL4AI_MAX_PAGES=50
CRAWL4AI_DEFAULT_FORMAT="markdown"

# Advanced Features
CRAWL4AI_ENABLE_STEALTH=false
CRAWL4AI_PROXY_SERVER=""
CRAWL4AI_PROXY_USERNAME=""
CRAWL4AI_PROXY_PASSWORD=""

# Testing
CRAWL4AI_TEST_MODE="false"
```

### Tool Parameters Reference

#### crawl() Parameters
- `url` (string, required) - URL to crawl
- `depth` (number, optional, default: 1) - Crawl depth
- `maxPages` (number, optional, default: 10) - Maximum pages to crawl
- `format` (enum, optional, default: "markdown") - Output format: "markdown" | "html" | "json"
- `outputDir` (string, optional) - Output directory for results
- `stealth` (boolean, optional, default: false) - Enable stealth mode
- `session` (boolean, optional, default: false) - Maintain session persistence
- `includePatterns` (array, optional) - URL patterns to include
- `excludePatterns` (array, optional) - URL patterns to exclude
- `includeDomains` (array, optional) - Domains to include
- `excludeDomains` (array, optional) - Domains to exclude
- `downloadFiles` (boolean, optional, default: false) - Enable file downloading
- `fileTypes` (array, optional) - File types to download

#### deepCrawlTool() Parameters
- All `crawl()` parameters plus:
- `strategy` (enum, optional, default: "bfs") - "bfs" | "dfs" | "bestfirst"
- `keywords` (array, optional) - Keywords for relevance scoring
- `includeExternalLinks` (boolean, optional, default: false) - Include external links

#### download() Parameters
- `url` (string, required) - URL to download files from
- `fileTypes` (array, optional) - File types to download
- `outputDir` (string, optional) - Output directory
- `maxFiles` (number, optional, default: 100) - Maximum files to download
- `maxFileSize` (number, optional) - Maximum file size in bytes
- `includePatterns` (array, optional) - URL patterns for file discovery
- `excludePatterns` (array, optional) - URL patterns to exclude
- `recursive` (boolean, optional, default: false) - Search recursively

#### analyze() Parameters
- `url` (string, required) - URL to analyze
- `extractImages` (boolean, optional, default: true) - Extract image information
- `extractLinks` (boolean, optional, default: true) - Extract link information
- `extractMetadata` (boolean, optional, default: true) - Extract page metadata
- `format` (enum, optional, default: "json") - Output format
- `includePerformance` (boolean, optional, default: true) - Include performance metrics
- `includeSentiment` (boolean, optional, default: true) - Include sentiment analysis
- `keywordAnalysis` (boolean, optional, default: true) - Include keyword density analysis

## 🛠️ Tool Exports

### Primary Tools
- **`crawl`** - Simple single-page crawling with content extraction
- **`deepCrawlTool`** - Advanced multi-page crawling with strategies
- **`download`** - File downloading with filtering capabilities
- **`analyze`** - Content analysis and structured data extraction

### Utility Classes
- **`URLFilterManager`** - URL pattern and domain filtering
- **`ContentScorer`** - Keyword-based content relevance scoring

## 🧪 Testing

### Running Tests
```bash
# Run all tests
bun test

# Run specific test files
bun test tests/unit.test.ts
bun test tests/integration.test.ts
bun test tests/validation.test.ts

# Type checking
bun run type-check

# Build
bun run build
```

### Test Coverage
- **Unit Tests** - Core function validation and edge cases
- **Integration Tests** - End-to-end workflow scenarios
- **Validation Tests** - Output structure and data quality validation
- **Performance Tests** - Response time and memory usage validation

### Test Mode
Set `CRAWL4AI_TEST_MODE="true"` to enable mock responses for testing without actual network calls.

## 🔧 Dependencies

### Core Dependencies
- **`@opencode-ai/sdk`** - OpenCode integration and tool patterns
- **`zod`** - Schema validation and type safety

### Optional Dependencies
- **`crawl4ai`** - Core crawling functionality (when implemented)

### Development Dependencies
- **`@opencode-ai/plugin`** - OpenCode plugin development tools
- **`@types/node`** - Node.js type definitions
- **`bun-types`** - Bun runtime types

## 🛡️ Error Handling

### Comprehensive Error Coverage
- **URL Validation** - Invalid URLs and malformed requests
- **Network Errors** - Timeouts, connection failures, rate limiting
- **Content Access** - 403/404 errors, authentication issues
- **File System** - Permission errors, disk space, path validation
- **Configuration** - Invalid parameters, conflicting options

### Error Recovery
- **Graceful Degradation** - Partial results when possible
- **Retry Logic** - Exponential backoff for transient failures
- **Clear Messages** - Actionable error descriptions with suggestions
- **Test Mode** - Mock responses for development and testing

## 📊 Output Formats

### JSON Output
```json
{
  "url": "https://example.com",
  "success": true,
  "content": "Extracted content...",
  "links": ["https://example.com/about", "https://example.com/contact"],
  "images": ["https://example.com/images/logo.png"],
  "metadata": {
    "title": "Page Title",
    "description": "Page description",
    "wordCount": 1250,
    "contentType": "text/html"
  },
  "crawlStats": {
    "pagesCrawled": 1,
    "totalLinks": 5,
    "totalImages": 3,
    "crawlTime": 250
  }
}
```

### Markdown Output
```markdown
# Content Analysis Report

## URL
https://example.com

## Summary
Extracted content summary with key insights...

## Links Found
- [About Us](https://example.com/about)
- [Contact](https://example.com/contact)

## Images Found
- ![Logo](https://example.com/images/logo.png)
```

## 🚀 Performance Considerations

### Optimization Features
- **Concurrent Crawling** - Parallel page processing where appropriate
- **Memory Management** - Efficient streaming for large crawls
- **Intelligent Caching** - Resource reuse and duplicate avoidance
- **Resource Cleanup** - Automatic memory and file handle management

### Scalability Limits
- **Configurable Concurrency** - Adjustable parallel processing limits
- **Memory Monitoring** - Usage tracking and threshold alerts
- **Progress Reporting** - Real-time status for long operations
- **Cancellation Support** - Graceful interruption of running crawls

## 🔒 Security & Privacy

### Data Protection
- **No Sensitive Data Storage** - Temporary content only
- **Configurable Retention** - User-controlled data lifecycle
- **Secure Proxy Handling** - Encrypted authentication support
- **SSL Validation** - Certificate verification and analysis

### Ethical Crawling
- **Robots.txt Compliance** - Automatic rule checking and caching
- **Rate Limiting** - Configurable delays between requests
- **User-Agent Identification** - Clear bot identification
- **Respectful Access** - Server resource consideration

## 📈 Advanced Usage Examples

### Research Workflow
```typescript
// Academic research with content analysis
const researchResults = await analyze({
  url: "https://research-site.example.com/paper",
  extractMetadata: true,
  includePerformance: true,
  includeSentiment: true,
  keywordAnalysis: true,
  format: "json"
});

// Follow-up deep crawl of related content
const relatedContent = await deepCrawl({
  url: "https://research-site.example.com",
  strategy: "bestfirst",
  keywords: researchResults.content.topics,
  depth: 2,
  maxPages: 20,
  includePatterns: ["/papers", "/citations"]
});
```

### Content Migration
```typescript
// Download all documentation files
const migrationResult = await download({
  url: "https://old-site.example.com/docs",
  fileTypes: ["pdf", "doc", "md"],
  outputDir: "./migrated-content",
  maxFiles: 500,
  maxFileSize: 100 * 1024 * 1024, // 100MB
  recursive: true,
  includePatterns: ["/documentation", "/guides", "/manuals"]
});
```

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `bun install`
3. Run tests: `bun test`
4. Make changes with test coverage
5. Submit pull request with documentation

### Adding New Features
- Follow OpenCode tool patterns
- Add comprehensive tests
- Update documentation
- Consider performance impact
- Ensure error handling

## 📝 License

This tool follows the OpenCode project license and contribution guidelines.

## 🔗 Related Tools

- **Gemini Tool** - Image generation and analysis
- **URL Validator** - URL validation and analysis
- **Template Tool** - Tool development patterns

For more information, see the [OpenCode Documentation](https://docs.opencode.ai).