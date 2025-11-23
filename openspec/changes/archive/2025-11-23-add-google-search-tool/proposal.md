# Add Google Search Tool

## Why
Users need real-time internet research capabilities to access current information, verify facts, and gather data from the web. The existing toolset lacks web search functionality, limiting agents to static knowledge.

## What Changes
- Add Python script for serper.dev API integration at `.opencode/tool/google_search.py`
- Add TypeScript tool definition at `.opencode/tool/search.ts` using `@opencode-ai/plugin/tool`
- Register tool in main `@opencode/tool/index.ts` for agent accessibility
- Use standard library (urllib/http.client) to avoid external Python dependencies
- Return clean JSON with top 5 organic results (title, link, snippet)

## Impact
- Affected specs: tooling (new search capability)
- Affected code: `.opencode/tool/` directory, main tool index
- New dependency: SERPER_API_KEY environment variable required
- Enables agents to perform real-time web research
