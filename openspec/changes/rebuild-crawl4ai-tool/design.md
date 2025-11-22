## Context

The existing crawl4ai tool is a placeholder implementation with mock functionality that doesn't provide actual web crawling capabilities. Users need real web crawling functionality integrated with OpenCode's tool ecosystem.

## Goals / Non-Goals

**Goals:**
- Provide real web crawling using Crawl4AI library
- Maintain comprehensive API design from existing implementation
- Ensure robust error handling and resource management
- Support advanced crawling strategies and filtering
- Integrate seamlessly with OpenCode tool patterns

**Non-Goals:**
- Support for legacy browser automation (focus on modern Crawl4AI)
- Complex custom crawling algorithms (use Crawl4AI's built-in strategies)
- Real-time crawling streaming (focus on batch operations)
- GUI or visual crawling interfaces (CLI/programmatic only)

## Decisions

- **Decision**: Use Crawl4AI library as core dependency instead of building from scratch
  - **Rationale**: Crawl4AI provides proven web crawling with anti-detection, browser automation, and content extraction
  - **Alternatives considered**: Puppeteer-only implementation, Playwright integration, custom HTTP scraping
  - **Chosen**: Crawl4AI offers best balance of features, maintenance, and anti-detection capabilities

- **Decision**: Maintain existing tool API structure while replacing implementation
  - **Rationale**: Preserves backward compatibility for users and documentation
  - **Alternatives considered**: Complete API redesign, minimal API with fewer options
  - **Chosen**: Keep existing comprehensive API for advanced use cases

- **Decision**: Implement comprehensive error handling with retry logic
  - **Rationale**: Web crawling is inherently unreliable due to network issues and bot detection
  - **Alternatives considered**: Fail-fast approach, basic error handling only
  - **Chosen**: Robust error handling provides better user experience

## Risks / Trade-offs

- **Risk**: Crawl4AI library dependency updates may break compatibility
  - **Mitigation**: Pin to specific version, implement compatibility layer
- **Risk**: Browser automation resource consumption
  - **Mitigation**: Implement proper cleanup, resource limits, and session management
- **Risk**: Anti-bot detection may still block crawling
  - **Mitigation**: Implement stealth mode, proxy rotation, user agent management
- **Trade-off**: Comprehensive API vs complexity
  - **Resolution**: Keep existing API but provide sensible defaults and progressive disclosure

## Migration Plan

**Phase 1**: Core Implementation
1. Set up Crawl4AI dependency and basic crawler
2. Replace mock implementations with real functionality
3. Ensure basic crawling works for simple cases

**Phase 2**: Advanced Features
1. Implement deep crawling strategies
2. Add filtering and content analysis
3. Implement file downloading and session management

**Phase 3**: Testing and Polish
1. Comprehensive test suite with real websites
2. Performance optimization and resource management
3. Documentation and examples

**Phase 4**: **MANDATORY Isolation Validation**
1. **CRITICAL**: All testing MUST use `OPENCODE_CONFIG_DIR=$PWD/opencode opencode...` for isolation
2. Validate tool discovery and functionality in isolated environment
3. Test error handling and edge cases in isolation
4. Confirm no interference with global OpenCode configuration
5. Document all isolation testing procedures and results

**Rollback Plan**: Keep existing implementation in separate branch, can revert if critical issues arise

**Isolation Testing Requirements**:
- **MANDATORY**: Every validation step must use `OPENCODE_CONFIG_DIR=$PWD/opencode` prefix
- **MANDATORY**: No testing against global `~/.config/opencode` configuration
- **MANDATORY**: All tool validation must pass in isolated environment before merge
- **MANDATORY**: Document isolation test commands in validation report

## Open Questions

- Should we implement crawling quotas or rate limiting to prevent abuse?
- How should we handle large-scale crawling (memory management, streaming)?
- Should we provide built-in caching for crawled content?
- How to handle JavaScript-heavy sites vs static content optimally?