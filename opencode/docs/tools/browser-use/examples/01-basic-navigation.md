# Example 1: Basic Web Navigation

Learn how to navigate websites and extract content using the browser-use tool.

## Scenario

You want to visit a website and extract specific information from it.

## Using the `navigate` Tool

### Simple Page Title Extraction

**Task:** Get the page title from a website

**Command:**
```
Use navigate to visit https://example.com and extract the page title
```

**Code:**
```typescript
const result = await navigate({
  url: "https://example.com",
  extractContent: "page title"
});
```

**Output:**
```json
{
  "success": true,
  "content": {
    "title": "Example Domain"
  }
}
```

---

### Extract Multiple Elements

**Task:** Get title, description, and main content

**Command:**
```
Use navigate to visit https://example.com/article and extract the page title, meta description, and main article content
```

**Code:**
```typescript
const result = await navigate({
  url: "https://example.com/article",
  extractContent: "page title, meta description, and main article content"
});
```

**Output:**
```json
{
  "success": true,
  "content": {
    "title": "Understanding Browser Automation",
    "description": "A comprehensive guide to automating browsers with AI",
    "mainContent": "Browser automation has revolutionized how we interact with the web..."
  }
}
```

---

### Extract Structured Data

**Task:** Get all links from a page

**Command:**
```
Use navigate to visit https://example.com and extract all links with their text and URLs
```

**Code:**
```typescript
const result = await navigate({
  url: "https://example.com",
  extractContent: "all links with their text and URLs in a structured format"
});
```

**Output:**
```json
{
  "success": true,
  "content": {
    "links": [
      {
        "text": "More information",
        "url": "https://www.iana.org/domains/example"
      },
      {
        "text": "Contact Us",
        "url": "https://example.com/contact"
      }
    ]
  }
}
```

---

## Using the `execute` Tool for Complex Navigation

### Multi-Step Navigation

**Task:** Navigate through multiple pages

**Command:**
```
Use execute to visit https://news.ycombinator.com, find the top post, click on it, and extract the article content
```

**Code:**
```typescript
const result = await execute({
  task: "Visit Hacker News, find the top post, click on it, and extract the article title and content",
  url: "https://news.ycombinator.com",
  maxSteps: 50
});
```

**Output:**
```json
{
  "success": true,
  "result": {
    "topPost": {
      "title": "Show HN: Browser-Use - AI Browser Automation",
      "url": "https://github.com/browser-use/browser-use",
      "score": 342,
      "comments": 87
    },
    "articleContent": "Browser-Use is a Python library that makes websites accessible for AI agents..."
  }
}
```

---

### Conditional Navigation

**Task:** Navigate based on page content

**Command:**
```
Use execute to visit https://example.com, check if there's a "Login" button, and if so, click it and extract the login form fields
```

**Code:**
```typescript
const result = await execute({
  task: "Visit the homepage, look for a Login button, click it if present, and list all form fields on the login page",
  url: "https://example.com",
  maxSteps: 30
});
```

**Output:**
```json
{
  "success": true,
  "result": {
    "loginButtonFound": true,
    "loginPageUrl": "https://example.com/login",
    "formFields": [
      {
        "name": "username",
        "type": "text",
        "required": true
      },
      {
        "name": "password",
        "type": "password",
        "required": true
      },
      {
        "name": "remember",
        "type": "checkbox",
        "required": false
      }
    ]
  }
}
```

---

## Best Practices

### 1. Be Specific with Content Extraction

❌ **Too Vague:**
```
Use navigate to visit https://example.com and extract content
```

✅ **Specific:**
```
Use navigate to visit https://example.com and extract the page title, main heading, and first paragraph
```

### 2. Use Appropriate Timeouts

```typescript
// Simple page - short timeout
await navigate({
  url: "https://example.com",
  extractContent: "page title",
  timeout: 30
});

// Complex page - longer timeout
await navigate({
  url: "https://heavy-js-site.com",
  extractContent: "all product data",
  timeout: 120
});
```

### 3. Choose the Right Tool

- **Use `navigate`** for simple content extraction from a single page
- **Use `execute`** for multi-step workflows or conditional logic

### 4. Handle Errors

```typescript
const result = await navigate({
  url: "https://example.com",
  extractContent: "page title"
});

const data = JSON.parse(result);

if (!data.success) {
  console.error("Navigation failed:", data.error);
  // Implement fallback or retry logic
}
```

---

## Common Use Cases

### 1. News Aggregation

Extract headlines from news sites:

```typescript
const result = await navigate({
  url: "https://news.ycombinator.com",
  extractContent: "top 10 post titles, scores, and URLs"
});
```

### 2. Documentation Reading

Extract documentation content:

```typescript
const result = await navigate({
  url: "https://docs.example.com/api",
  extractContent: "API endpoint descriptions, parameters, and examples"
});
```

### 3. Product Information

Get product details:

```typescript
const result = await navigate({
  url: "https://example.com/product/123",
  extractContent: "product name, price, description, and availability"
});
```

### 4. Contact Information

Extract contact details:

```typescript
const result = await navigate({
  url: "https://example.com/contact",
  extractContent: "email address, phone number, and physical address"
});
```

---

## Troubleshooting

### Issue: Timeout Errors

**Problem:** Task times out before completion

**Solution:**
```typescript
// Increase timeout
await navigate({
  url: "https://slow-site.com",
  extractContent: "content",
  timeout: 180  // 3 minutes
});
```

### Issue: Content Not Found

**Problem:** Requested content not extracted

**Solution:**
- Be more specific in your extraction request
- Check if content requires JavaScript to load
- Try using `execute` for dynamic content

### Issue: Invalid URL

**Problem:** URL format error

**Solution:**
```typescript
// Ensure URL includes protocol
await navigate({
  url: "https://example.com",  // ✅ Correct
  // url: "example.com",       // ❌ Wrong
  extractContent: "content"
});
```

---

## Next Steps

- [Example 2: Data Extraction](./02-data-extraction.md) - Learn web scraping techniques
- [Example 3: Form Filling](./03-form-filling.md) - Automate form submissions
- [Example 4: Screenshots](./04-screenshots.md) - Capture visual content
- [Example 5: Web Search](./05-web-search.md) - Perform searches and extract results

---

**Related Documentation:**
- [Main README](../README.md)
- [API Reference](../README.md#available-tools)
- [Troubleshooting Guide](../README.md#troubleshooting)
