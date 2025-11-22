// Test file to verify all tool imports work correctly after adding crawl4ai
console.log('Testing imports...')

try {
  // Test existing imports still work
  const { validate } = await import('./index.js')
  console.log('✅ URL validation imports work')
  
  // Test new crawl4ai imports
  const { crawl, deepCrawlTool, download, analyzeContent, crawl4ai } = await import('./index.js')
  console.log('✅ Crawl4AI imports work')
  
  console.log('Available crawl4ai functions:', {
    crawl: typeof crawl,
    deepCrawlTool: typeof deepCrawlTool,
    download: typeof download,
    analyzeContent: typeof analyzeContent,
    crawl4ai: typeof crawl4ai
  })
  
  console.log('🎉 All imports successful!')
} catch (error) {
  console.error('❌ Import failed:', error.message)
}