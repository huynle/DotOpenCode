# Chrome Profile Usage with Browser-Use Tool

## Overview

The browser-use tool now supports using your existing Chrome profiles, which means you can access sites where you're already logged in (Facebook, GitHub, LinkedIn, etc.) without needing to provide credentials each time.

## Quick Start

### Step 1: Find Your Chrome Profile

Run the helper script to find your Chrome profile location:

```bash
cd /Users/huy/projects/DotOpenCode/browser-use/opencode/tool/browser-use
./find-chrome-profile.sh
```

### Step 2: Close Chrome

**Important:** You must close all Chrome windows before using the profile with browser-use.

```bash
# On macOS, you can force quit Chrome:
killall "Google Chrome"
```

### Step 3: Use with OpenCode

Now you can use the browser-use tool with your Chrome profile to access authenticated sites!

## Example Usage

### Example 1: Check Website Title with Chrome Profile

```bash
opencode run "Use the execute tool to visit example.com and get the page title. Use chromeProfile='/Users/huy/Library/Application Support/Google/Chrome/Default' and headless=true" --agent tooling
```

### Example 2: Access Private GitHub Repository

```bash
opencode run "Use the extractData tool to extract repository information from https://github.com/your-private-repo. Use chromeProfile='/Users/huy/Library/Application Support/Google/Chrome/Default', dataDescription='repository stars, forks, and recent commits', and headless=true" --agent tooling
```

### Example 3: LinkedIn Profile Data

```bash
opencode run "Use the execute tool to go to my LinkedIn profile and extract my connections count and recent activity. Use chromeProfile='/Users/huy/Library/Application Support/Google/Chrome/Default' and headless=true" --agent tooling
```

## Using in Code

### TypeScript/JavaScript

```typescript
import { execute, extractData } from "@opencode/tool/browser-use";

// Example 1: Simple website access
const result = await execute({
  task: "Visit example.com and get the page title",
  chromeProfile: "/Users/huy/Library/Application Support/Google/Chrome/Default",
  headless: true
});

// Example 2: GitHub private repo
const githubResult = await extractData({
  url: "https://github.com/your-private-repo",
  dataDescription: "repository stars, forks, and recent commits",
  chromeProfile: "/Users/huy/Library/Application Support/Google/Chrome/Default",
  headless: true
});

// Example 3: LinkedIn
const linkedinResult = await execute({
  task: "Go to my LinkedIn profile and extract my connections count",
  chromeProfile: "/Users/huy/Library/Application Support/Google/Chrome/Default",
  headless: true
});
```

### Python (Direct Script Usage)

```bash
python3 browser-agent.py \
  --task "Visit example.com and get the page title" \
  --chrome-profile "/Users/huy/Library/Application Support/Google/Chrome/Default" \
  --headless
```

## Common Use Cases

### 1. Social Media Automation

**Facebook:**
- Check notifications
- Post status updates
- Extract friend lists
- Download photos

**LinkedIn:**
- View profile analytics
- Extract connections
- Send connection requests
- Post updates

**Twitter/X:**
- Read timeline
- Post tweets
- Check mentions
- Extract followers

### 2. Development Platforms

**GitHub:**
- Access private repositories
- Create issues
- Review pull requests
- Extract repository data

**GitLab:**
- Access private projects
- Manage CI/CD pipelines
- Review merge requests

### 3. Productivity Tools

**Gmail:**
- Read emails
- Send emails
- Manage labels
- Extract attachments

**Google Drive:**
- List files
- Download documents
- Upload files
- Share documents

**Notion:**
- Extract page content
- Create new pages
- Update databases

### 4. E-commerce

**Amazon:**
- Check order history
- Track packages
- Add to cart
- Compare prices

**eBay:**
- Monitor auctions
- Place bids
- Check messages

## Troubleshooting

### Problem: "Profile is in use"

**Error Message:**
```
Error: Profile is locked by another process
```

**Solution:**
1. Close all Chrome windows
2. On macOS: `killall "Google Chrome"`
3. Wait a few seconds
4. Try again

### Problem: "Permission denied"

**Error Message:**
```
Error: Permission denied accessing profile
```

**Solution:**
1. Check the profile path is correct
2. Ensure you have read permissions:
   ```bash
   ls -la "/Users/huy/Library/Application Support/Google/Chrome/Default"
   ```
3. If needed, fix permissions:
   ```bash
   chmod -R u+r "/Users/huy/Library/Application Support/Google/Chrome/Default"
   ```

### Problem: Not logged in after opening

**Possible Causes:**
1. Using wrong profile path
2. Cookies expired
3. Chrome was not fully closed

**Solution:**
1. Verify profile path with `./find-chrome-profile.sh`
2. Make sure Chrome is completely closed
3. Try logging in manually first, then close Chrome and retry

### Problem: Headless mode doesn't work

**Error:**
```
Browser opens but automation fails
```

**Solution:**
Set `headless: false` when using Chrome profile. Headless mode is not recommended with profiles.

## Security Best Practices

### 1. Create a Dedicated Automation Profile

Instead of using your main Chrome profile, create a separate one:

1. Open Chrome
2. Click profile icon → "Add"
3. Name it "Automation" or "Browser-Use"
4. Log into only the sites you want to automate
5. Use this profile path for automation

**Benefits:**
- Keeps your main profile secure
- Easier to manage automation credentials
- Can be reset without affecting your main profile

### 2. Use Environment Variables

Store the profile path in an environment variable:

```bash
# Add to .env
CHROME_PROFILE_PATH="/Users/huy/Library/Application Support/Google/Chrome/Profile 1"
```

Then use it in code:
```typescript
const chromeProfile = process.env.CHROME_PROFILE_PATH;
```

### 3. Limit Automation Scope

Only log into sites you actually need to automate. Don't use a profile with:
- Banking credentials
- Payment information
- Sensitive personal data

Unless absolutely necessary for your automation task.

### 4. Monitor Automation Activity

- Review browser history after automation
- Check for unexpected logins or actions
- Use Chrome's "Recent activity" to monitor sessions

## Advanced Configuration

### Using Multiple Profiles

```typescript
// Work profile
const workResult = await execute({
  task: "Check work email",
  chromeProfile: "/Users/huy/Library/Application Support/Google/Chrome/Profile 1",
  headless: true
});

// Personal profile
const personalResult = await execute({
  task: "Check personal Facebook",
  chromeProfile: "/Users/huy/Library/Application Support/Google/Chrome/Default",
  headless: true
});
```

### Profile with Specific Extensions

If your Chrome profile has extensions, they will be loaded automatically. This can be useful for:
- Ad blockers
- Password managers
- Developer tools

### Debugging

To see what's happening, use `headless: false` during development:

```typescript
const result = await execute({
  task: "Your task here",
  chromeProfile: "/Users/huy/Library/Application Support/Google/Chrome/Default",
  headless: false,  // Watch the browser in action
  maxSteps: 50,     // Limit steps for debugging
  timeout: 120      // Shorter timeout for quick iterations
});
```

## Platform-Specific Notes

### macOS
- Profile path: `~/Library/Application Support/Google/Chrome/Default`
- Close Chrome: `killall "Google Chrome"`
- Permissions: Usually no issues

### Linux
- Profile path: `~/.config/google-chrome/Default`
- Close Chrome: `killall chrome`
- Permissions: May need to check file permissions

### Windows
- Profile path: `%LOCALAPPDATA%\Google\Chrome\User Data\Default`
- Close Chrome: Task Manager → End Chrome processes
- Permissions: Run as administrator if needed

## FAQ

**Q: Can I use the profile while Chrome is open?**
A: No, Chrome locks the profile when in use. You must close Chrome first.

**Q: Will this work with Chromium or other Chrome-based browsers?**
A: Yes, but you'll need to find the correct profile path for that browser.

**Q: Can I use incognito mode with a profile?**
A: No, incognito mode doesn't use profile data.

**Q: What if I have multiple Chrome profiles?**
A: Use the `find-chrome-profile.sh` script to list all profiles and choose the one you want.

**Q: Is it safe to use my main Chrome profile?**
A: It's safer to create a dedicated automation profile. See "Security Best Practices" above.

**Q: Can I run multiple automations with the same profile?**
A: No, only one process can use a profile at a time.

## Next Steps

1. Run `./find-chrome-profile.sh` to find your profile
2. Close Chrome completely
3. Try the examples above
4. Create a dedicated automation profile for production use
5. Explore the use cases that matter to you

Happy automating! 🚀