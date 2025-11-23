# Google Search Tool

Real-time internet research tool using serper.dev API for OpenCode agents.

## Overview

The Google Search tool enables OpenCode agents to perform real-time web searches and retrieve current information from the internet. It returns the top 5 organic search results with title, link, and snippet for each result.

## Features

- **Real-time Search**: Access current web information
- **Clean Results**: Returns only title, link, and snippet (no ads or clutter)
- **No Dependencies**: Uses Python standard library (urllib)
- **Error Handling**: Graceful error messages for common issues
- **Simple Integration**: Works seamlessly with OpenCode agents

## Setup

### 1. Get API Key

Sign up for a free API key at [serper.dev](https://serper.dev):
- Free tier: 2,500 searches/month
- No credit card required for free tier

### 2. Set Environment Variable

Add your API key to your environment:

```bash
# Add to ~/.bashrc, ~/.zshrc, or ~/.profile
export SERPER_API_KEY="your-api-key-here"

# Or add to .env file in project root
echo "SERPER_API_KEY=your-api-key-here" >> .env
```

### 3. Verify Setup

Test the tool:

```bash
opencode run "Search for 'latest AI developments'" --agent general
```

## Usage

### From OpenCode CLI

```bash
# Basic search
opencode run "Search for 'latest AI developments'" --agent general

# Research query
opencode run "Find information about TypeScript best practices" --agent general

# Fact checking
opencode run "What are current statistics on renewable energy?" --agent general
```

### From Agent Prompts

Agents can use the search tool automatically:

```
User: What are the latest features in Bun 1.0?
Agent: Let me search for that information...
[Uses search tool with query "Bun 1.0 latest features"]
```

## Response Format

### Success Response

```json
[
  {
    "title": "Page Title",
    "link": "https://example.com/page",
    "snippet": "Brief description of page content..."
  },
  {
    "title": "Another Result",
    "link": "https://another-example.com",
    "snippet": "More information about the topic..."
  }
]
```

### Error Response

```json
{
  "error": "Error description",
  "details": "Additional error information",
  "hint": "Suggestion for fixing the issue"
}
```

## Common Errors

### Missing API Key

**Error:**
```json
{
  "error": "SERPER_API_KEY environment variable not set. Get your API key from https://serper.dev"
}
```

**Solution:**
```bash
export SERPER_API_KEY="your-api-key-here"
```

### Network Error

**Error:**
```json
{
  "error": "Network Error: [Errno 8] nodename nor servname provided, or not known",
  "details": "Check your internet connection"
}
```

**Solution:** Verify internet connection and firewall settings.

### API Quota Exceeded

**Error:**
```json
{
  "error": "HTTP Error 429: Too Many Requests",
  "details": "Check your SERPER_API_KEY or API quota"
}
```

**Solution:** Wait for quota reset or upgrade your serper.dev plan.

## Architecture

### Components

1. **index.py**: Python script that handles API communication
   - Uses urllib (standard library, no dependencies)
   - Accepts query as command-line argument
   - Returns JSON to stdout

2. **index.ts**: TypeScript tool definition
   - Uses `@opencode-ai/plugin/tool` helper
   - Executes Python script via Bun.$
   - Returns string result to agents

3. **index.ts** (main): Tool registration
   - Exports search tool for agent access
   - Registered as `google_search` tool

### Data Flow

```
Agent Request
    ↓
google_search.execute({ query: "..." })
    ↓
Bun.$ executes index.py
    ↓
Python script calls serper.dev API
    ↓
API returns search results
    ↓
Python formats and outputs JSON
    ↓
TypeScript returns string to agent
    ↓
Agent processes results
```

## Testing

### Manual Testing

```bash
# Test with OpenCode CLI
opencode run "Search for 'OpenCode AI'" --agent general
```

### Automated Testing

```bash
# Run all tests
cd opencode/tests/tools/google-search
bun test
```

## Limitations

- **Rate Limits**: Free tier limited to 2,500 searches/month
- **Result Count**: Returns only top 5 organic results
- **No Pagination**: Cannot retrieve results beyond top 5
- **API Dependency**: Requires active internet connection and serper.dev availability
- **Python Requirement**: Requires Python 3 to be installed

## Best Practices

1. **Cache Results**: For repeated queries, consider caching results
2. **Specific Queries**: Use specific search terms for better results
3. **Error Handling**: Always check for error responses
4. **Rate Limiting**: Be mindful of API quota limits
5. **Query Validation**: Validate queries before sending to API

## Troubleshooting

### Tool Not Found

**Issue:** Agent reports "unavailable tool 'google_search'"

**Solution:**
1. Verify tool is exported in `opencode/tool/index.ts`
2. Restart OpenCode CLI
3. Check tool registration: `opencode run "What tools do you have?" --agent general`

### Python Not Found

**Issue:** "python3: command not found"

**Solution:**
```bash
# macOS
brew install python3

# Ubuntu/Debian
sudo apt-get install python3

# Verify installation
python3 --version
```

## Future Enhancements

- [ ] Support for pagination (more than 5 results)
- [ ] Image search capability
- [ ] News search filtering
- [ ] Date range filtering
- [ ] Result caching
- [ ] Custom result count parameter
- [ ] Support for other search engines

## References

- [serper.dev Documentation](https://serper.dev/docs)
- [OpenCode Custom Tools Guide](https://opencode.ai/docs/custom-tools/)
- [Python urllib Documentation](https://docs.python.org/3/library/urllib.html)
- [Bun Shell Documentation](https://bun.sh/docs/runtime/shell)

## License

Part of the OpenCode project. See main project LICENSE for details.