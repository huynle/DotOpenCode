# Example 2: Web Data Extraction

Learn how to extract structured data from websites using the browser-use tool.

## Scenario

You want to scrape data from websites for analysis, monitoring, or integration with other systems.

## Using the `extractData` Tool

### Simple Data Extraction

**Task:** Extract product prices from an e-commerce site

**Command:**
```
Use extractData to get all product prices from https://example.com/products
```

**Code:**
```typescript
const result = await extractData({
  url: "https://example.com/products",
  dataDescription: "all product prices"
});
```

**Output:**
```json
{
  "success": true,
  "data": [
    {
      "product": "Product A",
      "price": "$29.99"
    },
    {
      "product": "Product B",
      "price": "$49.99"
    }
  ]
}
```

---

### Structured Data Extraction

**Task:** Extract detailed product information

**Command:**
```
Use extractData to get product names, prices, ratings, and availability from https://example.com/products
```

**Code:**
```typescript
const result = await extractData({
  url: "https://example.com/products",
  dataDescription: "product names, prices, ratings (out of 5), and availability status in a structured format",
  useCloud: true
});
```

**Output:**
```json
{
  "success": true,
  "data": [
    {
      "name": "MacBook Pro 16\"",
      "price": "$2,499",
      "rating": 4.8,
      "available": true,
      "stock": "In Stock"
    },
    {
      "name": "Dell XPS 15",
      "price": "$1,799",
      "rating": 4.6,
      "available": true,
      "stock": "Limited Stock"
    },
    {
      "name": "ThinkPad X1",
      "price": "$1,599",
      "rating": 4.5,
      "available": false,
      "stock": "Out of Stock"
    }
  ]
}
```

---

### Table Data Extraction

**Task:** Extract data from HTML tables

**Command:**
```
Use extractData to extract all data from the pricing table at https://example.com/pricing
```

**Code:**
```typescript
const result = await extractData({
  url: "https://example.com/pricing",
  dataDescription: "all rows from the pricing comparison table including plan names, prices, and features"
});
```

**Output:**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "name": "Basic",
        "price": "$9/month",
        "features": ["5 users", "10GB storage", "Email support"]
      },
      {
        "name": "Pro",
        "price": "$29/month",
        "features": ["25 users", "100GB storage", "Priority support", "API access"]
      },
      {
        "name": "Enterprise",
        "price": "Custom",
        "features": ["Unlimited users", "Unlimited storage", "24/7 support", "Custom integrations"]
      }
    ]
  }
}
```

---

### List Extraction

**Task:** Extract all items from a list

**Command:**
```
Use extractData to get all article titles and publication dates from https://blog.example.com
```

**Code:**
```typescript
const result = await extractData({
  url: "https://blog.example.com",
  dataDescription: "all blog post titles, authors, publication dates, and excerpt summaries"
});
```

**Output:**
```json
{
  "success": true,
  "data": [
    {
      "title": "Getting Started with Browser Automation",
      "author": "Jane Smith",
      "date": "2025-11-20",
      "excerpt": "Learn the basics of automating browser tasks with AI..."
    },
    {
      "title": "Advanced Web Scraping Techniques",
      "author": "John Doe",
      "date": "2025-11-18",
      "excerpt": "Discover advanced methods for extracting data from complex websites..."
    }
  ]
}
```

---

## Advanced Extraction Techniques

### Pagination Handling

**Task:** Extract data from multiple pages

**Command:**
```
Use execute to navigate through all pages of https://example.com/products and extract all product information
```

**Code:**
```typescript
const result = await execute({
  task: "Visit the products page, extract all product data, then click 'Next' to go through all pages and collect all products",
  url: "https://example.com/products",
  maxSteps: 200,
  timeout: 600
});
```

**Output:**
```json
{
  "success": true,
  "result": {
    "totalPages": 5,
    "totalProducts": 47,
    "products": [
      // All products from all pages
    ]
  }
}
```

---

### Dynamic Content Extraction

**Task:** Extract data that loads via JavaScript

**Command:**
```
Use extractData with useCloud=true to get data from https://dynamic-site.com that loads via JavaScript
```

**Code:**
```typescript
const result = await extractData({
  url: "https://dynamic-site.com",
  dataDescription: "all product cards that appear after the page loads, including images, titles, and prices",
  useCloud: true  // Better handling of dynamic content
});
```

---

### Conditional Extraction

**Task:** Extract data based on conditions

**Command:**
```
Use execute to extract only products that are in stock and priced under $100 from https://example.com/products
```

**Code:**
```typescript
const result = await execute({
  task: "Extract all products that are marked as 'In Stock' and have a price less than $100",
  url: "https://example.com/products",
  maxSteps: 100
});
```

**Output:**
```json
{
  "success": true,
  "result": {
    "matchingProducts": [
      {
        "name": "Budget Laptop",
        "price": "$89.99",
        "stock": "In Stock"
      },
      {
        "name": "Wireless Mouse",
        "price": "$24.99",
        "stock": "In Stock"
      }
    ]
  }
}
```

---

## Real-World Use Cases

### 1. Price Monitoring

Monitor competitor prices:

```typescript
const result = await extractData({
  url: "https://competitor.com/products",
  dataDescription: "all product names and prices",
  useCloud: true
});

// Compare with your prices
const data = JSON.parse(result);
if (data.success) {
  data.data.forEach(product => {
    console.log(`${product.name}: ${product.price}`);
  });
}
```

---

### 2. Job Listing Aggregation

Collect job postings:

```typescript
const result = await extractData({
  url: "https://jobs.example.com",
  dataDescription: "all job titles, companies, locations, and salary ranges",
  useCloud: true
});
```

**Output:**
```json
{
  "success": true,
  "data": [
    {
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "salary": "$150k - $200k"
    }
  ]
}
```

---

### 3. Real Estate Data

Extract property listings:

```typescript
const result = await extractData({
  url: "https://realestate.example.com/listings",
  dataDescription: "property addresses, prices, bedrooms, bathrooms, square footage, and listing dates",
  useCloud: true
});
```

---

### 4. Social Media Metrics

Gather engagement data:

```typescript
const result = await execute({
  task: "Extract all post titles, like counts, comment counts, and share counts from the profile page",
  url: "https://socialmedia.com/profile/username",
  useCloud: true,
  maxSteps: 100
});
```

---

### 5. News Aggregation

Collect news articles:

```typescript
const result = await extractData({
  url: "https://news.example.com",
  dataDescription: "top 20 article headlines, summaries, publication times, and author names",
  useCloud: true
});
```

---

## Best Practices

### 1. Be Specific About Data Structure

❌ **Vague:**
```
Use extractData to get data from the page
```

✅ **Specific:**
```
Use extractData to get product names, prices (in USD), and availability status (In Stock/Out of Stock) in a structured JSON format
```

---

### 2. Use Cloud for Complex Sites

```typescript
// Simple static site - local is fine
await extractData({
  url: "https://simple-site.com",
  dataDescription: "article titles",
  useCloud: false
});

// Complex dynamic site - use cloud
await extractData({
  url: "https://complex-spa.com",
  dataDescription: "product data",
  useCloud: true  // Better success rate
});
```

---

### 3. Handle Errors and Validate Data

```typescript
const result = await extractData({
  url: "https://example.com",
  dataDescription: "product data"
});

const data = JSON.parse(result);

if (!data.success) {
  console.error("Extraction failed:", data.error);
  return;
}

// Validate extracted data
if (!data.data || data.data.length === 0) {
  console.warn("No data extracted");
  return;
}

// Process data
data.data.forEach(item => {
  // Validate required fields
  if (!item.name || !item.price) {
    console.warn("Invalid item:", item);
    return;
  }
  
  // Process valid item
  console.log(`${item.name}: ${item.price}`);
});
```

---

### 4. Respect Rate Limits

```typescript
// Add delays between requests
async function extractMultiplePages(urls: string[]) {
  const results = [];
  
  for (const url of urls) {
    const result = await extractData({
      url,
      dataDescription: "product data",
      useCloud: true
    });
    
    results.push(JSON.parse(result));
    
    // Wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
}
```

---

### 5. Cache Results

```typescript
const cache = new Map();

async function extractWithCache(url: string, dataDescription: string) {
  const cacheKey = `${url}:${dataDescription}`;
  
  // Check cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    const age = Date.now() - cached.timestamp;
    
    // Use cache if less than 1 hour old
    if (age < 3600000) {
      return cached.data;
    }
  }
  
  // Extract fresh data
  const result = await extractData({
    url,
    dataDescription,
    useCloud: true
  });
  
  // Cache result
  cache.set(cacheKey, {
    data: result,
    timestamp: Date.now()
  });
  
  return result;
}
```

---

## Troubleshooting

### Issue: No Data Extracted

**Problem:** Tool returns empty data array

**Solutions:**
1. Check if page requires JavaScript: Use `useCloud: true`
2. Be more specific in data description
3. Verify URL is correct and accessible
4. Check if page requires authentication

---

### Issue: Incomplete Data

**Problem:** Some fields are missing

**Solutions:**
1. Be more explicit about required fields
2. Check if data is on a different page
3. Increase timeout for slow-loading content

---

### Issue: Rate Limited

**Problem:** Site blocks requests

**Solutions:**
1. Enable cloud: `useCloud: true`
2. Add delays between requests
3. Use different user agents (automatic with cloud)

---

## Next Steps

- [Example 3: Form Filling](./03-form-filling.md) - Automate form submissions
- [Example 4: Screenshots](./04-screenshots.md) - Capture visual content
- [Example 5: Web Search](./05-web-search.md) - Perform searches and extract results

---

**Related Documentation:**
- [Main README](../README.md)
- [API Reference](../README.md#available-tools)
- [Troubleshooting Guide](../README.md#troubleshooting)
