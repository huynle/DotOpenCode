# Browser-Use Tool Examples

Practical examples demonstrating how to use the browser-use tool for various automation tasks.

## Available Examples

### [Example 1: Basic Web Navigation](./01-basic-navigation.md)
Learn how to navigate websites and extract content.

**Topics Covered:**
- Simple page title extraction
- Extracting multiple elements
- Structured data extraction
- Multi-step navigation
- Conditional navigation

**Use Cases:**
- News aggregation
- Documentation reading
- Product information extraction
- Contact information gathering

---

### [Example 2: Web Data Extraction](./02-data-extraction.md)
Master web scraping and data collection techniques.

**Topics Covered:**
- Simple data extraction
- Structured data extraction
- Table data extraction
- List extraction
- Pagination handling
- Dynamic content extraction
- Conditional extraction

**Use Cases:**
- Price monitoring
- Job listing aggregation
- Real estate data collection
- Social media metrics
- News aggregation

---

### [Example 3: Form Filling and Automation](./03-form-filling.md)
Automate form submissions and data entry.

**Topics Covered:**
- Simple contact forms
- Form submission
- Complex forms with multiple field types
- Multi-step forms
- Forms with file uploads
- Conditional form fields

**Use Cases:**
- Job application automation
- Event registration
- Customer support tickets
- Appointment scheduling
- Online shopping

---

## Quick Start

### 1. Install Dependencies

```bash
# Install browser-use package
pip install browser-use

# Install browser binaries
uvx browser-use install
```

### 2. Set Up API Key (Optional)

```bash
# Get API key from https://cloud.browser-use.com/new-api-key
echo "BROWSER_USE_API_KEY=your-key-here" >> .env
```

### 3. Try Your First Command

```bash
# Test with a simple navigation
opencode run "Use navigate to visit https://example.com and extract the page title" --agent tooling
```

---

## Example Categories

### Beginner Examples
- ✅ [Basic Navigation](./01-basic-navigation.md) - Start here!
- ✅ Simple data extraction
- ✅ Basic form filling
- ✅ Taking screenshots

### Intermediate Examples
- ✅ [Data Extraction](./02-data-extraction.md) - Web scraping
- ✅ [Form Automation](./03-form-filling.md) - Complex forms
- ✅ Multi-step workflows
- ✅ Pagination handling

### Advanced Examples
- ✅ Multi-page data collection
- ✅ Authentication flows
- ✅ Dynamic content handling
- ✅ Error recovery and retry logic

---

## Learning Path

### Week 1: Basics
1. Read [Example 1: Basic Navigation](./01-basic-navigation.md)
2. Practice simple page navigation
3. Extract page titles and content
4. Try different websites

### Week 2: Data Extraction
1. Read [Example 2: Data Extraction](./02-data-extraction.md)
2. Extract product data
3. Handle tables and lists
4. Work with pagination

### Week 3: Form Automation
1. Read [Example 3: Form Filling](./03-form-filling.md)
2. Fill simple forms
3. Handle multi-step forms
4. Implement validation

### Week 4: Real Projects
1. Build a price monitoring tool
2. Create a job application bot
3. Automate data collection
4. Build custom workflows

---

## Common Patterns

### Pattern 1: Extract and Process

```typescript
// Extract data
const result = await extractData({
  url: "https://example.com/products",
  dataDescription: "all product names and prices",
  useCloud: true
});

// Process data
const data = JSON.parse(result);
if (data.success) {
  data.data.forEach(product => {
    console.log(`${product.name}: ${product.price}`);
  });
}
```

### Pattern 2: Fill and Verify

```typescript
// Fill form
const fillResult = await fillForm({
  url: "https://example.com/form",
  formData: JSON.stringify(formData),
  submitForm: false,  // Don't submit yet
  useCloud: true
});

// Verify
const verification = JSON.parse(fillResult);
if (verification.success) {
  // Submit
  await execute({
    task: "Review and submit the form",
    url: "https://example.com/form",
    maxSteps: 10
  });
}
```

### Pattern 3: Retry on Failure

```typescript
async function executeWithRetry(task: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await execute({ task, useCloud: true });
      const data = JSON.parse(result);
      if (data.success) return data;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
}
```

---

## Best Practices

### 1. Start Simple
- Begin with basic navigation
- Test with simple websites
- Use local browser first (`useCloud: false`)
- Gradually increase complexity

### 2. Use Specific Tools
- `navigate` for simple content extraction
- `extractData` for web scraping
- `fillForm` for forms
- `execute` for complex workflows

### 3. Handle Errors
- Always check `success` field
- Implement retry logic
- Log errors for debugging
- Provide fallback options

### 4. Optimize Performance
- Set appropriate timeouts
- Use lower maxSteps for simple tasks
- Cache results when possible
- Batch operations with delays

### 5. Use Cloud Wisely
- Enable for production
- Enable for CAPTCHA sites
- Disable for development
- Disable for simple tasks

---

## Troubleshooting

### Common Issues

#### Tool Not Found
**Solution:** Verify tool is exported in `/opencode/tool/index.ts` and restart OpenCode

#### Python Not Found
**Solution:** Install Python 3.x and ensure it's in PATH

#### Package Not Installed
**Solution:** Run `pip install browser-use`

#### API Key Error
**Solution:** Set `BROWSER_USE_API_KEY` in `.env` file

#### Timeout Errors
**Solution:** Increase `timeout` parameter

#### CAPTCHA Blocking
**Solution:** Set `useCloud: true`

---

## Real-World Projects

### Project 1: Price Monitor
**Goal:** Track product prices across multiple sites

**Steps:**
1. Extract prices from competitor sites
2. Store in database
3. Send alerts on price changes
4. Generate price comparison reports

**Example:** [Data Extraction Guide](./02-data-extraction.md#1-price-monitoring)

---

### Project 2: Job Application Bot
**Goal:** Automate job applications

**Steps:**
1. Search job boards
2. Extract job listings
3. Fill application forms
4. Track submissions

**Example:** [Form Filling Guide](./03-form-filling.md#1-job-application-automation)

---

### Project 3: Content Aggregator
**Goal:** Collect content from multiple sources

**Steps:**
1. Navigate to content sources
2. Extract articles/posts
3. Categorize and tag
4. Generate summaries

**Example:** [Navigation Guide](./01-basic-navigation.md#1-news-aggregation)

---

### Project 4: Appointment Scheduler
**Goal:** Automate appointment booking

**Steps:**
1. Check availability
2. Fill booking forms
3. Confirm appointments
4. Send reminders

**Example:** [Form Filling Guide](./03-form-filling.md#4-appointment-scheduling)

---

## Additional Resources

### Documentation
- [Main README](../README.md) - Complete tool documentation
- [Quick Reference](../QUICK_REFERENCE.md) - Fast lookup guide
- [Validation Report](../VALIDATION.md) - Testing and validation

### External Resources
- [Browser-Use Docs](https://docs.browser-use.com) - Official documentation
- [Browser-Use GitHub](https://github.com/browser-use/browser-use) - Source code
- [Example Use Cases](https://docs.browser-use.com/examples) - More examples

### Community
- [GitHub Issues](https://github.com/browser-use/browser-use/issues) - Report issues
- [Discord](https://discord.gg/browser-use) - Community support
- [Stack Overflow](https://stackoverflow.com/questions/tagged/browser-use) - Q&A

---

## Contributing Examples

Have a great example to share?

1. Fork the repository
2. Create your example following the format
3. Test thoroughly
4. Submit a pull request

**Example Format:**
- Clear scenario description
- Step-by-step instructions
- Code examples with comments
- Expected output
- Troubleshooting tips

---

## Next Steps

1. **Read the examples** in order (1 → 2 → 3)
2. **Try the examples** with real websites
3. **Modify the examples** for your use cases
4. **Build your own** automation projects
5. **Share your learnings** with the community

---

**Happy Automating! 🚀**

---

**Last Updated:** 2025-11-23  
**Examples:** 3 comprehensive guides  
**Difficulty:** Beginner to Advanced  
**Status:** ✅ Production Ready
