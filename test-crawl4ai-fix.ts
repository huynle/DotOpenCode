import crawl4ai from "./opencode/tool/crawl4ai/index.ts"

const result = await crawl4ai.execute({ url: "https://example.com" }, {} as any)
console.log("Result:", result)
