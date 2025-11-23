# Crawl4AI Tool - New Features Guide

## 🎉 What's New

The Crawl4AI tool now supports:

1. **Chrome Profile Authentication** - Access pages requiring login
2. **GUI Monitoring** - Watch the crawling process in real-time
3. **Verbose Logging** - Detailed progress tracking

## Quick Start

### Basic Usage

```bash
# Simple crawl (headless mode)
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run "use crawl4ai to crawl https://example.com"
```

### Chrome Profile for Authenticated Pages

**Step 1: Create a Chrome Profile**

```bash
# Find Playwright's Chromium
python -m playwright install --dry-run

# Launch with custom profile (macOS example)
~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium \
    --user-data-dir=$HOME/my-crawl-profile

# Log in to your accounts, then close the browser
```

**Step 2: Use the Profile**

```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://twitter.com/home with userDataDir=$HOME/my-crawl-profile"
```

### GUI Monitoring

Watch the browser in action:

```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://example.com with headless=false"
```

### Verbose Logging

See detailed progress:

```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://example.com with verbose=true"
```

### Combine All Features

```bash
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://linkedin.com/feed with userDataDir=$HOME/my-crawl-profile and headless=false and verbose=true"
```

## Feature Details

### 1. Chrome Profile Support (`userDataDir`)

**What it does:**
- Saves cookies, login sessions, and browser state
- Allows crawling authenticated pages
- Reuses login credentials across crawls

**When to use:**
- Pages requiring login (Twitter, LinkedIn, Facebook)
- Sites with paywalls
- Personalized content
- Session-based applications

**Example:**
```bash
# Create profile and log in to Twitter
~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium \
    --user-data-dir=$HOME/.twitter-profile

# Use profile for authenticated crawling
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://twitter.com/home with userDataDir=$HOME/.twitter-profile"
```

### 2. GUI Monitoring (`headless=false`)

**What it does:**
- Opens a visible browser window
- Shows real-time crawling progress
- Displays page interactions

**When to use:**
- Debugging crawling issues
- Watching authentication flows
- Understanding dynamic content loading
- Verifying page interactions

**Smart Default:**
- Automatically enabled when using a Chrome profile
- Can be explicitly set to `true` for headless mode with profile

**Example:**
```bash
# Debug a complex single-page application
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://complex-spa.com with headless=false and verbose=true"
```

### 3. Verbose Logging (`verbose=true`)

**What it does:**
- Shows detailed HTTP requests/responses
- Displays crawl progress
- Logs browser events
- Reports timing information

**When to use:**
- Troubleshooting failed crawls
- Performance optimization
- Understanding crawl behavior
- Debugging API calls

**Example:**
```bash
# See detailed crawl information
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://news.ycombinator.com with verbose=true"
```

## Common Use Cases

### Use Case 1: Scrape LinkedIn Feed

```bash
# Step 1: Create LinkedIn profile
~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium \
    --user-data-dir=$HOME/.linkedin-profile

# Log in to LinkedIn, then close browser

# Step 2: Crawl your feed
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://linkedin.com/feed with userDataDir=$HOME/.linkedin-profile"
```

### Use Case 2: Debug a Failing Crawl

```bash
# Enable all debugging features
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://problematic-site.com with headless=false and verbose=true"
```

### Use Case 3: Monitor Dynamic Content Loading

```bash
# Watch infinite scroll in action
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://infinite-scroll-site.com with headless=false"
```

### Use Case 4: Automated Authenticated Crawling

```bash
# Production crawl with saved authentication (headless)
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://twitter.com/home with userDataDir=$HOME/.twitter-profile and headless=true"
```

## Parameter Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | string | required | URL to crawl |
| `userDataDir` | string | optional | Path to Chrome profile directory |
| `headless` | boolean | smart | `true` (no profile) or `false` (with profile) |
| `verbose` | boolean | `false` | Enable detailed logging |

## Smart Defaults

The tool automatically adjusts settings based on your parameters:

```typescript
// No profile: headless by default
crawl("https://example.com")
// → headless=true

// With profile: GUI by default (for easier authentication)
crawl("https://example.com", { userDataDir: "/path/to/profile" })
// → headless=false

// Explicit override
crawl("https://example.com", { userDataDir: "/path/to/profile", headless: true })
// → headless=true (as specified)
```

## Troubleshooting

### Profile Conflicts

**Problem:** "Profile is in use" error

**Solution:** Close Chrome before using its profile:
```bash
# macOS
pkill -9 "Google Chrome"

# Linux
pkill -9 chrome

# Windows
taskkill /F /IM chrome.exe
```

### CAPTCHA Blocking

**Problem:** "Blocked by CAPTCHA" error

**Solution:** Use a Chrome profile with saved authentication:
```bash
# Create profile and log in manually
~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium \
    --user-data-dir=$HOME/.my-profile

# Use profile for crawling
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://google.com/search?q=test with userDataDir=$HOME/.my-profile"
```

### Server Not Running

**Problem:** "Server not running" error

**Solution:** Start the Crawl4AI server:
```bash
docker run -p 11235:11235 unclecode/crawl4ai:latest
```

## Best Practices

1. **Separate Profiles**: Create different profiles for different sites
   ```bash
   $HOME/.twitter-profile
   $HOME/.linkedin-profile
   $HOME/.facebook-profile
   ```

2. **Headless for Production**: Use `headless=true` for automated workflows
   ```bash
   # Production
   crawl(url, { userDataDir: profile, headless: true })
   ```

3. **GUI for Debugging**: Use `headless=false` when troubleshooting
   ```bash
   # Debugging
   crawl(url, { headless: false, verbose: true })
   ```

4. **Verbose for Troubleshooting**: Enable when you need details
   ```bash
   # See what's happening
   crawl(url, { verbose: true })
   ```

5. **Close Chrome**: Always close Chrome before using its profile
   ```bash
   pkill -9 "Google Chrome"
   ```

## Advanced Examples

### Example 1: Multi-Step Authentication

```bash
# Step 1: Create profile and log in with 2FA
~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium \
    --user-data-dir=$HOME/.secure-profile

# Complete 2FA, then close browser

# Step 2: Use authenticated session
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://secure-site.com/dashboard with userDataDir=$HOME/.secure-profile"
```

### Example 2: Performance Monitoring

```bash
# Monitor crawl performance with verbose logging
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://heavy-site.com with verbose=true" | grep -E "Request|Response|Time"
```

### Example 3: Visual Debugging

```bash
# Watch the crawl process step-by-step
OPENCODE_CONFIG_DIR=$PWD/opencode opencode run \
  "use crawl4ai to crawl https://complex-spa.com with headless=false and verbose=true"
```

## Documentation Links

- [Full README](./opencode/tool/crawl4ai/README.md)
- [Crawl4AI Official Docs](https://docs.crawl4ai.com/)
- [Identity-Based Crawling](https://docs.crawl4ai.com/advanced/identity-based-crawling/)
- [Browser Configuration](https://docs.crawl4ai.com/api/parameters/)

## Summary

The enhanced Crawl4AI tool now provides:

✅ **Chrome Profile Support** - Access authenticated pages
✅ **GUI Monitoring** - Watch crawls in real-time  
✅ **Verbose Logging** - Detailed progress tracking
✅ **Smart Defaults** - Automatic configuration based on usage
✅ **Comprehensive Documentation** - Complete guides and examples

Happy crawling! 🚀
