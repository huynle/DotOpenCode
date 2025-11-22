# OpenCode Tools

This directory contains production-ready OpenCode tools that extend OpenCode's capabilities.

## CRITICAL: File Structure Constraints

**MANDATORY REQUIREMENT**: The `@opencode/tool/` directory and all its subdirectories MUST only contain production-ready code.

### What MUST NOT Be in @opencode/tool/

❌ **Test files** (*.test.ts, *.spec.ts, *_test.ts)
❌ **Mock files** (*.mock.ts, *_mock.ts, __mocks__/)
❌ **Test utilities** (test-helpers.ts, test-utils.ts)
❌ **Development-only code** (*.dev.ts, *.local.ts)
❌ **Example/demo files** (example.ts, demo.ts)
❌ **Build artifacts** (*.js, *.d.ts unless intentional)
❌ **Documentation tests** (doctest.ts)

### Why This Matters

OpenCode reads ALL TypeScript files (*.ts) in the `@opencode/tool/` directory during startup to discover and load tools. Including test or non-production files will:

1. **Slow down startup**: Extra files are parsed unnecessarily
2. **Cause errors**: Test code may try to import test frameworks not available in production
3. **Pollute tool namespace**: Test exports may conflict with real tools
4. **Increase memory usage**: Unnecessary code loaded into memory

### Where to Place Tests

✅ **Correct locations for test files:**

```
opencode/tool/
├── my-tool/
│   └── index.ts          # ✅ Production code only
├── another-tool/
│   └── index.ts          # ✅ Production code only
└── index.ts              # ✅ Main export file

opencode/tool/tests/      # ✅ Separate test directory
├── my-tool.test.ts
└── another-tool.test.ts

# OR outside @opencode/ entirely
tests/
└── opencode/
    └── tool/
        ├── my-tool.test.ts
        └── another-tool.test.ts
```

### Correct Tool Directory Structure

```
@opencode/tool/
├── index.ts              # Main entry point - exports all tools
├── package.json          # Dependencies for all tools
├── tsconfig.json         # TypeScript configuration
├── README.md             # This file
│
├── gemini/               # Tool subdirectory
│   └── index.ts          # Tool implementation (PRODUCTION ONLY)
│
├── env/                  # Tool subdirectory
│   └── index.ts          # Tool implementation (PRODUCTION ONLY)
│
└── url-validator/        # Tool subdirectory
    └── index.ts          # Tool implementation (PRODUCTION ONLY)
    # ❌ NO test files here!
```

## Tool Development Guidelines

### 1. Setup

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env` file:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

### 2. Production-Only Code

- Place ALL tool implementation in tool subdirectories
- Keep production code clean and focused
- Move all tests outside `@opencode/tool/` directory
- Document tool structure in tool-specific README files

### 3. Tool Export Registration

All tools MUST be exported in `@opencode/tool/index.ts` to be accessible:

```typescript
// Add your tool exports to index.ts
export {
  toolFunction1,
  toolFunction2,
  default as toolName
} from "./tool-directory"
```

See the main [Tool Development Guide](/opencode/agent/tooling.md) for complete instructions.

## Available Tools

### `/gemini` - Simple Image Editor
Edit an image using file path or data URL:

```bash
/gemini "path/to/image.png" "Add a red border around the image" "output.png"
/gemini "data:image/png;base64,AAA..." "Convert to black and white"
```

### `/gemini_multiple_edit` - Advanced Image Editor
Same functionality as `/gemini` but from the multiple tools file:

```bash
/gemini_multiple_edit "image.jpg" "Make it look like a watercolor painting" "watercolor.jpg"
```

### `/gemini_multiple_analyze` - Image Analysis
Analyze an image without editing it:

```bash
/gemini_multiple_analyze "screenshot.png" "What programming language is shown in this code?"
/gemini_multiple_analyze "photo.jpg" "Describe the objects and colors in this image"
```

### `/gemini_edit` - Auto-Detection Plugin
1. Paste an image directly into your OpenCode chat
2. Use the command with just the prompt:

```bash
/gemini_edit "Add the text 'Hello World' in cursive at top"
/gemini_edit "Make this image look like a painting"
```

## Features

- **File Path Support**: Pass local image file paths
- **Data URL Support**: Use base64 data URLs from pasted images
- **Auto-Detection**: Plugin automatically captures the latest pasted image
- **Image Analysis**: Ask questions about images without editing
- **Flexible Output**: Specify custom output filenames or use defaults
- **Error Handling**: Clear error messages for missing API keys or failed requests

## Validation and Quality Assurance

When creating tools, the tooling agent will:

1. **Verify File Structure**: Check that no test files exist in `@opencode/tool/` directories
2. **Warn on Non-Production Files**: Alert if test, mock, or development files are detected
3. **Enforce Export Registration**: Ensure tools are properly exported in index.ts
4. **CLI Testing**: Validate tools using real `opencode` CLI with `OPENCODE_CONFIG_DIR`

## Troubleshooting

### Tool Not Loading

If your tool doesn't appear in OpenCode:

1. ✅ Verify tool is exported in `@opencode/tool/index.ts`
2. ✅ Check no test files exist in tool directory
3. ✅ Ensure all production code is in tool subdirectory
4. ✅ Restart OpenCode after adding new tools
5. ✅ Run validation: `OPENCODE_CONFIG_DIR="..." opencode run "What tools do you have?" --agent general`

### Slow Startup

If OpenCode starts slowly:

1. Check for test files in `@opencode/tool/` directories
2. Remove any non-production files from tool subdirectories
3. Move tests to separate test directories
4. Keep tool implementation minimal and focused

## Examples

```bash
# Edit an image
/gemini "logo.png" "Add a subtle drop shadow" "logo-shadow.png"

# Analyze code in a screenshot
/gemini_multiple_analyze "code-screenshot.png" "What bugs can you spot in this code?"

# Auto-edit pasted image
# (paste image first, then run:)
/gemini_edit "Remove the background and make it transparent"
```