# Crawl4AI Tool Implementation Proposal

## Executive Summary

This proposal outlines the implementation of a comprehensive web crawling tool for OpenCode using Crawl4AI, similar to the existing Gemini tool structure. The tool will provide both simple and advanced crawling capabilities, including deep crawling, file downloading, content extraction, and all core/advanced features outlined in the Crawl4AI documentation.

## Purpose

Create a versatile web research and crawling tool that enables OpenCode users to:
- Perform simple single-page crawling
- Execute deep crawling with multiple strategies (BFS, DFS, BestFirst)
- Download files and media content
- Extract structured data using various strategies
- Handle advanced scenarios (proxies, authentication, stealth mode)
- Generate LLM-friendly content (markdown, structured data)

## Technical Requirements

### Core Features
1. **Simple Crawling**
   - Single URL crawling with configurable options
   - Content extraction (HTML, markdown, cleaned content)
   - Link and media discovery
   - Error handling and status reporting

2. **Deep Crawling**
   - BFSDeepCrawlStrategy for breadth-first exploration
   - DFSDeepCrawlStrategy for depth-first exploration
   - BestFirstCrawlingStrategy with keyword relevance scoring
   - Configurable depth limits and page constraints
   - Streaming and non-streaming result modes

3. **Content Filtering & Extraction**
   - URL pattern filters
   - Domain filters (include/exclude)
   - Content type filtering
   - SEO-based quality assessment
   - Content relevance filtering

### Advanced Features
1. **File Downloading**
   - Automatic file discovery and download
   - Media file handling (images, videos, documents)
   - Configurable download directories
   - File type filtering

2. **Browser Control & Anti-Detection**
   - Proxy support (HTTP/HTTPS with authentication)
   - Stealth mode for basic bot detection bypass
   - Undetected browser adapter for advanced protection
   - Custom headers and user agents
   - Session persistence and storage state

3. **Security & Compliance**
   - SSL certificate retrieval and analysis
   - Robots.txt compliance with caching
   - Custom authentication headers
   - HTTPS preservation for internal links

4. **Output Formats**
   - Raw HTML and cleaned HTML
   - Markdown generation (raw and fit)
   - Structured data extraction
   - PDF and screenshot capture
   - JSON export with metadata

## Implementation Plan

### Phase 1: Core Infrastructure
1. **Tool Structure Setup**
   - Follow OpenCode tool pattern from gemini tool
   - Create package.json with dependencies
   - Implement environment configuration
   - Add test mode capabilities

2. **Basic Crawling Functions**
   - `crawlSimple()` - Single page crawling
   - `crawlDeep()` - Multi-page crawling
   - `downloadFiles()` - File discovery and download
   - Error handling and validation

### Phase 2: Advanced Features
1. **Strategies Implementation**
   - Deep crawling strategies (BFS, DFS, BestFirst)
   - Filter chains and URL scorers
   - Content extraction strategies
   - Streaming vs non-streaming modes

2. **Browser Management**
   - Proxy configuration
   - Stealth and undetected modes
   - Session persistence
   - Custom headers and authentication

### Phase 3: Tool Interfaces
1. **OpenCode Tool Exports**
   - `/crawl` - Simple crawling interface
   - `/deep_crawl` - Advanced deep crawling
   - `/download` - File downloading focus
   - `/analyze` - Content analysis and extraction

2. **Configuration Options**
   - Output directory management
   - Crawl depth and limits
   - Filter configurations
   - Format preferences

## Technical Architecture

### Dependencies
```json
{
  "dependencies": {
    "@opencode-ai/sdk": "^0.10.0",
    "zod": "^4.1.9",
    "crawl4ai": "^0.7.0"
  },
  "devDependencies": {
    "@opencode-ai/plugin": "^0.10.0",
    "@types/node": "^24.2.1",
    "bun-types": "latest"
  }
}
```

### File Structure
```
opencode/tool/crawl4ai/
├── index.ts              # Main tool exports
├── package.json           # Dependencies and scripts
├── README.md             # Tool documentation
├── tsconfig.json         # TypeScript configuration
├── src/
│   ├── core/            # Core crawling functions
│   ├── strategies/       # Deep crawling strategies
│   ├── filters/          # Content and URL filters
│   ├── extractors/      # Data extraction strategies
│   └── utils/           # Utility functions
└── tests/
    ├── unit/            # Unit tests
    ├── integration/     # Integration tests
    └── fixtures/        # Test data
```

### API Design
```typescript
// Core crawling interface
interface CrawlConfig {
  url: string;
  depth?: number;
  maxPages?: number;
  outputDir?: string;
  format?: 'markdown' | 'html' | 'json';
  filters?: FilterConfig[];
  strategy?: 'bfs' | 'dfs' | 'bestfirst';
  stream?: boolean;
}

// Tool exports
export const crawl = tool({
  description: "Crawl a single URL or perform deep crawling",
  args: {
    url: tool.schema.string().describe("URL to crawl"),
    depth: tool.schema.number().optional().describe("Crawl depth (default: 1)"),
    maxPages: tool.schema.number().optional().describe("Maximum pages to crawl"),
    outputDir: tool.schema.string().optional().describe("Output directory"),
    format: tool.schema.enum(['markdown', 'html', 'json']).optional().describe("Output format"),
    strategy: tool.schema.enum(['bfs', 'dfs', 'bestfirst']).optional().describe("Crawling strategy"),
    keywords: tool.schema.array().optional().describe("Keywords for relevance scoring")
  },
  async execute(args, context) {
    // Implementation
  }
});
```

## Testing Strategy

### Unit Testing
- Test individual crawling functions
- Validate filter chains and scorers
- Test error handling scenarios
- Mock API responses for consistent testing

### Integration Testing
- Test against real websites
- Validate deep crawling strategies
- Test file downloading capabilities
- Verify output formats and quality

### Validation Framework
```typescript
// Test script structure
interface TestScenario {
  name: string;
  url: string;
  config: Partial<CrawlConfig>;
  expectedResults: {
    pageCount?: number;
    formats: string[];
    features: string[];
  };
}

// Automated validation
async function validateCrawlResults(scenario: TestScenario): Promise<ValidationReport> {
  // Execute crawl
  // Validate results against expectations
  // Generate report
}
```

## Configuration Management

### Environment Variables
```bash
# Crawl4AI Configuration
CRAWL4AI_DEFAULT_OUTPUT_DIR="./crawled-content"
CRAWL4AI_MAX_DEPTH=3
CRAWL4AI_MAX_PAGES=50
CRAWL4AI_DEFAULT_FORMAT="markdown"
CRAWL4AI_ENABLE_STEALTH=false
CRAWL4AI_PROXY_SERVER=""
CRAWL4AI_PROXY_USERNAME=""
CRAWL4AI_PROXY_PASSWORD=""

# Testing
CRAWL4AI_TEST_MODE="false"
```

### Tool Configuration
- Support for custom output directories
- Configurable crawl limits and defaults
- Filter preset management
- Strategy preference settings

## Error Handling & Edge Cases

### Common Scenarios
1. **Network Issues**
   - Timeout handling
   - Retry logic with exponential backoff
   - Proxy fallback options

2. **Content Access**
   - 403/404 error handling
   - Robots.txt compliance
   - Rate limiting detection

3. **Data Validation**
   - Malformed URL handling
   - Content type validation
   - File system permissions

### Error Recovery
- Graceful degradation for failed features
- Partial result reporting
- Clear error messages with suggestions
- Test mode for development

## Performance Considerations

### Optimization Strategies
- Concurrent crawling where appropriate
- Memory-efficient streaming for large crawls
- Intelligent caching strategies
- Resource cleanup and management

### Scalability
- Configurable concurrency limits
- Memory usage monitoring
- Progress reporting for long operations
- Cancellation support for running crawls

## Security & Privacy

### Data Protection
- No storage of sensitive crawled data
- Configurable data retention
- Secure proxy authentication handling
- SSL certificate validation

### Ethical Crawling
- Robots.txt compliance by default
- Rate limiting to respect server resources
- User-agent identification
- Configurable delays between requests

## Success Metrics

### Functional Requirements
- ✅ Successfully crawl single pages
- ✅ Execute deep crawling with all strategies
- ✅ Download files and media content
- ✅ Extract content in multiple formats
- ✅ Handle advanced features (proxy, stealth, etc.)

### Quality Requirements
- ✅ Clean markdown output suitable for LLMs
- ✅ Structured data extraction accuracy
- ✅ Error handling robustness
- ✅ Performance within acceptable limits
- ✅ Comprehensive test coverage (>90%)

### Integration Requirements
- ✅ Seamless OpenCode integration
- ✅ Consistent with existing tool patterns
- ✅ Clear documentation and examples
- ✅ Proper error messages and user guidance

## Implementation Timeline

### Week 1: Foundation
- Set up project structure and dependencies
- Implement basic crawling functions
- Create test framework foundation
- Simple crawling tool interface

### Week 2: Advanced Features
- Implement deep crawling strategies
- Add filtering and scoring capabilities
- File downloading functionality
- Advanced browser controls

### Week 3: Polish & Testing
- Comprehensive testing suite
- Error handling and edge cases
- Documentation and examples
- Performance optimization

### Week 4: Validation & Release
- Integration testing with OpenCode
- Final validation against requirements
- Documentation review
- Production deployment preparation

## Risks & Mitigations

### Technical Risks
1. **Crawl4AI API Changes**
   - Mitigation: Use stable version, implement abstraction layer
   
2. **Performance Issues**
   - Mitigation: Implement streaming, memory management
   
3. **Website Compatibility**
   - Mitigation: Multiple strategies, extensive testing

### Project Risks
1. **Scope Creep**
   - Mitigation: Clear MVP definition, phased approach
   
2. **Testing Complexity**
   - Mitigation: Automated test suite, mock servers

## Conclusion

This proposal provides a comprehensive plan for implementing a production-ready Crawl4AI tool for OpenCode. The phased approach ensures manageable development while delivering immediate value through simple crawling capabilities and progressively adding advanced features.

The tool will significantly enhance OpenCode's web research capabilities, providing users with powerful, flexible crawling functionality that integrates seamlessly with the existing ecosystem while following established patterns and best practices.