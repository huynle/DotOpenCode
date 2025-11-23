# Implementation Tasks

## 1. Python Script Implementation
- [x] 1.1 Create `.opencode/tool/google_search.py`
- [x] 1.2 Implement command-line argument parsing
- [x] 1.3 Add serper.dev API POST request with urllib/http.client
- [x] 1.4 Parse response and extract top 5 organic results
- [x] 1.5 Output clean JSON to stdout
- [x] 1.6 Add error handling for API failures

## 2. TypeScript Tool Definition
- [x] 2.1 Create `.opencode/tool/search.ts`
- [x] 2.2 Import tool helper from `@opencode-ai/plugin/tool`
- [x] 2.3 Define tool schema with query parameter
- [x] 2.4 Implement execute() using Bun.$ to call Python script
- [x] 2.5 Return string result from Python script
- [x] 2.6 Add error handling for script execution

## 3. Tool Registration
- [x] 3.1 Update `.opencode/tool/index.ts` to export search tool
- [x] 3.2 Add descriptive comment for tool export

## 4. Validation
- [x] 4.1 Test Python script standalone
- [x] 4.2 Test TypeScript tool with Bun runtime
- [x] 4.3 Verify SERPER_API_KEY environment variable handling
- [x] 4.4 Validate JSON output format
- [x] 4.5 Test error scenarios (missing API key, network failure)

## 4. File Structure Organization
- [x] 4.1 Create `opencode/tool/google-search/` directory
- [x] 4.2 Move Python script to `opencode/tool/google-search/index.py`
- [x] 4.3 Move TypeScript file to `opencode/tool/google-search/index.ts`
- [x] 4.4 Create `opencode/tests/tools/google-search/` test directory
- [x] 4.5 Create `opencode/docs/tools/google-search/` documentation directory
- [x] 4.6 Remove loose files from main tool directory

## 5. Validation
- [x] 5.1 Test Python script standalone
- [x] 5.2 Test TypeScript tool with Bun runtime
- [x] 5.3 Verify SERPER_API_KEY environment variable handling
- [x] 5.4 Validate JSON output format
- [x] 5.5 Test error scenarios (missing API key, network failure)

## 6. Documentation
- [x] 6.1 Create comprehensive README in `opencode/docs/tools/google-search/`
- [x] 6.2 Document SERPER_API_KEY requirement
- [x] 6.3 Create validation test report
- [x] 6.4 Create test suite with unit, integration, and validation tests
- [x] 6.5 Document proper file structure
