# Crawl4AI Tool Tests

This directory contains comprehensive tests for the Crawl4AI OpenCode tool.

## Test Structure

- `validation.test.ts` - Core validation tests following OpenCode patterns
- `unit.test.ts` - Unit tests for individual functions (to be created)
- `integration.test.ts` - Integration tests with the actual Crawl4AI service (to be created)

## Running Tests

```bash
# Run all tests
bun test opencode/tool/crawl4ai/tests/

# Run specific test file
bun test opencode/tool/crawl4ai/tests/validation.test.ts
```

## Validation Framework

The validation tests ensure the tool follows OpenCode standards:

1. **OpenCode Compliance** - Tool naming, schema definitions, return types
2. **Input Validation** - Parameter validation and error handling
3. **Output Validation** - Consistent JSON output format
4. **Performance** - Time and memory efficiency
5. **Edge Cases** - Handling of special URLs and edge cases

## Test Coverage

- ✅ Tool naming conventions
- ✅ Schema parameter descriptions
- ✅ String return types from execute functions
- ✅ Required parameter validation
- ✅ Parameter type validation
- ✅ Optional parameter handling
- ✅ JSON output format consistency
- ✅ Error output format
- ✅ Performance within time limits
- ✅ Memory efficiency
- ✅ Long URL handling
- ✅ Special character handling
- ✅ Different URL schemes

## Adding New Tests

Follow the existing patterns in `validation.test.ts`:

1. Group related tests in `describe` blocks
2. Use clear, descriptive test names
3. Test both success and failure cases
4. Validate output formats
5. Check performance constraints