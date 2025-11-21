# Crawl4AI Tool Testing Framework

This directory contains comprehensive test suites for validating the Crawl4AI tool implementation.

## Test Structure

### Core Test Files

1. **validation.test.ts** - Test framework and validation utilities
   - Automated validation suite runner
   - Performance benchmarking tools
   - Mock scenario testing
   - Validation report generation

2. **unit.test.ts** - Unit tests for individual functions
   - Simple crawling functionality
   - Deep crawling strategies
   - Content filtering
   - File downloading
   - Content extraction

3. **test-framework.test.ts** - Integration testing framework
   - Mock server for consistent testing
   - Test data generators
   - Performance measurement utilities
   - Integration test scenarios

## Test Categories

### Functional Tests
- ✅ Simple URL crawling
- ✅ Deep crawling with multiple strategies
- ✅ Content filtering and extraction
- ✅ File downloading capabilities
- ✅ Error handling and edge cases

### Performance Tests
- ⏱️ Crawl speed benchmarks
- 💾 Memory usage validation
- 📊 Resource efficiency testing
- 🚀 Concurrent crawling performance

### Integration Tests
- 🔗 Real-world scenario testing
- 🌐 Mock server integration
- 📋 End-to-end workflow validation
- 🔧 Configuration management testing

## Running Tests

### Unit Tests
```bash
# Run all unit tests
bun test opencode/tool/crawl4ai/tests/unit.test.ts

# Run with coverage
bun test --coverage opencode/tool/crawl4ai/tests/unit.test.ts
```

### Integration Tests
```bash
# Run integration test suite
bun test opencode/tool/crawl4ai/tests/test-framework.test.ts

# Run with verbose output
bun test --verbose opencode/tool/crawl4ai/tests/test-framework.test.ts
```

### Validation Suite
```bash
# Run complete validation suite
bun test opencode/tool/crawl4ai/tests/validation.test.ts

# Generate validation report
bun test opencode/tool/crawl4ai/tests/validation.test.ts > validation-report.json
```

### Performance Benchmarks
```bash
# Run performance benchmarks
bun test opencode/tool/crawl4ai/tests/validation.test.ts --benchmark

# Compare with baseline
bun test opencode/tool/crawl4ai/tests/validation.test.ts --compare baseline.json
```

## Test Scenarios

### Basic Scenarios
1. **Simple URL Crawl**
   - Input: Single valid URL
   - Expected: Successful content extraction
   - Validation: Markdown output, link discovery

2. **Invalid URL Handling**
   - Input: Malformed URL
   - Expected: Graceful error handling
   - Validation: Clear error message

3. **Content Extraction**
   - Input: HTML content with structured data
   - Expected: Clean markdown output
   - Validation: Preserved structure and formatting

### Advanced Scenarios
1. **Deep Crawling**
   - Input: Starting URL with depth=2
   - Expected: Multiple pages crawled
   - Validation: Link following, depth control

2. **Content Filtering**
   - Input: URL patterns and domain filters
   - Expected: Filtered results only
   - Validation: Correct filter application

3. **File Downloading**
   - Input: Page with media files
   - Expected: Files discovered and downloaded
   - Validation: File integrity and paths

## Performance Benchmarks

### Thresholds
- **Simple Crawl**: < 5 seconds, < 50MB memory
- **Deep Crawl**: < 15 seconds, < 100MB memory
- **File Download**: < 30 seconds per 10MB file
- **Concurrent Crawls**: Linear memory scaling

### Metrics
- Response time per page
- Memory usage during crawl
- Success rate for different site types
- Error recovery performance

## Mock Data

### Test Websites
- **example.com** - Basic HTML structure
- **docs.example.com** - Multi-page documentation
- **blog.example.com** - Content filtering scenarios
- **error.com** - Error handling tests

### Test Content
- Standard HTML5 structure
- Common CMS patterns (WordPress, etc.)
- JavaScript-heavy single-page apps
- File download scenarios

## Validation Reports

### Report Format
```json
{
  "scenario": "Simple URL Crawl",
  "passed": true,
  "results": {
    "url": "https://example.com",
    "success": true,
    "pages": 1,
    "formats": ["markdown"],
    "features": ["content_extraction", "link_discovery"]
  },
  "performance": {
    "duration": 1500,
    "memoryUsage": 25165824
  },
  "errors": []
}
```

### Success Criteria
- ✅ All functional tests pass (>90%)
- ✅ Performance within benchmarks
- ✅ Error handling robust
- ✅ Output format consistency
- ✅ Memory management efficient

## Continuous Integration

### Automated Testing
```yaml
# .github/workflows/test-crawl4ai.yml
name: Test Crawl4AI Tool
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test opencode/tool/crawl4ai/tests/
      - run: bun run type-check
```

### Quality Gates
- Unit test coverage > 90%
- Integration tests all pass
- Performance benchmarks met
- No memory leaks detected
- Error handling comprehensive

## Test Data Management

### Fixtures
- Stored in `tests/fixtures/`
- Version controlled test data
- Mock server responses
- Sample HTML structures

### Cleanup
- Automatic test output cleanup
- Temporary file management
- Memory cleanup between tests
- Network resource cleanup

## Debugging Tools

### Test Mode
```bash
# Enable test mode
export CRAWL4AI_TEST_MODE=true

# Mock API responses
export CRAWL4AI_MOCK_API=true
```

### Logging
```bash
# Enable debug logging
export CRAWL4AI_LOG_LEVEL=debug

# Save logs to file
bun test opencode/tool/crawl4ai/tests/ 2>&1 | tee test.log
```

This comprehensive testing framework ensures the Crawl4AI tool meets all functional, performance, and quality requirements before integration into OpenCode.