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

// Google Search tool
export {
  search,             // Perform real-time internet research using Google Search
  default as googleSearch  // Default export (search tool)
} from "./google-search"

// Browser-Use automation tools
export {
  execute,            // Execute browser automation tasks
  extractData,        // Extract data from webpages
  fillForm,           // Fill out web forms
  screenshot,         // Take screenshots
  navigate,           // Navigate and extract content
  search as browserSearch,  // Perform web searches
  default as browserUse  // Default export (execute tool)
} from "./browser-use"