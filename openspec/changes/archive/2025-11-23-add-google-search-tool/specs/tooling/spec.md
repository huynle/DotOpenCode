# Tooling Specification - Google Search Tool

## ADDED Requirements

### Requirement: Google Search Integration
The system SHALL provide a tool for performing real-time internet searches using the serper.dev API.

#### Scenario: Successful search query
- **WHEN** user provides a search query string
- **THEN** the tool returns top 5 organic search results with title, link, and snippet

#### Scenario: Missing API key
- **WHEN** SERPER_API_KEY environment variable is not set
- **THEN** the tool returns an error message indicating missing API key

#### Scenario: API request failure
- **WHEN** serper.dev API request fails
- **THEN** the tool returns an error message with failure details

### Requirement: Python Script Implementation
The system SHALL implement a Python script using standard library only (urllib or http.client) to avoid external dependencies.

#### Scenario: Standard library usage
- **WHEN** Python script is executed
- **THEN** no external package installation is required

#### Scenario: Command-line argument handling
- **WHEN** script receives query as command-line argument
- **THEN** query is properly parsed and sent to API

### Requirement: TypeScript Tool Definition
The system SHALL provide a TypeScript tool definition using the `@opencode-ai/plugin/tool` helper.

#### Scenario: Tool schema validation
- **WHEN** tool is invoked with query parameter
- **THEN** parameter is validated as string type

#### Scenario: Python script execution
- **WHEN** tool execute() is called
- **THEN** Python script is invoked using Bun.$ with query argument

#### Scenario: String return type
- **WHEN** tool execution completes
- **THEN** result is returned as string (JSON format)

### Requirement: Tool Registration
The system SHALL register the search tool in main index.ts for agent accessibility.

#### Scenario: Tool discovery
- **WHEN** agents query available tools
- **THEN** search tool appears in tool list

#### Scenario: Tool invocation
- **WHEN** agent uses search tool
- **THEN** tool executes successfully and returns results
