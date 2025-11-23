/**
 * Browser-Use Tool for OpenCode
 * 
 * Enables LLM agents to automate web UI tasks using the browser-use Python library.
 * Provides capabilities for web navigation, form filling, data extraction, and complex workflows.
 */

import { tool } from "@opencode-ai/plugin/tool";
import { $ } from "bun";
import { join } from "path";

/**
 * Execute a browser automation task
 * 
 * @param task - Natural language description of the task to perform
 * @param url - Optional starting URL
 * @param useCloud - Whether to use Browser Use Cloud for stealth browsing
 * @param maxSteps - Maximum number of steps the agent can take (default: 100)
 * @param timeout - Timeout in seconds (default: 300)
 * @param chromeProfile - Path to Chrome user data directory for using saved credentials
 * @param headless - Whether to run browser in headless mode (default: false when using profile)
 * @returns JSON string with task results
 */
async function executeBrowserTask(
  task: string,
  url?: string,
  useCloud: boolean = false,
  maxSteps: number = 100,
  timeout: number = 300,
  chromeProfile?: string,
  headless: boolean = false
): Promise<string> {
  try {
    const scriptPath = join(__dirname, "browser-agent.py");
    
    // Build command arguments
    const args = [
      scriptPath,
      "--task", task,
      "--max-steps", maxSteps.toString(),
      "--timeout", timeout.toString(),
    ];
    
    if (url) {
      args.push("--url", url);
    }
    
    if (useCloud) {
      args.push("--use-cloud");
    }
    
    if (chromeProfile) {
      args.push("--chrome-profile", chromeProfile);
    }
    
    if (headless) {
      args.push("--headless");
    }
    
    // Execute Python script with timeout
    const result = await $`python3 ${args}`.text();
    
    return result.trim();
  } catch (error: any) {
    const errorMessage = error.stderr?.toString() || error.message || String(error);
    
    // Check for common errors and provide helpful messages
    if (errorMessage.includes("ModuleNotFoundError") || errorMessage.includes("No module named")) {
      return JSON.stringify({
        success: false,
        error: "browser-use package not installed. Install with: pip install browser-use",
        details: errorMessage
      });
    }
    
if (errorMessage.includes("BROWSER_USE_API_KEY")) {
      // For Chrome profile usage, we can try to continue without API key
      if (chromeProfile) {
        // Return the raw error for Chrome profile usage - let the Python script handle it
        return JSON.stringify({
          success: false,
          error: "Browser automation task failed - API key issue",
          details: errorMessage,
          note: "When using Chrome profiles, browser-use can work locally without an API key. The error might be related to LLM configuration."
        });
      } else {
        return JSON.stringify({
          success: false,
          error: "BROWSER_USE_API_KEY environment variable not set. Get your free API key at https://cloud.browser-use.com/new-api-key",
          details: errorMessage
        });
      }
    }
    
    return JSON.stringify({
      success: false,
      error: "Browser automation task failed",
      details: errorMessage
    });
  }
}

/**
 * Extract specific data from a webpage
 * 
 * @param url - URL to extract data from
 * @param dataDescription - Description of what data to extract
 * @param useCloud - Whether to use Browser Use Cloud
 * @param chromeProfile - Path to Chrome user data directory
 * @param headless - Whether to run in headless mode
 * @returns JSON string with extracted data
 */
async function extractWebData(
  url: string,
  dataDescription: string,
  useCloud: boolean = false,
  chromeProfile?: string,
  headless: boolean = false
): Promise<string> {
  const task = `Navigate to ${url} and extract the following data: ${dataDescription}. Return the data in a structured format.`;
  return executeBrowserTask(task, url, useCloud, 50, 180, chromeProfile, headless);
}

/**
 * Fill out a web form with provided data
 * 
 * @param url - URL of the form
 * @param formData - JSON object with form field names and values
 * @param submitForm - Whether to submit the form after filling (default: false)
 * @param useCloud - Whether to use Browser Use Cloud
 * @param chromeProfile - Path to Chrome user data directory
 * @param headless - Whether to run in headless mode
 * @returns JSON string with operation results
 */
async function fillWebForm(
  url: string,
  formData: string,
  submitForm: boolean = false,
  useCloud: boolean = false,
  chromeProfile?: string,
  headless: boolean = false
): Promise<string> {
  const submitInstruction = submitForm ? " and submit the form" : " but do not submit";
  const task = `Navigate to ${url} and fill out the form with this data: ${formData}${submitInstruction}. Confirm when complete.`;
  return executeBrowserTask(task, url, useCloud, 50, 180, chromeProfile, headless);
}

/**
 * Take a screenshot of a webpage
 * 
 * @param url - URL to screenshot
 * @param selector - Optional CSS selector to screenshot specific element
 * @param useCloud - Whether to use Browser Use Cloud
 * @param chromeProfile - Path to Chrome user data directory
 * @param headless - Whether to run in headless mode
 * @returns JSON string with screenshot path or base64 data
 */
async function takeScreenshot(
  url: string,
  selector?: string,
  useCloud: boolean = false,
  chromeProfile?: string,
  headless: boolean = false
): Promise<string> {
  const selectorInstruction = selector ? ` Focus on the element matching selector: ${selector}` : "";
  const task = `Navigate to ${url} and take a screenshot.${selectorInstruction} Save the screenshot and return the file path.`;
  return executeBrowserTask(task, url, useCloud, 20, 120, chromeProfile, headless);
}

/**
 * Navigate to a URL and return page information
 * 
 * @param url - URL to navigate to
 * @param extractContent - What content to extract (e.g., "main text", "all links", "page title")
 * @param useCloud - Whether to use Browser Use Cloud
 * @param chromeProfile - Path to Chrome user data directory
 * @param headless - Whether to run in headless mode
 * @returns JSON string with page content
 */
async function navigateAndExtract(
  url: string,
  extractContent: string = "page title and main content",
  useCloud: boolean = false,
  chromeProfile?: string,
  headless: boolean = false
): Promise<string> {
  const task = `Navigate to ${url} and extract: ${extractContent}`;
  return executeBrowserTask(task, url, useCloud, 30, 120, chromeProfile, headless);
}

/**
 * Perform a search and extract results
 * 
 * @param searchEngine - Search engine to use (e.g., "google", "bing", "duckduckgo")
 * @param query - Search query
 * @param numResults - Number of results to extract (default: 5)
 * @param useCloud - Whether to use Browser Use Cloud
 * @param chromeProfile - Path to Chrome user data directory
 * @param headless - Whether to run in headless mode
 * @returns JSON string with search results
 */
async function searchWeb(
  searchEngine: string,
  query: string,
  numResults: number = 5,
  useCloud: boolean = false,
  chromeProfile?: string,
  headless: boolean = false
): Promise<string> {
  const task = `Search ${searchEngine} for "${query}" and extract the top ${numResults} results including titles, URLs, and snippets.`;
  return executeBrowserTask(task, undefined, useCloud, 30, 120, chromeProfile, headless);
}

// Tool definitions
export const execute = tool({
  description: "Execute a browser automation task using natural language. Can navigate websites, click buttons, fill forms, extract data, and perform complex multi-step workflows. Supports using your Chrome profile for accessing sites where you're logged in.",
  args: {
    task: tool.schema.string().describe("Natural language description of the task to perform (e.g., 'Find the top post on Hacker News', 'Fill out the contact form with my information')"),
    url: tool.schema.string().optional().describe("Optional starting URL for the task"),
    useCloud: tool.schema.boolean().optional().default(false).describe("Use Browser Use Cloud for stealth browsing and CAPTCHA avoidance"),
    maxSteps: tool.schema.number().optional().default(100).describe("Maximum number of steps the agent can take"),
    timeout: tool.schema.number().optional().default(300).describe("Timeout in seconds"),
    chromeProfile: tool.schema.string().optional().describe("Path to Chrome user data directory (e.g., '~/Library/Application Support/Google/Chrome/Default' on macOS, '~/.config/google-chrome/Default' on Linux, '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default' on Windows). Enables using saved credentials for sites like Facebook, GitHub, LinkedIn. When using Chrome profiles, the tool works in local mode without requiring a Browser Use Cloud API key."),
    headless: tool.schema.boolean().optional().default(false).describe("Run browser in headless mode (not recommended when using Chrome profile)"),
  },
  async execute(args, context) {
    return await executeBrowserTask(
      args.task,
      args.url,
      args.useCloud ?? false,
      args.maxSteps ?? 100,
      args.timeout ?? 300,
      args.chromeProfile,
      args.headless ?? false
    );
  },
});

export const extractData = tool({
  description: "Extract specific data from a webpage. Useful for web scraping and data collection. Supports using Chrome profile for authenticated pages.",
  args: {
    url: tool.schema.string().describe("URL to extract data from"),
    dataDescription: tool.schema.string().describe("Description of what data to extract (e.g., 'all product prices', 'article title and author', 'table data')"),
    useCloud: tool.schema.boolean().optional().default(false).describe("Use Browser Use Cloud for stealth browsing"),
    chromeProfile: tool.schema.string().optional().describe("Path to Chrome user data directory for accessing authenticated pages. When using Chrome profiles, the tool works in local mode without requiring a Browser Use Cloud API key."),
    headless: tool.schema.boolean().optional().default(false).describe("Run browser in headless mode"),
  },
  async execute(args, context) {
    return await extractWebData(
      args.url,
      args.dataDescription,
      args.useCloud ?? false,
      args.chromeProfile,
      args.headless ?? false
    );
  },
});

export const fillForm = tool({
  description: "Fill out a web form with provided data. Can handle text inputs, dropdowns, checkboxes, and radio buttons. Supports using your Chrome profile for accessing sites where you're logged in.",
  args: {
    url: tool.schema.string().describe("URL of the form to fill"),
    formData: tool.schema.string().describe("JSON string with form field names and values (e.g., '{\"name\": \"John Doe\", \"email\": \"john@example.com\"}')"),
    submitForm: tool.schema.boolean().optional().default(false).describe("Whether to submit the form after filling"),
    useCloud: tool.schema.boolean().optional().default(false).describe("Use Browser Use Cloud for stealth browsing"),
    chromeProfile: tool.schema.string().optional().describe("Path to Chrome user data directory (e.g., '~/Library/Application Support/Google/Chrome/Default' on macOS, '~/.config/google-chrome/Default' on Linux, '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default' on Windows). Enables using saved credentials for sites like Facebook, GitHub, LinkedIn. When using Chrome profiles, the tool works in local mode without requiring a Browser Use Cloud API key."),
    headless: tool.schema.boolean().optional().default(false).describe("Run browser in headless mode (not recommended when using Chrome profile)"),
  },
  async execute(args, context) {
    return await fillWebForm(
      args.url,
      args.formData,
      args.submitForm ?? false,
      args.useCloud ?? false,
      args.chromeProfile,
      args.headless ?? false
    );
  },
});

export const screenshot = tool({
  description: "Take a screenshot of a webpage or specific element. Supports using Chrome profile for accessing authenticated pages.",
  args: {
    url: tool.schema.string().describe("URL to screenshot"),
    selector: tool.schema.string().optional().describe("Optional CSS selector to screenshot specific element"),
    useCloud: tool.schema.boolean().optional().default(false).describe("Use Browser Use Cloud for stealth browsing"),
    chromeProfile: tool.schema.string().optional().describe("Path to Chrome user data directory for accessing authenticated pages. When using Chrome profiles, the tool works in local mode without requiring a Browser Use Cloud API key."),
    headless: tool.schema.boolean().optional().default(false).describe("Run browser in headless mode"),
  },
  async execute(args, context) {
    return await takeScreenshot(
      args.url,
      args.selector,
      args.useCloud ?? false,
      args.chromeProfile,
      args.headless ?? false
    );
  },
});

export const navigate = tool({
  description: "Navigate to a URL and extract page content. Useful for reading web pages and extracting information. Supports using Chrome profile for authenticated pages.",
  args: {
    url: tool.schema.string().describe("URL to navigate to"),
    extractContent: tool.schema.string().optional().default("page title and main content").describe("What content to extract from the page"),
    useCloud: tool.schema.boolean().optional().default(false).describe("Use Browser Use Cloud for stealth browsing"),
    chromeProfile: tool.schema.string().optional().describe("Path to Chrome user data directory for accessing authenticated pages. When using Chrome profiles, the tool works in local mode without requiring a Browser Use Cloud API key."),
    headless: tool.schema.boolean().optional().default(false).describe("Run browser in headless mode"),
  },
  async execute(args, context) {
    return await navigateAndExtract(
      args.url,
      args.extractContent ?? "page title and main content",
      args.useCloud ?? false,
      args.chromeProfile,
      args.headless ?? false
    );
  },
});

export const search = tool({
  description: "Perform a web search and extract results. Supports Google, Bing, DuckDuckGo, and other search engines. Supports using Chrome profile for authenticated searches.",
  args: {
    searchEngine: tool.schema.string().describe("Search engine to use (e.g., 'google', 'bing', 'duckduckgo')"),
    query: tool.schema.string().describe("Search query"),
    numResults: tool.schema.number().optional().default(5).describe("Number of results to extract"),
    useCloud: tool.schema.boolean().optional().default(false).describe("Use Browser Use Cloud for stealth browsing"),
    chromeProfile: tool.schema.string().optional().describe("Path to Chrome user data directory for accessing authenticated searches. When using Chrome profiles, the tool works in local mode without requiring a Browser Use Cloud API key."),
    headless: tool.schema.boolean().optional().default(false).describe("Run browser in headless mode"),
  },
  async execute(args, context) {
    return await searchWeb(
      args.searchEngine,
      args.query,
      args.numResults ?? 5,
      args.useCloud ?? false,
      args.chromeProfile,
      args.headless ?? false
    );
  },
});

// Default export
export default execute;
