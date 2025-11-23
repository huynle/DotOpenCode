# Browser-Use Tool for OpenCode

Enables LLM agents to automate web UI tasks using the [browser-use](https://github.com/browser-use/browser-use) Python library.

## Features

- **Task Automation**: Execute complex browser automation tasks using natural language
- **Data Extraction**: Scrape and extract structured data from websites
- **Form Filling**: Automatically fill out web forms with provided data
- **Screenshots**: Capture screenshots of pages or specific elements
- **Web Search**: Perform searches and extract results from search engines
- **Navigation**: Navigate websites and extract content
- **Cloud Support**: Optional Browser Use Cloud for stealth browsing and CAPTCHA avoidance
- **Chrome Profile Support**: Use your existing Chrome profiles with saved credentials for authenticated sites

## Installation

### 1. Install Python Dependencies

```bash
pip install browser-use
uvx browser-use install
```

### 2. Get API Key

Get your free API key from [Browser Use Cloud](https://cloud.browser-use.com/new-api-key) (new signups get $10 free credits).

### 3. Set Environment Variable

Add to your `.env` file:

```bash
BROWSER_USE_API_KEY=your-api-key-here
```

## Available Tools

### `browserUse_execute`

Execute a browser automation task using natural language.

**Parameters:**
- `task` (string, required): Natural language description of the task
- `url` (string, optional): Starting URL
- `useCloud` (boolean, optional): Use Browser Use Cloud for stealth browsing
- `maxSteps` (number, optional): Maximum steps (default: 100)
- `timeout` (number, optional): Timeout in seconds (default: 300)
- `chromeProfile` (string, optional): Path to Chrome user data directory for using saved credentials
- `headless` (boolean, optional): Run browser in headless mode (default: false when using profile)

**Example:**
```typescript
const result = await browserUse_execute({
  task: "Find the top post on Hacker News and extract its title and URL",
  useCloud: true
});
```

**Example with Chrome Profile:**
```typescript
const result = await browserUse_execute({
  task: "Go to Facebook and check my notifications",
  chromeProfile: "/Users/yourname/Library/Application Support/Google/Chrome/Default",
  headless: false
});
```

### `browserUse_extractData`

Extract specific data from a webpage.

**Parameters:**
- `url` (string, required): URL to extract data from
- `dataDescription` (string, required): Description of what data to extract
- `useCloud` (boolean, optional): Use Browser Use Cloud
- `chromeProfile` (string, optional): Path to Chrome user data directory for using saved credentials
- `headless` (boolean, optional): Run browser in headless mode

**Example:**
```typescript
const result = await browserUse_extractData({
  url: "https://news.ycombinator.com",
  dataDescription: "all article titles and their scores"
});
```

**Example with Chrome Profile:**
```typescript
const result = await browserUse_extractData({
  url: "https://github.com/your-private-repo",
  dataDescription: "repository stars, forks, and recent commits",
  chromeProfile: "/Users/yourname/Library/Application Support/Google/Chrome/Default",
  headless: false
});
```

### `browserUse_fillForm`

Fill out a web form with provided data.

**Parameters:**
- `url` (string, required): URL of the form
- `formData` (string, required): JSON string with form field names and values
- `submitForm` (boolean, optional): Whether to submit the form (default: false)
- `useCloud` (boolean, optional): Use Browser Use Cloud
- `chromeProfile` (string, optional): Path to Chrome user data directory for using saved credentials
- `headless` (boolean, optional): Run browser in headless mode

**Example:**
```typescript
const result = await browserUse_fillForm({
  url: "https://example.com/contact",
  formData: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello!"
  }),
  submitForm: false
});
```

**Example with Chrome Profile:**
```typescript
const result = await browserUse_fillForm({
  url: "https://linkedin.com/profile/edit",
  formData: JSON.stringify({
    experience: "Software Engineer at Company",
    education: "BS Computer Science"
  }),
  submitForm: true,
  chromeProfile: "/Users/yourname/Library/Application Support/Google/Chrome/Default",
  headless: false
});
```

### `browserUse_screenshot`

Take a screenshot of a webpage or specific element.

**Parameters:**
- `url` (string, required): URL to screenshot
- `selector` (string, optional): CSS selector for specific element
- `useCloud` (boolean, optional): Use Browser Use Cloud
- `chromeProfile` (string, optional): Path to Chrome user data directory for using saved credentials
- `headless` (boolean, optional): Run browser in headless mode

**Example:**
```typescript
const result = await browserUse_screenshot({
  url: "https://example.com",
  selector: ".main-content"
});
```

**Example with Chrome Profile:**
```typescript
const result = await browserUse_screenshot({
  url: "https://facebook.com",
  selector: "[data-pagelet='ProfileTilesFeed_0']",
  chromeProfile: "/Users/yourname/Library/Application Support/Google/Chrome/Default",
  headless: false
});
```

### `browserUse_navigate`

Navigate to a URL and extract page content.

**Parameters:**
- `url` (string, required): URL to navigate to
- `extractContent` (string, optional): What content to extract (default: "page title and main content")
- `useCloud` (boolean, optional): Use Browser Use Cloud
- `chromeProfile` (string, optional): Path to Chrome user data directory for using saved credentials
- `headless` (boolean, optional): Run browser in headless mode

**Example:**
```typescript
const result = await browserUse_navigate({
  url: "https://example.com/article",
  extractContent: "article title, author, and publication date"
});
```

**Example with Chrome Profile:**
```typescript
const result = await browserUse_navigate({
  url: "https://linkedin.com/in/yourprofile",
  extractContent: "profile summary, experience, and skills",
  chromeProfile: "/Users/yourname/Library/Application Support/Google/Chrome/Default",
  headless: false
});
```

### `browserUse_browserSearch`

Perform a web search and extract results.

**Parameters:**
- `searchEngine` (string, required): Search engine to use (e.g., "google", "bing", "duckduckgo")
- `query` (string, required): Search query
- `numResults` (number, optional): Number of results to extract (default: 5)
- `useCloud` (boolean, optional): Use Browser Use Cloud
- `chromeProfile` (string, optional): Path to Chrome user data directory for using saved credentials
- `headless` (boolean, optional): Run browser in headless mode

**Example:**
```typescript
const result = await browserUse_browserSearch({
  searchEngine: "google",
  query: "browser automation with AI",
  numResults: 10
});
```

**Example with Chrome Profile:**
```typescript
const result = await browserUse_browserSearch({
  searchEngine: "google",
  query: "my private documents site:docs.google.com",
  numResults: 5,
  chromeProfile: "/Users/yourname/Library/Application Support/Google/Chrome/Default",
  headless: false
});
```

## Use Cases

### Job Application Automation
```typescript
await browserUse_execute({
  task: "Fill in this job application with my resume and information from resume.pdf",
  url: "https://company.com/careers/apply",
  useCloud: true
});
```

### Grocery Shopping
```typescript
await browserUse_execute({
  task: "Add these items to my Instacart cart: milk, eggs, bread, cheese",
  url: "https://instacart.com",
  useCloud: true
});
```

### Data Collection
```typescript
await browserUse_extractData({
  url: "https://example.com/products",
  dataDescription: "all product names, prices, and availability status",
  useCloud: true
});
```

### Form Automation
```typescript
await browserUse_fillForm({
  url: "https://example.com/survey",
  formData: JSON.stringify({
    rating: "5",
    feedback: "Great service!",
    recommend: "yes"
  }),
  submitForm: true,
  useCloud: true
});
```

### Social Media Automation (with Chrome Profile)
```typescript
await browserUse_execute({
  task: "Post 'Good morning!' on my Facebook timeline",
  chromeProfile: "/Users/yourname/Library/Application Support/Google/Chrome/Default",
  headless: false
});
```

### Private Repository Data Extraction (with Chrome Profile)
```typescript
await browserUse_extractData({
  url: "https://github.com/your-private-repo",
  dataDescription: "repository stars, forks, and recent commits",
  chromeProfile: "/Users/yourname/Library/Application Support/Google/Chrome/Default",
  headless: false
});
```

### LinkedIn Profile Management (with Chrome Profile)
```typescript
await browserUse_execute({
  task: "Update my LinkedIn profile with my latest job experience",
  chromeProfile: "/Users/yourname/Library/Application Support/Google/Chrome/Default",
  headless: false
});
```

## Browser Use Cloud

For production use cases, enable `useCloud: true` to get:

- **Stealth Browsing**: Advanced fingerprinting to avoid detection
- **CAPTCHA Avoidance**: Better success rate with CAPTCHA challenges
- **Scalability**: Handle many agents in parallel
- **Memory Management**: Optimized resource usage
- **Proxy Rotation**: Built-in proxy support

## Troubleshooting

### "browser-use package not installed"

Install the package:
```bash
pip install browser-use
uvx browser-use install
```

### "BROWSER_USE_API_KEY environment variable not set"

Get your API key from [Browser Use Cloud](https://cloud.browser-use.com/new-api-key) and add it to your `.env` file.

### Task Timeout

Increase the timeout parameter:
```typescript
await browserUse_execute({
  task: "Complex multi-step task",
  timeout: 600  // 10 minutes
});
```

### Authentication Required

For tasks requiring authentication, you have two options:

1. **Use Browser Use Cloud with profile sync:**
```bash
curl -fsSL https://browser-use.com/profile.sh | BROWSER_USE_API_KEY=your-key sh
```

2. **Use your local Chrome profile:**
```bash
# First, find your Chrome profile
./find-chrome-profile.sh

# Then use it in your automation
await browserUse_execute({
  task: "Access my authenticated site",
  chromeProfile: "/path/to/your/chrome/profile",
  headless: false
});
```

### "Profile is in use" Error

This happens when Chrome is still running with that profile. Close all Chrome windows and try again.

### Chrome Profile Not Working

1. Make sure Chrome is completely closed
2. Verify the profile path is correct
3. Set `headless: false` when using Chrome profiles
4. Check that the profile directory contains `Preferences` and `Cookies` files

## Advanced Configuration

### Custom Max Steps

Control how many actions the agent can take:
```typescript
await browserUse_execute({
  task: "Navigate through multiple pages",
  maxSteps: 200  // Allow more steps for complex tasks
});
```

### Local vs Cloud vs Chrome Profile Browsers

```typescript
// Local browser (default) - No authentication
await browserUse_execute({
  task: "Simple task",
  useCloud: false
});

// Cloud browser (recommended for production) - Cloud authentication
await browserUse_execute({
  task: "Complex task with authentication",
  useCloud: true
});

// Chrome profile browser - Local authentication with saved credentials
await browserUse_execute({
  task: "Access my authenticated sites",
  chromeProfile: "/Users/yourname/Library/Application Support/Google/Chrome/Default",
  headless: false
});
```

### Combining Parameters

You can combine multiple parameters for complex scenarios:

```typescript
await browserUse_extractData({
  url: "https://github.com/your-private-repo",
  dataDescription: "repository information and recent activity",
  useCloud: false,  // Use local browser
  chromeProfile: "/Users/yourname/Library/Application Support/Google/Chrome/Default",
  headless: false,  // Show browser window
  maxSteps: 150,    // Allow more steps
  timeout: 600      // 10 minute timeout
});
```

## Resources

- [Browser-Use Documentation](https://docs.browser-use.com)
- [Browser-Use GitHub](https://github.com/browser-use/browser-use)
- [Browser Use Cloud](https://cloud.browser-use.com)
- [Example Use Cases](https://docs.browser-use.com/examples)

## License

This tool wraps the browser-use library which is licensed under MIT.

## 🔐 Using Chrome Profile for Authenticated Sites

The browser-use tool now supports using your existing Chrome profile, which means you can:
- Access sites where you're already logged in (Facebook, GitHub, LinkedIn, etc.)
- Use saved passwords and cookies
- Maintain your browsing history and preferences
- Avoid repeated logins
- Work locally without requiring a Browser Use Cloud API key

**Note:** When using Chrome profiles, the tool can work in local mode without requiring an API key, making it perfect for accessing your personal authenticated sites.

### Finding Your Chrome Profile

Run the helper script to find your Chrome profile location:

```bash
./find-chrome-profile.sh
```

**Common Chrome Profile Locations:**
- **macOS**: `~/Library/Application Support/Google/Chrome/Default`
- **Linux**: `~/.config/google-chrome/Default`
- **Windows**: `%LOCALAPPDATA%\Google\Chrome\User Data\Default`

### Using Chrome Profile with OpenCode

**Example 1: Check Facebook Notifications**
```typescript
Use the execute tool with:
- task: "Go to Facebook and check my notifications"
- chromeProfile: "/Users/huy/Library/Application Support/Google/Chrome/Default"
- headless: false
```

**Example 2: Extract GitHub Repository Data**
```typescript
Use the extractData tool with:
- url: "https://github.com/your-private-repo"
- dataDescription: "repository stars, forks, and recent commits"
- chromeProfile: "/Users/huy/Library/Application Support/Google/Chrome/Default"
- headless: false
```

**Example 3: LinkedIn Profile Scraping**
```typescript
Use the execute tool with:
- task: "Go to my LinkedIn profile and extract my connections count"
- chromeProfile: "/Users/huy/Library/Application Support/Google/Chrome/Default"
- headless: false
```

### Important Notes

⚠️ **Before Using Chrome Profile:**
1. **Close Chrome completely** - You cannot use a profile that's currently in use
2. **Set headless=false** - Headless mode may not work well with profiles
3. **Security** - Only use your profile with trusted automation tasks
4. **Profile Lock** - Chrome locks the profile when in use

### Parameters

All browser-use tools now support these additional parameters:

- **`chromeProfile`** (optional): Path to Chrome user data directory
  - Enables using saved credentials and cookies
  - Must be the full path to the profile directory
  - Example: `"/Users/huy/Library/Application Support/Google/Chrome/Default"`

- **`headless`** (optional, default: false): Run browser in headless mode
  - Set to `false` when using Chrome profile (recommended)
  - Set to `true` for background automation without GUI

### Troubleshooting

**Problem: "Profile is in use" error**
- **Solution**: Close all Chrome windows and try again

**Problem: "Permission denied" error**
- **Solution**: Check that the profile path is correct and readable

**Problem: Browser opens but not logged in**
- **Solution**: 
  1. Verify you're using the correct profile path
  2. Make sure Chrome is completely closed
  3. Check that cookies are not expired

**Problem: Headless mode doesn't work with profile**
- **Solution**: Set `headless: false` when using Chrome profile

### Security Considerations

🔒 **Best Practices:**
- Only use your Chrome profile for automation you trust
- Be aware that the automation has access to all your logged-in sessions
- Consider creating a separate Chrome profile for automation
- Don't share your profile path in public code or logs

### Creating a Dedicated Automation Profile

For better security, create a separate Chrome profile for automation:

1. Open Chrome
2. Click your profile icon → "Add"
3. Create a new profile (e.g., "Automation")
4. Log into the sites you want to automate
5. Find the new profile path (usually `~/Library/Application Support/Google/Chrome/Profile 1`)
6. Use this profile path for automation

This way, your main profile remains separate from automation tasks.

