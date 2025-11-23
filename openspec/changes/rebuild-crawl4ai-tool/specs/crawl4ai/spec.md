## ADDED Requirements

### Requirement: Real Crawl4AI Integration
The system SHALL integrate with the actual Crawl4AI library to provide functional web crawling capabilities.

#### Scenario: Basic URL crawling with Crawl4AI
- **WHEN** user provides a valid URL to crawl tool
- **THEN** system shall use Crawl4AI library to crawl the actual webpage
- **AND** extract real content in the specified format (markdown, HTML, JSON)
- **AND** return structured results with links, images, and metadata
- **AND** handle network errors and bot detection gracefully

#### Scenario: Deep crawling with Crawl4AI strategies
- **WHEN** user uses deepCrawlTool with specific strategy
- **THEN** system shall implement real deep crawling using Crawl4AI's crawler
- **AND** follow the specified strategy (BFS, DFS, Best-First) for page discovery
- **AND** respect depth limits and page constraints
- **AND** provide real progress reporting and crawl statistics

### Requirement: Browser Automation and Session Management
The system SHALL provide real browser automation capabilities with session persistence.

#### Scenario: Browser session persistence
- **WHEN** user enables session persistence
- **THEN** system shall maintain browser state across multiple crawl operations
- **AND** preserve cookies, authentication, and browser context
- **AND** handle session expiration and re-authentication
- **AND** clean up browser resources properly after crawling

#### Scenario: Stealth mode and anti-detection
- **WHEN** user enables stealth mode
- **THEN** system shall use Crawl4AI's anti-bot detection features
- **AND** rotate user agents and browser fingerprints
- **AND** handle common bot detection challenges and CAPTCHAs
- **AND** implement realistic human-like browsing behavior

### Requirement: Real File Downloading
The system SHALL provide actual file downloading capabilities with progress tracking.

#### Scenario: File discovery and downloading
- **WHEN** user enables file downloading
- **THEN** system shall discover and download actual files from web pages
- **AND** filter files by type, size, and pattern criteria
- **AND** provide real progress tracking for download operations
- **AND** organize downloaded files in the specified output directory
- **AND** handle download failures and partial downloads gracefully

#### Scenario: Recursive file searching
- **WHEN** user enables recursive file searching
- **THEN** system shall follow links to discover files across multiple pages
- **AND** respect depth limits and domain restrictions
- **AND** avoid duplicate downloads and infinite loops
- **AND** provide comprehensive file discovery statistics

### Requirement: Content Analysis and Extraction
The system SHALL provide real content analysis using Crawl4AI's extraction capabilities.

#### Scenario: Structured content extraction
- **WHEN** user requests content analysis
- **THEN** system shall extract real structured data from web pages
- **AND** identify and extract main content, navigation, and metadata
- **AND** perform actual sentiment analysis and keyword density calculation
- **AND** extract real performance metrics and page information
- **AND** return results in the requested format (JSON, markdown)

#### Scenario: Image and media analysis
- **WHEN** user enables image extraction
- **THEN** system shall discover and analyze actual images on the page
- **AND** extract image metadata, dimensions, and alt text
- **AND** provide image classification and relevance scoring
- **AND** handle lazy-loaded and dynamic content properly

### Requirement: Error Handling and Recovery
The system SHALL implement robust error handling with real recovery mechanisms.

#### Scenario: Network error recovery
- **WHEN** network errors occur during crawling
- **THEN** system shall implement exponential backoff retry logic
- **AND** provide partial results when crawling is interrupted
- **AND** log detailed error information for troubleshooting
- **AND** allow resumption of interrupted crawling operations

#### Scenario: Bot detection handling
- **WHEN** bot detection mechanisms block crawling
- **THEN** system shall attempt alternative approaches (different user agents, proxies)
- **AND** implement CAPTCHA handling when possible
- **AND** provide clear error messages with suggested solutions
- **AND** fall back to alternative extraction methods when blocked

### Requirement: Performance and Resource Management
The system SHALL optimize performance and manage browser resources efficiently.

#### Scenario: Resource cleanup and management
- **WHEN** crawling operations complete or fail
- **THEN** system shall properly clean up browser instances and memory
- **AND** close open pages and network connections
- **AND** release file handles and temporary resources
- **AND** prevent memory leaks in long-running operations

#### Scenario: Concurrent crawling optimization
- **WHEN** crawling multiple pages or sites
- **THEN** system shall implement connection pooling and request queuing
- **AND** respect rate limits and avoid overwhelming target servers
- **AND** provide progress reporting for concurrent operations
- **AND** handle resource contention gracefully

## MODIFIED Requirements

### Requirement: OpenCode Integration
The system SHALL integrate seamlessly with OpenCode tool ecosystem using real Crawl4AI functionality.

#### Scenario: Tool export pattern with real implementation
- **WHEN** implementing tool exports for OpenCode
- **THEN** system shall follow OpenCode tool patterns with real crawling functionality
- **AND** use proper schema validation with Zod for all parameters
- **AND** implement real test mode capabilities that validate actual crawling
- **AND** provide meaningful error messages that help with troubleshooting
- **AND** **MANDATORY**: All validation must use isolation testing with `OPENCODE_CONFIG_DIR=$PWD/opencode opencode...`

#### Scenario: Environment configuration for Crawl4AI
- **WHEN** configuring tool behavior with environment variables
- **THEN** system shall use environment variables for Crawl4AI-specific settings
- **AND** provide sensible defaults for browser and crawling options
- **AND** support test mode that validates configuration without full crawling
- **AND** handle browser dependency installation and configuration
- **AND** **MANDATORY**: All configuration testing must use `OPENCODE_CONFIG_DIR=$PWD/opencode` for isolation

#### Scenario: Error reporting with real crawling context
- **WHEN** errors occur during real tool execution
- **THEN** system shall provide clear, actionable error messages with crawling context
- **AND** include relevant information like URL, crawl depth, and browser state
- **AND** suggest specific solutions for common crawling issues
- **AND** maintain OpenCode error handling standards while providing crawling-specific details