# URL Validator Tool Tests

This directory contains comprehensive test suites for the URL Validator tool, following OpenCode testing patterns.

## Test Structure

### Unit Tests (`unit.test.ts`)
- Tests individual functions in isolation
- Validates core logic for format, security, and accessibility checks
- Covers edge cases and error conditions
- Tests output format and data structures

### Integration Tests (`integration.test.ts`)
- Tests tool integration with OpenCode SDK
- Validates agent compatibility and permissions
- Tests multi-tool coordination scenarios
- Performance and concurrency testing
- Error recovery and resilience

### Validation Tests (`validation.test.ts`)
- OpenCode compliance validation
- Input/output validation framework
- Security validation patterns
- Performance benchmarking
- Edge case handling

## Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test unit.test.ts
bun test integration.test.ts
bun test validation.test.ts

# Run with coverage
bun test --coverage

# Run in watch mode
bun test --watch
```

## Test Coverage Areas

### ✅ Core Functionality
- URL format validation
- Security issue detection
- Accessibility checking
- Combined validation workflows

### ✅ Tool Interface
- OpenCode SDK compliance
- Parameter validation
- Return type validation
- Error handling

### ✅ Integration
- Agent compatibility
- Multi-tool coordination
- Performance benchmarks
- Concurrent request handling

### ✅ Edge Cases
- Malformed URLs
- Special characters
- Extremely long URLs
- Network failures
- Invalid input types

### ✅ Security
- JavaScript protocol detection
- Path traversal detection
- Credential detection
- Suspicious pattern identification

## Test Data

Tests use a combination of:
- Mock data for predictable results
- Public APIs (httpbin.org) for network testing
- Edge case inputs for boundary testing
- Error scenarios for resilience testing

## Validation Results

All tests are designed to pass with the current implementation and provide comprehensive coverage of the tool's functionality, ensuring production readiness.

## CI/CD Integration

These tests are designed to run in CI/CD pipelines:
- Fast execution (< 30 seconds total)
- No external dependencies (except optional network tests)
- Clear pass/fail reporting
- Coverage reporting capabilities