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

// Crawl4AI web crawling tools
export {
  crawl,             // Simple single-page crawling
  deepCrawlTool,     // Advanced multi-page crawling with strategies
  download,           // File downloading with filtering
  analyzeContent,      // Content analysis and extraction (renamed to avoid conflict)
  default as crawl4ai  // Default export (crawl tool)
} from "./crawl4ai"

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