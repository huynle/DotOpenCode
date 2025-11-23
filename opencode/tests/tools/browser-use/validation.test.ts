/**
 * Browser-Use Tool Validation Tests
 * 
 * Comprehensive test suite for validating the browser-use tool
 * using automated CLI testing with OpenCode.
 * 
 * Run with: bun test opencode/tests/tools/browser-use/validation.test.ts
 */

import { describe, test, expect } from "bun:test";
import { $ } from "bun";

const CONFIG_DIR = "/Users/huy/projects/DotOpenCode/browser-use/opencode";
const TEST_AGENT = "tooling";

/**
 * Helper function to run OpenCode CLI commands with proper config
 */
async function runOpenCode(prompt: string, timeout: number = 60000): Promise<string> {
  try {
    const result = await $`OPENCODE_CONFIG_DIR=${CONFIG_DIR} opencode run ${prompt} --agent ${TEST_AGENT}`.text();
    return result.trim();
  } catch (error: any) {
    return error.stderr?.toString() || error.message || String(error);
  }
}

describe("Browser-Use Tool Validation", () => {
  
  describe("Test 1: Tool Discovery", () => {
    test("should discover all browser-use tool variants", async () => {
      const output = await runOpenCode(
        "What tools do you have access to? List all browser-use related tools."
      );
      
// Check for all expected tool variants
       expect(output).toContain("browserUse");
       expect(output).toContain("execute");
       expect(output).toContain("browserSearch");
       expect(output).toContain("navigate");
       expect(output).toContain("screenshot");
       expect(output).toContain("fillForm");
       expect(output).toContain("extractData");
      
      // Verify no double-prefixing
      expect(output).not.toContain("browser-use_browser-use");
      expect(output).not.toContain("browseruse_browseruse");
    });
    
    test("should have correct tool naming", async () => {
      const output = await runOpenCode(
        "List the browser-use tools and their descriptions"
      );
      
// Verify search is renamed to browserSearch
       expect(output).toContain("browserSearch");
       expect(output).not.toContain("search"); // Should be renamed in main export
    });
  });
  
  describe("Test 2: Basic Functionality", () => {
    test("should execute navigate tool successfully", async () => {
      const output = await runOpenCode(
        "Use the navigate tool to visit https://example.com and extract the page title",
        120000
      );
      
      // Should contain successful execution
      expect(output).toContain("Example Domain");
      
      // Should not contain error messages
      expect(output).not.toContain("Error:");
      expect(output).not.toContain("failed");
    });
    
    test("should return string output (not object)", async () => {
      const output = await runOpenCode(
        "Use the navigate tool to visit https://example.com",
        120000
      );
      
      // Should not have validation errors
      expect(output).not.toContain("expected string, received object");
      expect(output).not.toContain("Invalid input");
    });
  });
  
  describe("Test 3: Parameter Handling", () => {
    test("should accept and process parameters correctly", async () => {
      const output = await runOpenCode(
        "Use the screenshot tool with url='https://example.com' and useCloud=false",
        120000
      );
      
      // Should process parameters
      expect(output).toContain("example.com");
      
      // Should handle missing API key gracefully
      if (output.includes("BROWSER_USE_API_KEY")) {
        expect(output).toContain("environment variable");
      }
    });
    
    test("should handle optional parameters", async () => {
      const output = await runOpenCode(
        "Use the extractData tool to extract data from https://example.com with dataDescription='page title'",
        120000
      );
      
      // Should execute without errors
      expect(output).not.toContain("Missing required parameter");
    });
  });
  
  describe("Test 4: Error Handling", () => {
    test("should handle invalid URL gracefully", async () => {
      const output = await runOpenCode(
        "Use the extractData tool with url='not-a-valid-url' to extract data",
        120000
      );
      
      // Should return error message (not crash)
      expect(output).toContain("fail");
      
      // Should not crash
      expect(output).not.toContain("Uncaught");
      expect(output).not.toContain("TypeError");
    });
    
    test("should provide helpful error messages", async () => {
      const output = await runOpenCode(
        "Use the execute tool with an invalid task",
        120000
      );
      
      // Should contain helpful information
      if (output.includes("error") || output.includes("fail")) {
        expect(output.length).toBeGreaterThan(20); // Should have detailed message
      }
    });
    
    test("should handle missing dependencies gracefully", async () => {
      // This test checks if error messages are helpful when dependencies are missing
      const output = await runOpenCode(
        "Use the execute tool to perform a browser task",
        120000
      );
      
      // If browser-use is not installed, should have helpful message
      if (output.includes("ModuleNotFoundError") || output.includes("not installed")) {
        expect(output).toContain("pip install");
      }
    });
  });
  
  describe("Test 5: Multiple Exports", () => {
    test("should have all 6 tool variants available", async () => {
      const output = await runOpenCode(
        "Confirm that these browser-use tools are available: execute, extractData, fillForm, screenshot, navigate, browserSearch"
      );
      
      // Should confirm all tools
      expect(output).toContain("execute");
      expect(output).toContain("extractData");
      expect(output).toContain("fillForm");
      expect(output).toContain("screenshot");
      expect(output).toContain("navigate");
      expect(output).toContain("browserSearch");
    });
    
    test("should execute each variant independently", async () => {
      // Test that tools don't interfere with each other
      const navigateOutput = await runOpenCode(
        "Use navigate tool to visit https://example.com",
        120000
      );
      
      const screenshotOutput = await runOpenCode(
        "Use screenshot tool to capture https://example.com",
        120000
      );
      
      // Both should execute independently
      expect(navigateOutput).not.toBe(screenshotOutput);
    });
  });
  
  describe("Integration Tests", () => {
    test("should work with tooling agent", async () => {
      const output = await runOpenCode(
        "What browser automation capabilities do you have?"
      );
      
      expect(output).toContain("browser");
      expect(output.length).toBeGreaterThan(50);
    });
    
    test("should return consistent JSON format", async () => {
      const output = await runOpenCode(
        "Use the navigate tool to visit https://example.com",
        120000
      );
      
      // Should not have malformed JSON
      expect(output).not.toContain("}{");
      expect(output).not.toContain("undefined");
    });
  });
  
  describe("File Structure Validation", () => {
    test("should not have test files in tool directory", async () => {
      const result = await $`find ${CONFIG_DIR}/tool/browser-use -name "*.test.ts" -o -name "*.spec.ts"`.text();
      expect(result.trim()).toBe("");
    });
    
    test("should not have test directories in tool directory", async () => {
      const result = await $`find ${CONFIG_DIR}/tool/browser-use -type d -name "tests" -o -name "__tests__"`.text();
      expect(result.trim()).toBe("");
    });
    
    test("should have required files", async () => {
      const indexExists = await $`test -f ${CONFIG_DIR}/tool/browser-use/index.ts && echo "exists"`.text();
      expect(indexExists.trim()).toBe("exists");
      
      const pythonExists = await $`test -f ${CONFIG_DIR}/tool/browser-use/browser-agent.py && echo "exists"`.text();
      expect(pythonExists.trim()).toBe("exists");
    });
  });
  
  describe("Export Registration", () => {
    test("should be exported in main index.ts", async () => {
      const indexContent = await $`cat ${CONFIG_DIR}/tool/index.ts`.text();
      expect(indexContent).toContain("browser-use");
      expect(indexContent).toContain("execute");
      expect(indexContent).toContain("extractData");
      expect(indexContent).toContain("fillForm");
      expect(indexContent).toContain("screenshot");
      expect(indexContent).toContain("navigate");
      expect(indexContent).toContain("browserSearch");
    });
  });
});

/**
 * Performance Tests (Optional)
 */
describe("Performance Tests", () => {
  test("should respond within reasonable time", async () => {
    const startTime = Date.now();
    await runOpenCode("What browser-use tools do you have?", 30000);
    const duration = Date.now() - startTime;
    
    // Should respond within 30 seconds
    expect(duration).toBeLessThan(30000);
  });
});

/**
 * Security Tests (Optional)
 */
describe("Security Tests", () => {
  test("should not expose sensitive information in errors", async () => {
    const output = await runOpenCode(
      "Use the execute tool with invalid parameters",
      120000
    );
    
    // Should not expose file paths or system information
    expect(output).not.toContain("/Users/");
    expect(output).not.toContain("password");
    expect(output).not.toContain("secret");
  });
});
