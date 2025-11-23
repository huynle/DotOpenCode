# Chrome Profile vs Cookie Files: Authentication Comparison

## TL;DR

**Use Chrome Profile** - It's easier, more secure, and automatically stays up-to-date.

## Detailed Comparison

| Feature | Chrome Profile | Cookie Files |
|---------|----------------|--------------|
| **Setup Complexity** | ✅ One-time (just specify profile name) | ❌ Export cookies for each site |
| **Cookie Updates** | ✅ Automatic (Chrome manages them) | ❌ Manual re-export when expired |
| **Security** | ✅ Stored in Chrome's secure storage | ⚠️ JSON files can be accidentally shared |
| **Multi-Site Auth** | ✅ All logged-in sites work instantly | ❌ Need separate file per site |
| **Maintenance** | ✅ Zero maintenance | ❌ Re-export when cookies expire |
| **Git Safety** | ✅ No files to accidentally commit | ⚠️ Easy to commit cookie files |
| **Session Persistence** | ✅ Stays logged in indefinitely | ❌ Cookies expire, need re-export |
| **Ease of Use** | ✅ Just set `use_chrome: true` | ❌ Export, save, reference file |

## Chrome Profile Approach (Recommended)

### Setup

1. **Find your Chrome profile:**
   ```bash
   # macOS
   ls ~/Library/Application\ Support/Google/Chrome/
   
   # Windows
   dir %LOCALAPPDATA%\Google\Chrome\User Data\
   
   # Linux
   ls ~/.config/google-chrome/
   ```

2. **Use in tool:**
   ```typescript
   {
     url: "https://linkedin.com/in/profile",
     use_chrome: true,
     chrome_profile: "Default"
   }
   ```

### Advantages

✅ **No Export Needed** - Just use your existing Chrome profile  
✅ **Always Current** - Chrome keeps cookies fresh automatically  
✅ **All Sites** - Every site you're logged into works immediately  
✅ **Secure** - Cookies stay in Chrome's encrypted storage  
✅ **Zero Maintenance** - Set it and forget it  

### Disadvantages

⚠️ **Chrome Must Be Closed** - Chrome locks the profile when running  
⚠️ **Profile-Specific** - Only works with Chrome (not Firefox, Safari, etc.)  

## Cookie File Approach (Legacy)

### Setup

1. **Install browser extension:**
   - Chrome: "EditThisCookie" or "Cookie-Editor"
   - Firefox: "Cookie-Editor"

2. **Export cookies:**
   - Visit the site you want to crawl
   - Click extension icon
   - Export as JSON
   - Save to `opencode/auth/sitename.json`

3. **Cookie file format:**
   ```json
   [
     {
       "name": "session_id",
       "value": "abc123...",
       "domain": ".example.com",
       "path": "/",
       "secure": true,
       "httpOnly": true
     }
   ]
   ```

4. **Use in tool:**
   ```typescript
   {
     url: "https://example.com/private",
     auth_file: "sitename.json"
   }
   ```

### Advantages

✅ **Browser Agnostic** - Works with any browser's cookies  
✅ **Portable** - Can share cookie files (if safe to do so)  
✅ **No Browser Lock** - Chrome can stay open  

### Disadvantages

❌ **Manual Export** - Need to export for each site  
❌ **Expires** - Must re-export when cookies expire  
❌ **Security Risk** - Cookie files can leak credentials  
❌ **Git Risk** - Easy to accidentally commit  
❌ **Maintenance** - Constant re-exporting needed  

## Real-World Examples

### Example 1: LinkedIn Profile Scraping

**Chrome Profile (Easy):**
```typescript
// One-time setup, works forever
{
  url: "https://linkedin.com/in/someprofile",
  use_chrome: true,
  chrome_profile: "Default"
}
```

**Cookie File (Tedious):**
```typescript
// Must re-export cookies every few weeks
{
  url: "https://linkedin.com/in/someprofile",
  auth_file: "linkedin_cookies.json"  // Expires often!
}
```

### Example 2: Multiple Authenticated Sites

**Chrome Profile (Instant):**
```typescript
// Works for ALL sites you're logged into
{
  url: "https://twitter.com/someuser",
  use_chrome: true
}

{
  url: "https://facebook.com/somepage",
  use_chrome: true
}

{
  url: "https://github.com/private-repo",
  use_chrome: true
}
```

**Cookie File (Painful):**
```typescript
// Need separate export for EACH site
{
  url: "https://twitter.com/someuser",
  auth_file: "twitter_cookies.json"
}

{
  url: "https://facebook.com/somepage",
  auth_file: "facebook_cookies.json"
}

{
  url: "https://github.com/private-repo",
  auth_file: "github_cookies.json"
}
```

## Migration Guide

### From Cookie Files to Chrome Profile

**Before (Cookie Files):**
```typescript
{
  url: "https://linkedin.com/in/profile",
  auth_file: "linkedin_cookies.json"
}
```

**After (Chrome Profile):**
```typescript
{
  url: "https://linkedin.com/in/profile",
  use_chrome: true,
  chrome_profile: "Default"
}
```

**Steps:**
1. Make sure you're logged into the site in Chrome
2. Find your Chrome profile name (usually "Default")
3. Replace `auth_file` with `use_chrome: true`
4. Add `chrome_profile: "Default"`
5. Delete old cookie JSON files

## When to Use Each Approach

### Use Chrome Profile When:
- ✅ You use Chrome as your main browser
- ✅ You want zero maintenance
- ✅ You're crawling multiple authenticated sites
- ✅ You want maximum security
- ✅ You can close Chrome during crawling

### Use Cookie Files When:
- ⚠️ You use a different browser (Firefox, Safari)
- ⚠️ You need to share authentication with others
- ⚠️ Chrome must stay open during crawling
- ⚠️ You need fine-grained control over cookies

## Security Considerations

### Chrome Profile Security
- ✅ Cookies encrypted by Chrome
- ✅ No files to accidentally commit to git
- ✅ Chrome's security features protect cookies
- ⚠️ Anyone with access to your computer can use your profile

### Cookie File Security
- ⚠️ Plain JSON files with credentials
- ⚠️ Easy to accidentally commit to git
- ⚠️ Can be copied and used by others
- ⚠️ No encryption unless you add it

## Best Practices

### Chrome Profile Best Practices
1. **Close Chrome First** - Avoid profile lock issues
2. **Use Default Profile** - Simplest and most reliable
3. **Test with headless: false** - See what's happening
4. **Keep Chrome Updated** - Latest security patches

### Cookie File Best Practices (If You Must)
1. **Add to .gitignore** - Never commit cookie files
2. **Use Environment Variables** - Store paths securely
3. **Rotate Regularly** - Re-export cookies often
4. **Encrypt Files** - Add encryption layer
5. **Delete After Use** - Don't leave cookie files around

## Troubleshooting

### Chrome Profile Issues

**"Chrome profile not found"**
```bash
# Find your profiles
ls ~/Library/Application\ Support/Google/Chrome/

# Use exact name
{
  "use_chrome": true,
  "chrome_profile": "Default"  # or "Profile 1", etc.
}
```

**"Profile is locked"**
- Close Chrome completely
- Wait a few seconds
- Try again

**"Not logged in"**
- Log into the site in Chrome first
- Use the correct profile (check Chrome → Settings → People)
- Try with `headless: false` to debug

### Cookie File Issues

**"Auth file not found"**
- Check file exists in `opencode/auth/`
- Verify filename matches exactly
- Check file permissions

**"Authentication failed"**
- Cookies may have expired
- Re-export cookies from browser
- Verify JSON format is correct

## Recommendation

**For 99% of use cases, use Chrome Profile.**

It's simpler, more secure, and requires zero maintenance. Only use cookie files if you have a specific reason (non-Chrome browser, need to share auth, etc.).

## Summary

| Aspect | Winner |
|--------|--------|
| Ease of Use | 🏆 Chrome Profile |
| Security | 🏆 Chrome Profile |
| Maintenance | 🏆 Chrome Profile |
| Multi-Site Support | 🏆 Chrome Profile |
| Browser Compatibility | 🏆 Cookie Files |
| Portability | 🏆 Cookie Files |

**Overall Winner: Chrome Profile** 🎉

Use Chrome Profile unless you have a specific reason not to.
