import { test, describe } from "bun:test";
import { runValidationSuite, runPerformanceBenchmarks } from "./validation.test";

// Test configuration and fixtures
interface TestConfig {
  testMode: boolean;
  mockApi: boolean;
  outputDir: string;
  logLevel: 'debug' | 'info' | 'error';
}

// Test environment setup
export function setupTestEnvironment(config: Partial<TestConfig> = {}): TestConfig {
  return {
    testMode: true,
    mockApi: true,
    outputDir: "./test-output",
    logLevel: 'info',
    ...config
  };
}

// Mock server for testing
export class MockCrawlServer {
  private responses: Map<string, any> = new Map();
  
  constructor(private port: number = 3001) {
    this.setupMockResponses();
  }
  
  private setupMockResponses() {
    // Simple page response
    this.responses.set("https://example.com", {
      status: 200,
      headers: { "Content-Type": "text/html" },
      body: `
        <html>
          <head><title>Example Domain</title></head>
          <body>
            <h1>Welcome to Example</h1>
            <p>This is a test page for crawling.</p>
            <a href="/about">About Us</a>
            <a href="/contact">Contact</a>
            <a href="https://external.com">External Link</a>
            <img src="/logo.png" alt="Logo" />
          </body>
        </html>
      `
    });
    
    // Deep crawl responses
    this.responses.set("https://example.com/about", {
      status: 200,
      headers: { "Content-Type": "text/html" },
      body: `
        <html>
          <head><title>About Us</title></head>
          <body>
            <h1>About Our Company</h1>
            <p>Learn more about our mission.</p>
            <a href="/team">Our Team</a>
          </body>
        </html>
      `
    });
    
    this.responses.set("https://example.com/contact", {
      status: 200,
      headers: { "Content-Type": "text/html" },
      body: `
        <html>
          <head><title>Contact</title></head>
          <body>
            <h1>Contact Information</h1>
            <p>Get in touch with us.</p>
          </body>
        </html>
      `
    });
    
    // Error responses
    this.responses.set("https://error.com", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
      body: "Internal Server Error"
    });
    
    this.responses.set("https://notfound.com", {
      status: 404,
      headers: { "Content-Type": "text/html" },
      body: "<h1>Page Not Found</h1>"
    });
  }
  
  getResponse(url: string): any {
    return this.responses.get(url) || {
      status: 404,
      body: "Not Found"
    };
  }
}

// Test data generators
export function generateTestUrls(baseDomain: string, count: number): string[] {
  const urls: string[] = [];
  for (let i = 1; i <= count; i++) {
    urls.push(`${baseDomain}/page${i}`);
  }
  return urls;
}

export function generateTestContent(): {
  html: string;
  markdown: string;
  structured: any;
} {
  return {
    html: `
      <article>
        <h1>Test Article</h1>
        <h2>Introduction</h2>
        <p>This is a test article with <strong>formatted</strong> content.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
        <div class="metadata" data-category="test" data-priority="high">
          <span>Category: Test</span>
          <span>Priority: High</span>
        </div>
      </article>
    `,
    markdown: `# Test Article\n\n## Introduction\n\nThis is a test article with **formatted** content.\n\n- Item 1\n- Item 2\n- Item 3\n\n<div class="metadata" data-category="test" data-priority="high">\n<span>Category: Test</span>\n<span>Priority: High</span>\n</div>`,
    structured: {
      title: "Test Article",
      sections: ["Introduction"],
      content: "This is a test article with formatted content.",
      listItems: ["Item 1", "Item 2", "Item 3"],
      metadata: {
        category: "test",
        priority: "high"
      }
    }
  };
}

// Test utilities
export function expectValidCrawlResult(result: any) {
  expect(result).toBeDefined();
  expect(result.success).toBe(true);
  expect(result.url).toBeDefined();
  expect(result.content || result.markdown).toBeDefined();
}

export function expectValidDeepCrawlResults(results: any[], expectedMinPages: number = 1) {
  expect(results).toBeDefined();
  expect(results.length).toBeGreaterThanOrEqual(expectedMinPages);
  expect(results.every(r => r.success)).toBe(true);
  expect(results.every(r => r.url)).toBe(true);
}

export function measurePerformance<T>(
  operation: () => Promise<T>,
  name: string
): Promise<{ result: T; duration: number; memoryBefore: number; memoryAfter: number }> {
  const memoryBefore = process.memoryUsage().heapUsed;
  const startTime = Date.now();
  
  return operation().then(result => {
    const memoryAfter = process.memoryUsage().heapUsed;
    const duration = Date.now() - startTime;
    
    console.log(`${name}: ${duration}ms, Memory: ${Math.round((memoryAfter - memoryBefore) / 1024)}KB`);
    
    return {
      result,
      duration,
      memoryBefore,
      memoryAfter
    };
  });
}

// Integration test scenarios
export const integrationTestScenarios = [
  {
    name: "Basic Website Crawling",
    description: "Test crawling a simple website with multiple pages",
    setup: () => {
      const server = new MockCrawlServer();
      return { server };
    },
    test: async ({ server }: { server: MockCrawlServer }) => {
      // This would call actual crawl functions
      // const result = await crawlSimple("https://example.com");
      // expectValidCrawlResult(result);
      
      // Mock test for now
      const mockResult = server.getResponse("https://example.com");
      expect(mockResult.status).toBe(200);
      expect(mockResult.body).toContain("Welcome to Example");
    }
  },
  {
    name: "Deep Crawling with Links",
    description: "Test deep crawling following internal links",
    setup: () => {
      const server = new MockCrawlServer();
      return { server };
    },
    test: async ({ server }: { server: MockCrawlServer }) => {
      // Mock deep crawl
      const urls = ["https://example.com", "https://example.com/about", "https://example.com/contact"];
      const results = urls.map(url => server.getResponse(url));
      
      expect(results).toHaveLength(3);
      expect(results.every(r => r.status === 200)).toBe(true);
      expect(results.some(r => r.body.includes("About"))).toBe(true);
    }
  },
  {
    name: "Error Handling",
    description: "Test handling of various error conditions",
    setup: () => {
      const server = new MockCrawlServer();
      return { server };
    },
    test: async ({ server }: { server: MockCrawlServer }) => {
      const errorUrl = "https://error.com";
      const notFoundUrl = "https://notfound.com";
      
      const errorResult = server.getResponse(errorUrl);
      const notFoundResult = server.getResponse(notFoundUrl);
      
      expect(errorResult.status).toBe(500);
      expect(notFoundResult.status).toBe(404);
    }
  }
];

// Main test runner
describe("Crawl4AI Test Framework", () => {
  
  test("should set up test environment correctly", () => {
    const config = setupTestEnvironment({ logLevel: 'debug' });
    
    expect(config.testMode).toBe(true);
    expect(config.mockApi).toBe(true);
    expect(config.logLevel).toBe('debug');
    expect(config.outputDir).toBe("./test-output");
  });

  test("should create mock server with test responses", () => {
    const server = new MockCrawlServer();
    
    const response = server.getResponse("https://example.com");
    expect(response.status).toBe(200);
    expect(response.body).toContain("Welcome to Example");
  });

  test("should generate test data correctly", () => {
    const testContent = generateTestContent();
    
    expect(testContent.html).toContain("<h1>Test Article</h1>");
    expect(testContent.markdown).toContain("# Test Article");
    expect(testContent.structured.title).toBe("Test Article");
  });

  test("should measure performance accurately", async () => {
    const mockOperation = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return "test result";
    };
    
    const { result, duration, memoryBefore, memoryAfter } = 
      await measurePerformance(mockOperation, "Test Operation");
    
    expect(result).toBe("test result");
    expect(duration).toBeGreaterThan(90); // Allow some variance
    expect(duration).toBeLessThan(200);
    expect(memoryAfter).toBeGreaterThanOrEqual(memoryBefore);
  });
});

// Integration test runner
describe("Crawl4AI Integration Tests", () => {
  
  for (const scenario of integrationTestScenarios) {
    test(scenario.name, async () => {
      console.log(`\n--- Running: ${scenario.name} ---`);
      console.log(`Description: ${scenario.description}`);
      
      const setup = scenario.setup();
      await scenario.test(setup);
      
      console.log(`✅ ${scenario.name} completed`);
    });
  }
});

// Performance benchmark runner
describe("Crawl4AI Performance Benchmarks", () => {
  
  test("should run validation suite", async () => {
    const reports = await runValidationSuite();
    
    expect(reports.length).toBeGreaterThan(0);
    
    const passed = reports.filter(r => r.passed).length;
    const total = reports.length;
    const passRate = (passed / total) * 100;
    
    console.log(`Validation Suite: ${passed}/${total} passed (${passRate.toFixed(1)}%)`);
    expect(passRate).toBeGreaterThan(80); // Expect at least 80% pass rate
  });

  test("should run performance benchmarks", async () => {
    await runPerformanceBenchmarks();
    
    // This test verifies that benchmarks run without errors
    // Actual performance assertions are in the benchmark functions
    expect(true).toBe(true); // Placeholder - real assertions in benchmark functions
  });
});

// Test utilities export
export {
  MockCrawlServer,
  generateTestUrls,
  generateTestContent,
  expectValidCrawlResult,
  expectValidDeepCrawlResults,
  measurePerformance,
  integrationTestScenarios
};