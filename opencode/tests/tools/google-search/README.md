# Google Search Tool Tests

Test suite for the Google Search tool using serper.dev API.

## Test Files

- **unit.test.ts**: Unit tests for tool definition and basic functionality
- **integration.test.ts**: Integration tests with real API calls
- **validation.test.ts**: Validation tests for input handling and return types

## Running Tests

### Unit Tests
```bash
cd opencode/tests/tools/google-search
bun test unit.test.ts
```

### Integration Tests
```bash
# Set real API key first
export SERPER_API_KEY="your-api-key"

cd opencode/tests/tools/google-search
bun test integration.test.ts
```

### All Tests
```bash
cd opencode/tests/tools/google-search
bun test
```

## Test Coverage

- ✅ Tool definition validation
- ✅ Parameter schema validation
- ✅ Return type validation
- ✅ Error handling (missing API key)
- ✅ Network error handling
- ✅ Input validation (empty, special chars, long queries)
- ✅ Real API integration

## Requirements

- Bun runtime
- SERPER_API_KEY environment variable (for integration tests)
- Python 3 (for Python script execution)

## Expected Results

All tests should pass with:
- Unit tests: 100% pass rate
- Integration tests: Pass if SERPER_API_KEY is valid
- Validation tests: 100% pass rate