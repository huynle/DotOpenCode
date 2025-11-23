# Change: Rebuild Crawl4AI Tool from Scratch

## Why
The existing Crawl4AI tool implementation is a placeholder with mock functionality that doesn't actually integrate with the Crawl4AI library. To provide users with real web crawling capabilities, we need to rebuild the tool from scratch with proper Crawl4AI integration, maintaining the comprehensive API design while implementing actual functionality.

## What Changes
- **BREAKING**: Complete rewrite of the crawl4ai tool implementation
- Add real Crawl4AI library integration with proper async crawling
- Implement actual browser automation and content extraction
- Add robust error handling and retry mechanisms
- Implement real file downloading with progress tracking
- Add comprehensive logging and debugging capabilities
- Update test suite to work with real crawling functionality
- Add performance optimization and resource management
- Implement proper session management and cookie handling
- Add real proxy support and anti-detection features

## Impact
- Affected specs: `crawl4ai` capability (complete rewrite)
- Affected code: `opencode/tool/crawl4ai/` (complete replacement)
- Dependencies: Adds `crawl4ai` library dependency, removes mock implementations
- **BREAKING**: Existing mock APIs will be replaced with real functionality
- Testing: Test suite will be updated to work with real crawling instead of mocks
- **MANDATORY**: All validation and testing MUST use isolation via `OPENCODE_CONFIG_DIR=$PWD/opencode opencode...`