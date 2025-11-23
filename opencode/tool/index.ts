/**
 * OpenCode Gemini Tool - Main entry point
 * 
 * This module provides image generation, editing, and analysis capabilities
 * using Google's Gemini AI models, along with environment variable utilities.
 */

// Gemini AI image tools
export {
  generate,           // Generate images from text prompts
  edit,              // Edit existing images with text instructions
  analyze,           // Analyze images and answer questions about them
  generateImage,     // Core image generation function
  editImage,         // Core image editing function
  analyzeImage,      // Core image analysis function
  default as gemini  // Default export (edit tool)
} from "./gemini"

// Environment variable utilities
export {
  loadEnvVariables,
  getEnvVariable,
  getRequiredEnvVariable,
  getRequiredEnvVariables,
  getApiKey,
  type EnvLoaderConfig
} from "./env"

// URL validation tools
export {
  validate,           // Validate URLs for format, security, and accessibility
  checkAccessibility, // Check if URL is accessible
  default as urlValidator  // Default export (validate tool)
} from "./url-validator"

// Crawl4AI web crawling and content extraction tools
export {
  crawl,              // Main web crawling function
  firstLink,          // Get first link from search query
  analyze as analyzeWeb,  // Content analysis and structured data extraction
  crawlUrl,           // Core crawling function
  default as crawl4ai // Default export (crawl tool)
} from "./crawl4ai"
