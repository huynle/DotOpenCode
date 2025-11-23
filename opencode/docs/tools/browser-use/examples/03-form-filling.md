# Example 3: Form Filling and Automation

Learn how to automate form submissions using the browser-use tool.

## Scenario

You want to automatically fill out web forms with data, saving time and reducing manual effort.

## Using the `fillForm` Tool

### Simple Contact Form

**Task:** Fill out a basic contact form

**Command:**
```
Use fillForm to complete the contact form at https://example.com/contact with name="John Doe", email="john@example.com", and message="Hello!"
```

**Code:**
```typescript
const result = await fillForm({
  url: "https://example.com/contact",
  formData: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello! I'd like to learn more about your services."
  }),
  submitForm: false,  // Don't submit yet
  useCloud: true
});
```

**Output:**
```json
{
  "success": true,
  "message": "Form filled successfully",
  "fieldsCompleted": ["name", "email", "message"],
  "submitted": false
}
```

---

### Form with Submission

**Task:** Fill and submit a form

**Command:**
```
Use fillForm to complete and submit the newsletter signup at https://example.com/newsletter
```

**Code:**
```typescript
const result = await fillForm({
  url: "https://example.com/newsletter",
  formData: JSON.stringify({
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    interests: "Technology, AI, Automation"
  }),
  submitForm: true,  // Submit after filling
  useCloud: true
});
```

**Output:**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "fieldsCompleted": ["email", "firstName", "lastName", "interests"],
  "submitted": true,
  "confirmationMessage": "Thank you for subscribing!"
}
```

---

### Complex Form with Multiple Field Types

**Task:** Fill a form with various input types

**Command:**
```
Use fillForm to complete the registration form with all my details
```

**Code:**
```typescript
const result = await fillForm({
  url: "https://example.com/register",
  formData: JSON.stringify({
    // Text inputs
    username: "johndoe",
    email: "john@example.com",
    password: "SecurePass123!",
    confirmPassword: "SecurePass123!",
    
    // Dropdowns
    country: "United States",
    state: "California",
    
    // Radio buttons
    accountType: "personal",
    
    // Checkboxes
    newsletter: true,
    terms: true,
    privacy: true,
    
    // Text area
    bio: "Software developer interested in AI and automation"
  }),
  submitForm: false,
  useCloud: true
});
```

**Output:**
```json
{
  "success": true,
  "message": "Form filled successfully",
  "fieldsCompleted": [
    "username", "email", "password", "confirmPassword",
    "country", "state", "accountType",
    "newsletter", "terms", "privacy", "bio"
  ],
  "submitted": false
}
```

---

## Using `execute` for Complex Forms

### Multi-Step Form

**Task:** Complete a multi-page form wizard

**Command:**
```
Use execute to complete the entire multi-step application form
```

**Code:**
```typescript
const result = await execute({
  task: `Complete the multi-step application form:
    Step 1: Personal info - name: John Doe, email: john@example.com, phone: 555-0123
    Step 2: Address - street: 123 Main St, city: San Francisco, state: CA, zip: 94102
    Step 3: Employment - company: Tech Corp, position: Engineer, years: 5
    Click Next after each step and Submit on the final step`,
  url: "https://example.com/application",
  maxSteps: 100,
  useCloud: true
});
```

**Output:**
```json
{
  "success": true,
  "result": {
    "stepsCompleted": 3,
    "submitted": true,
    "confirmationNumber": "APP-2025-001234",
    "message": "Application submitted successfully"
  }
}
```

---

### Form with File Upload

**Task:** Fill form and upload files

**Command:**
```
Use execute to fill the job application and upload my resume
```

**Code:**
```typescript
const result = await execute({
  task: `Fill out the job application form:
    - Name: John Doe
    - Email: john@example.com
    - Position: Senior Software Engineer
    - Upload resume from /path/to/resume.pdf
    - Cover letter: I am excited to apply for this position...
    Then submit the form`,
  url: "https://company.com/careers/apply",
  maxSteps: 50,
  useCloud: true
});
```

---

### Form with Conditional Fields

**Task:** Handle forms with dynamic fields

**Command:**
```
Use execute to complete the survey form, answering conditional questions based on previous answers
```

**Code:**
```typescript
const result = await execute({
  task: `Complete the survey:
    1. Are you a customer? Yes
    2. (If yes appears) How long have you been a customer? 2 years
    3. (If yes appears) Rate your satisfaction: 5 stars
    4. Would you recommend us? Yes
    5. Additional comments: Great service!
    Submit the form`,
  url: "https://example.com/survey",
  maxSteps: 50,
  useCloud: true
});
```

---

## Real-World Use Cases

### 1. Job Application Automation

**Scenario:** Apply to multiple job postings with your information

```typescript
const jobApplicationData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "555-0123",
    linkedin: "linkedin.com/in/johndoe"
  },
  experience: {
    currentCompany: "Tech Corp",
    currentPosition: "Senior Engineer",
    yearsExperience: 8,
    skills: "JavaScript, Python, AI, Cloud Computing"
  },
  education: {
    degree: "BS Computer Science",
    university: "State University",
    graduationYear: 2015
  }
};

const result = await execute({
  task: `Fill out the job application with my information:
    ${JSON.stringify(jobApplicationData, null, 2)}
    Upload resume from /path/to/resume.pdf
    Upload cover letter from /path/to/cover-letter.pdf
    Submit the application`,
  url: "https://company.com/careers/apply/senior-engineer",
  maxSteps: 100,
  timeout: 300,
  useCloud: true
});
```

---

### 2. Event Registration

**Scenario:** Register for conferences and events

```typescript
const result = await fillForm({
  url: "https://conference.com/register",
  formData: JSON.stringify({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    company: "Tech Corp",
    jobTitle: "Senior Engineer",
    dietaryRestrictions: "Vegetarian",
    shirtSize: "L",
    workshops: ["AI Workshop", "Cloud Computing"],
    emergencyContact: "Jane Doe - 555-0124"
  }),
  submitForm: true,
  useCloud: true
});
```

---

### 3. Customer Support Tickets

**Scenario:** Submit support tickets automatically

```typescript
const result = await fillForm({
  url: "https://support.example.com/new-ticket",
  formData: JSON.stringify({
    subject: "Login Issue",
    category: "Technical Support",
    priority: "High",
    description: `I'm unable to log in to my account. 
      Error message: "Invalid credentials"
      Steps taken: Reset password, cleared cache
      Browser: Chrome 120
      OS: macOS 14`,
    email: "john@example.com",
    accountId: "12345"
  }),
  submitForm: true,
  useCloud: true
});
```

---

### 4. Appointment Scheduling

**Scenario:** Book appointments online

```typescript
const result = await execute({
  task: `Book an appointment:
    - Service: Dental Cleaning
    - Date: Next available Tuesday
    - Time: Morning (9-11 AM)
    - Patient: John Doe
    - Phone: 555-0123
    - Insurance: Blue Cross
    - New patient: No
    Confirm the booking`,
  url: "https://dentist.com/book",
  maxSteps: 50,
  useCloud: true
});
```

---

### 5. Online Shopping Cart

**Scenario:** Add items to cart and checkout

```typescript
const result = await execute({
  task: `Add these items to cart and proceed to checkout:
    - Wireless Mouse (Qty: 2)
    - USB-C Cable (Qty: 3)
    - Laptop Stand (Qty: 1)
    
    Checkout with:
    - Shipping: 123 Main St, San Francisco, CA 94102
    - Payment: Use saved card ending in 1234
    - Shipping method: Standard (5-7 days)
    
    Review order but DO NOT complete purchase`,
  url: "https://store.example.com",
  maxSteps: 100,
  useCloud: true
});
```

---

## Best Practices

### 1. Validate Form Data Before Submission

```typescript
function validateFormData(data: any): boolean {
  // Check required fields
  if (!data.email || !data.name) {
    console.error("Missing required fields");
    return false;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    console.error("Invalid email format");
    return false;
  }
  
  // Validate phone format (if provided)
  if (data.phone) {
    const phoneRegex = /^\d{3}-\d{4}$/;
    if (!phoneRegex.test(data.phone)) {
      console.error("Invalid phone format");
      return false;
    }
  }
  
  return true;
}

// Use validation
const formData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "555-0123"
};

if (validateFormData(formData)) {
  const result = await fillForm({
    url: "https://example.com/form",
    formData: JSON.stringify(formData),
    submitForm: true,
    useCloud: true
  });
}
```

---

### 2. Handle Form Submission Carefully

```typescript
// Fill without submitting (for review)
const fillResult = await fillForm({
  url: "https://example.com/form",
  formData: JSON.stringify(data),
  submitForm: false,  // Don't submit yet
  useCloud: true
});

// Verify fields were filled correctly
const verification = JSON.parse(fillResult);
if (verification.success && verification.fieldsCompleted.length === expectedFieldCount) {
  // Now submit
  const submitResult = await execute({
    task: "Review the form and click Submit",
    url: "https://example.com/form",
    maxSteps: 10,
    useCloud: true
  });
}
```

---

### 3. Use Cloud for Important Forms

```typescript
// Important forms (job applications, registrations)
await fillForm({
  url: "https://important-form.com",
  formData: JSON.stringify(data),
  submitForm: true,
  useCloud: true  // Better success rate, CAPTCHA handling
});

// Simple forms (testing, internal tools)
await fillForm({
  url: "https://internal-form.com",
  formData: JSON.stringify(data),
  submitForm: true,
  useCloud: false  // Local is fine
});
```

---

### 4. Implement Retry Logic

```typescript
async function fillFormWithRetry(
  url: string,
  formData: any,
  maxRetries: number = 3
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fillForm({
        url,
        formData: JSON.stringify(formData),
        submitForm: true,
        useCloud: true
      });
      
      const data = JSON.parse(result);
      
      if (data.success) {
        return data;
      }
      
      console.log(`Attempt ${attempt} failed, retrying...`);
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
      
    } catch (error) {
      console.error(`Attempt ${attempt} error:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
  
  throw new Error("Max retries exceeded");
}
```

---

### 5. Log Form Submissions

```typescript
async function fillFormWithLogging(
  url: string,
  formData: any,
  submitForm: boolean = false
): Promise<any> {
  const startTime = Date.now();
  
  console.log(`[${new Date().toISOString()}] Starting form fill`);
  console.log(`URL: ${url}`);
  console.log(`Submit: ${submitForm}`);
  
  try {
    const result = await fillForm({
      url,
      formData: JSON.stringify(formData),
      submitForm,
      useCloud: true
    });
    
    const data = JSON.parse(result);
    const duration = Date.now() - startTime;
    
    console.log(`[${new Date().toISOString()}] Form fill completed`);
    console.log(`Duration: ${duration}ms`);
    console.log(`Success: ${data.success}`);
    console.log(`Fields completed: ${data.fieldsCompleted?.length || 0}`);
    
    return data;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(`[${new Date().toISOString()}] Form fill failed`);
    console.error(`Duration: ${duration}ms`);
    console.error(`Error:`, error);
    
    throw error;
  }
}
```

---

## Troubleshooting

### Issue: Fields Not Filled

**Problem:** Some form fields remain empty

**Solutions:**
1. Check field names match form exactly
2. Ensure data types are correct (strings for text, booleans for checkboxes)
3. Try using `execute` for complex forms
4. Enable cloud: `useCloud: true`

---

### Issue: Form Validation Errors

**Problem:** Form shows validation errors after filling

**Solutions:**
1. Validate data format before submission
2. Check required field constraints
3. Ensure data matches expected patterns (email, phone, etc.)
4. Review form's validation rules

---

### Issue: CAPTCHA Blocking Submission

**Problem:** CAPTCHA prevents form submission

**Solutions:**
```typescript
// Use cloud for better CAPTCHA handling
await fillForm({
  url: "https://form-with-captcha.com",
  formData: JSON.stringify(data),
  submitForm: true,
  useCloud: true  // Much better CAPTCHA success rate
});
```

---

### Issue: Multi-Step Form Navigation

**Problem:** Can't navigate through form steps

**Solutions:**
```typescript
// Use execute for multi-step forms
await execute({
  task: `Complete all steps:
    Step 1: Fill personal info and click Next
    Step 2: Fill address and click Next
    Step 3: Fill payment and click Submit`,
  url: "https://multi-step-form.com",
  maxSteps: 100,
  useCloud: true
});
```

---

## Security Considerations

### 1. Never Hardcode Sensitive Data

❌ **Bad:**
```typescript
const result = await fillForm({
  url: "https://example.com/form",
  formData: JSON.stringify({
    password: "MyPassword123!"  // Don't hardcode passwords!
  })
});
```

✅ **Good:**
```typescript
const password = process.env.USER_PASSWORD;  // Use environment variables

const result = await fillForm({
  url: "https://example.com/form",
  formData: JSON.stringify({
    password: password
  })
});
```

---

### 2. Sanitize User Input

```typescript
function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/<script>/gi, '')
    .replace(/<\/script>/gi, '')
    .trim();
}

const userInput = sanitizeInput(getUserInput());
```

---

### 3. Use HTTPS Only

```typescript
function validateSecureUrl(url: string): boolean {
  return url.startsWith('https://');
}

const url = "https://example.com/form";
if (!validateSecureUrl(url)) {
  throw new Error("Only HTTPS URLs are allowed");
}
```

---

## Next Steps

- [Example 4: Screenshots](./04-screenshots.md) - Capture visual content
- [Example 5: Web Search](./05-web-search.md) - Perform searches and extract results
- [Example 1: Basic Navigation](./01-basic-navigation.md) - Navigate websites

---

**Related Documentation:**
- [Main README](../README.md)
- [API Reference](../README.md#available-tools)
- [Security Best Practices](../README.md#security-considerations)
