# Crawl4AI Tool - Quick Start Guide

## ✅ Tool is Now Fixed and Ready!

The crawl4ai tool has been completely rebuilt to follow the correct OpenCode pattern.

## 🎯 Your Use Case: Search Google

To get the top 2 results from Google for "funny dog":

```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run "Use crawl4ai to get the top 2 results from google.com for 'funny dog'"
```

## 🛠️ Available Tools

| Tool Name | Use For |
|-----------|---------|
| `crawl4ai` | Basic web crawling (default) |
| `crawl4ai_crawl` | Same as default |
| `crawl4ai_deepCrawlTool` | Multi-page crawling with strategies |
| `crawl4ai_download` | Download files from websites |
| `crawl4ai_analyze` | Extract structured data and metadata |

## 📝 Common Commands

### Basic Crawling
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run "Use crawl4ai to fetch https://example.com"
```

### Search Results
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run "Use crawl4ai to search google.com for 'funny dog' and return top 2 results"
```

### Deep Crawling
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run "Use crawl4ai_deepCrawlTool to crawl https://example.com with depth 2 and max 10 pages"
```

### Content Analysis
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run "Use crawl4ai_analyze to extract all links and images from https://example.com"
```

### Download Files
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run "Use crawl4ai_download to download all PDF files from https://example.com"
```

## 🔍 Verify Tool is Working

```bash
# Check if tool is discovered
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run "What crawl4ai tools do you have?" --agent general
```

Expected output should list:
- `crawl4ai`
- `crawl4ai_crawl`
- `crawl4ai_deepCrawlTool`
- `crawl4ai_download`
- `crawl4ai_analyze`

## 📂 File Structure (Correct)

```
opencode/tool/
└── crawl4ai.ts          ✅ Tool at root level (41KB)
```

## 🐛 What Was Fixed

1. **File Location**: Moved from `crawl4ai/index.ts` to `crawl4ai.ts` at root
2. **Removed**: node_modules, backup files, config files from subdirectory
3. **Removed**: Main index.ts that was re-exporting (not OpenCode pattern)
4. **Result**: Proper tool naming (`crawl4ai` instead of `index_crawl4ai`)

## 📚 Documentation

- Full rebuild details: `CRAWL4AI_REBUILD_SUMMARY.md`
- Previous fixes: `CRAWL4AI_FIX_SUMMARY.md` and `CRAWL4AI_VALIDATION_COMPLETE.md`
- OpenCode docs: https://opencode.ai/docs/custom-tools/

## ✨ Ready to Use!

Your crawl4ai tool is now properly configured and should work for all use cases, including searching Google for "funny dog" results! 🐕
