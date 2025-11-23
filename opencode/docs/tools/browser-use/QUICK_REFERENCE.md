# Browser-Use Tool - Quick Reference

Fast lookup guide for common operations with the browser-use tool.

## Quick Start

```bash
# Install dependencies
pip install browser-use
uvx browser-use install

# Set API key (optional but recommended)
echo "BROWSER_USE_API_KEY=your-key" >> .env

# Test installation
opencode run "What browser automation tools do you have?" --agent tooling
```

---

## Tool Variants

| Tool | Purpose | Use When |
|------|---------|----------|
| `execute` | General automation | Multi-step workflows, complex tasks |
| `extractData` | Web scraping | Need structured data from pages |
| `fillForm` | Form automation | Filling out web forms |
| `screenshot` | Visual capture | Need screenshots of pages/elements |
| `navigate` | Content extraction | Reading page content |
| `browserSearch` | Web search | Searching and extracting results |

---

## Common Commands

### Navigate to Page
```
Use navigate to visit https://example.com and extract the page title
```

### Extract Data
```
Use extractData to get all product prices from https://example.com/products
```

### Fill Form
```
Use fillForm to complete the contact form at https://example.com/contact with name="John Doe" and email="john@example.com"
```

### Take Screenshot
```
Use screenshot to capture https://example.com
```

### Search Web
```
Use browserSearch to find top 10 results for "browser automation" on Google
```

### Complex Automation
```
Use execute to visit Hacker News, find the top post, and extract its title and URL
```

---

## Parameter Reference

### execute

```typescript
{
  task: string,              // Required: Task description
  url?: string,              // Optional: Starting URL
  useCloud?: boolean,        // Optional: Use cloud (default: false)
  maxSteps?: number,         // Optional: Max steps (default: 100)
  timeout?: number           // Optional: Timeout in seconds (default: 300)
}
```

### extractData

```typescript
{
  url: string,               // Required: URL to extract from
  dataDescription: string,   // Required: What data to extract
  useCloud?: boolean         // Optional: Use cloud (default: false)
}
```

### fillForm

```typescript
{
  url: string,               // Required: Form URL
  formData: string,          // Required: JSON string with form data
  submitForm?: boolean,      // Optional: Submit form (default: false)
  useCloud?: boolean         // Optional: Use cloud (default: false)
}
```

### screenshot

```typescript
{
  url: string,               // Required: URL to screenshot
  selector?: string,         // Optional: CSS selector for element
  useCloud?: boolean         // Optional: Use cloud (default: false)
}
```

### navigate

```typescript
{
  url: string,               // Required: URL to navigate to
  extractContent?: string,   // Optional: What to extract (default: "page title and main content")
  useCloud?: boolean         // Optional: Use cloud (default: false)
}
```

### browserSearch

```typescript
{
  searchEngine: string,      // Required: Search engine (google, bing, duckduckgo)
  query: string,             // Required: Search query
  numResults?: number,       // Optional: Number of results (default: 5)
  useCloud?: boolean         // Optional: Use cloud (default: false)
}
```

---

## Error Codes

| Error | Cause | Solution |
|-------|-------|----------|
| Package not installed | browser-use not installed | `pip install browser-use` |
| Missing API key | BROWSER_USE_API_KEY not set | Add to .env file |
| Invalid URL | Malformed URL | Include http:// or https:// |
| Task timeout | Task took too long | Increase timeout parameter |
| Max steps exceeded | Too many steps | Increase maxSteps parameter |

---

## Troubleshooting Checklist

### Tool Not Working

- [ ] Python 3.x installed? (`python3 --version`)
- [ ] browser-use package installed? (`pip list | grep browser-use`)
- [ ] Browser binaries installed? (`uvx browser-use install`)
- [ ] Tool exported in index.ts?
- [ ] OpenCode restarted?
- [ ] Agent has tool permission?

### Cloud Features Not Working

- [ ] API key set in .env?
- [ ] API key valid?
- [ ] Internet connection active?
- [ ] useCloud parameter set to true?

### Form Filling Issues

- [ ] Field names match form exactly?
- [ ] Data types correct (string, boolean, number)?
- [ ] Form accessible without login?
- [ ] CAPTCHA present? (use useCloud: true)

### Data Extraction Issues

- [ ] Page loads completely?
- [ ] Content requires JavaScript? (use useCloud: true)
- [ ] Data description specific enough?
- [ ] Timeout sufficient for page load?

---

## Best Practices Checklist

### Performance

- [ ] Use specific tool variants (not always execute)
- [ ] Set appropriate timeouts (lower for simple tasks)
- [ ] Set appropriate maxSteps (lower for simple tasks)
- [ ] Use cloud only when needed
- [ ] Cache results when possible

### Reliability

- [ ] Validate input data before submission
- [ ] Handle errors gracefully
- [ ] Implement retry logic for critical operations
- [ ] Log operations for debugging
- [ ] Test with useCloud: false first

### Security

- [ ] Never hardcode passwords
- [ ] Use environment variables for sensitive data
- [ ] Validate URLs before use
- [ ] Sanitize user input
- [ ] Use HTTPS only

---

## Common Patterns

### Extract and Process Data

```typescript
const result = await extractData({
  url: "https://example.com/products",
  dataDescription: "all product names and prices",
  useCloud: true
});

const data = JSON.parse(result);

if (data.success) {
  data.data.forEach(product => {
    console.log(`${product.name}: ${product.price}`);
  });
}
```

### Fill Form with Validation

```typescript
const formData = {
  name: "John Doe",
  email: "john@example.com"
};

// Validate
if (!formData.email.includes('@')) {
  throw new Error("Invalid email");
}

// Fill
const result = await fillForm({
  url: "https://example.com/form",
  formData: JSON.stringify(formData),
  submitForm: true,
  useCloud: true
});
```

### Retry on Failure

```typescript
async function executeWithRetry(task: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await execute({
        task,
        useCloud: true
      });
      
      const data = JSON.parse(result);
      if (data.success) return data;
      
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
}
```

### Batch Operations

```typescript
async function extractMultiple(urls: string[]) {
  const results = [];
  
  for (const url of urls) {
    const result = await extractData({
      url,
      dataDescription: "main content",
      useCloud: true
    });
    
    results.push(JSON.parse(result));
    
    // Rate limiting
    await new Promise(r => setTimeout(r, 2000));
  }
  
  return results;
}
```

---

## When to Use Cloud

### Use Cloud (useCloud: true)

✅ Production applications  
✅ Sites with CAPTCHA  
✅ Sites with bot detection  
✅ Authentication required  
✅ High success rate needed  
✅ Complex JavaScript sites  

### Use Local (useCloud: false)

✅ Development/testing  
✅ Simple static sites  
✅ Internal tools  
✅ Cost-sensitive operations  
✅ Privacy-critical tasks  
✅ Quick prototypes  

---

## Performance Tips

| Scenario | Timeout | MaxSteps | UseCloud |
|----------|---------|----------|----------|
| Simple navigation | 30s | 20 | false |
| Data extraction | 120s | 50 | true |
| Form filling | 180s | 50 | true |
| Complex workflow | 600s | 200 | true |
| Screenshot | 120s | 20 | false |
| Web search | 120s | 30 | true |

---

## Example Use Cases

### E-commerce
- Price monitoring
- Product data extraction
- Cart automation
- Order tracking

### Job Search
- Application automation
- Listing aggregation
- Profile updates
- Resume submission

### Research
- Data collection
- News aggregation
- Academic searches
- Citation extraction

### Social Media
- Post scheduling
- Engagement tracking
- Profile management
- Content extraction

### Customer Support
- Ticket submission
- Status checking
- FAQ extraction
- Response automation

---

## Resources

### Documentation
- [Full README](./README.md)
- [Validation Report](./VALIDATION.md)
- [Example 1: Navigation](./examples/01-basic-navigation.md)
- [Example 2: Data Extraction](./examples/02-data-extraction.md)
- [Example 3: Form Filling](./examples/03-form-filling.md)

### External Links
- [Browser-Use Docs](https://docs.browser-use.com)
- [Browser-Use GitHub](https://github.com/browser-use/browser-use)
- [Get API Key](https://cloud.browser-use.com/new-api-key)

### Support
- [GitHub Issues](https://github.com/browser-use/browser-use/issues)
- [Discord](https://discord.gg/browser-use)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/browser-use)

---

**Last Updated:** 2025-11-23  
**Tool Version:** 1.0.0  
**Status:** ✅ Production Ready
