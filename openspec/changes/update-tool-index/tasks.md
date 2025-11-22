# Update Tool Index Tasks

## Implementation Tasks

### 1. Code Updates
- [x] Add crawl4ai export statements to `@opencode/tool/index.ts`
- [x] Verify export pattern matches existing tools (gemini, url-validator)
- [x] Ensure all crawl4ai functions are properly exported
- [x] Add default export following established convention

### 2. Validation & Testing
- [x] Run TypeScript compilation to verify no type errors
- [x] Test tool imports in a sample agent implementation
- [x] Verify existing tool exports remain functional
- [x] Run integration tests with updated index.ts

### 3. Documentation
- [x] Update tool index documentation if needed
- [x] Verify crawl4ai tool documentation is accessible
- [x] Ensure export comments follow established pattern

### 4. Quality Assurance
- [x] Review code formatting and consistency
- [x] Verify no breaking changes to existing functionality
- [x] Test tool discovery and accessibility
- [x] Validate integration with OpenCode agent ecosystem

## Dependencies

- Must have crawl4ai tool implementation completed
- Requires access to `@opencode/tool/index.ts` file
- No external dependencies or blocking items

## Validation Criteria

- TypeScript compilation succeeds without errors
- All crawl4ai functions are importable from `@opencode/tool`
- Existing tool functionality remains unchanged
- Integration tests pass with new exports
- Tool follows established export patterns and conventions