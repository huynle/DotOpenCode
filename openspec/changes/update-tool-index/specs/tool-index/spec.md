# Tool Index Update Specification

## ADDED Requirements

### Requirement: Tool Export Integration
The `@opencode/tool/index.ts` MUST export the crawl4ai tool functions to make them accessible to OpenCode agents and users.

#### Scenario:
When a developer wants to use crawl4ai functionality in their OpenCode agent, they should be able to import it from `@opencode/tool` like this:
```typescript
import { crawl, scrape, map } from "@opencode/tool"
```

### Requirement: Export Pattern Consistency
The crawl4ai tool exports MUST follow the same pattern as existing tools (gemini, url-validator) in the index.ts file.

#### Scenario:
When examining the `@opencode/tool/index.ts` file, the crawl4ai exports should have the same structure:
```typescript
// Crawl4AI web crawling and content extraction tools
export {
  crawl,              // Main web crawling function
  scrape,             // Single page content extraction
  map,                // Website URL discovery
  search,             // Web search with content extraction
  extract,            // Structured data extraction
  default as crawl4ai // Default export (crawl tool)
} from "./crawl4ai"
```

### Requirement: Backward Compatibility
The addition of crawl4ai exports MUST NOT break existing tool exports or functionality.

#### Scenario:
When existing code imports tools from `@opencode/tool`, all current imports should continue to work without modification:
```typescript
import { generate, validate } from "@opencode/tool" // Should continue to work
```

### Requirement: TypeScript Compilation
The updated `@opencode/tool/index.ts` MUST compile without TypeScript errors or warnings.

#### Scenario:
When running `bun run type-check` or `tsc --noEmit` on the tool directory, the compilation should succeed with no errors related to the new exports.

### Requirement: Default Export Convention
The crawl4ai tool MUST provide a default export following the established convention of defaulting to the primary tool function.

#### Scenario:
When importing the default export, it should resolve to the main crawl function:
```typescript
import crawl4ai from "@opencode/tool/crawl4ai"
// crawl4ai should be the crawl function
```

## MODIFIED Requirements

### Requirement: Tool Accessibility
The `@opencode/tool/index.ts` file MUST be updated to include all available tools in the ecosystem.

#### Scenario:
When listing available tools from `@opencode/tool`, the crawl4ai tool should be included alongside gemini and url-validator tools, providing comprehensive access to all OpenCode tooling capabilities.