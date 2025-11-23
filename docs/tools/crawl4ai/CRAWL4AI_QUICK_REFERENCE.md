# Crawl4AI Tool - Quick Reference Card

## 🚀 Quick Commands

### Basic Crawl
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://example.com"
```

### With Chrome Profile (Authenticated)
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://twitter.com with userDataDir=$HOME/.twitter-profile"
```

### With GUI Monitoring
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://example.com with headless=false"
```

### With Verbose Logging
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://example.com with verbose=true"
```

### All Features Combined
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://linkedin.com/feed with userDataDir=$HOME/.linkedin-profile and headless=false and verbose=true"
```

## 📋 Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | string | **required** | URL to crawl |
| `userDataDir` | string | optional | Chrome profile path |
| `headless` | boolean | smart* | Run in background |
| `verbose` | boolean | false | Detailed logging |

*Smart default: `false` with profile, `true` without

## 🔧 Setup Chrome Profile

```bash
# 1. Find Playwright Chromium
python -m playwright install --dry-run

# 2. Launch with profile (macOS)
~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium \
    --user-data-dir=$HOME/my-profile

# 3. Log in to sites, then close browser

# 4. Use profile
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://site.com with userDataDir=$HOME/my-profile"
```

## 🎯 Common Use Cases

### LinkedIn Feed
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://linkedin.com/feed with userDataDir=$HOME/.linkedin-profile"
```

### Debug Complex Site
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://complex-spa.com with headless=false and verbose=true"
```

### Production Automation
```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://twitter.com/home with userDataDir=$HOME/.twitter-profile and headless=true"
```

## 🛠️ Troubleshooting

### Server Not Running
```bash
docker run -p 11235:11235 unclecode/crawl4ai:latest
```

### Profile In Use
```bash
# Close Chrome first
pkill -9 "Google Chrome"
```

### CAPTCHA Blocking
Use Chrome profile with saved authentication

## 📚 Documentation

- [Full README](./opencode/tool/crawl4ai/README.md)
- [Features Guide](./CRAWL4AI_FEATURES.md)
- [Update Summary](./CRAWL4AI_UPDATE_SUMMARY.md)
- [Crawl4AI Docs](https://docs.crawl4ai.com/)

## ✨ Features

✅ Chrome Profile Support
✅ GUI Monitoring  
✅ Verbose Logging
✅ Smart Defaults
✅ Comprehensive Documentation
