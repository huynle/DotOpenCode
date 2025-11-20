# AGENTS.md

## Build Commands

### TypeScript/JavaScript
- **Build**: `bun build index.ts --outdir dist` (for tools/plugins)
- **Type Check**: `tsc --noEmit` or `bun run type-check`
- **Test**: `bun test.ts` or `bun run test`
- **Test Single File**: `bun test path/to/specific.test.ts`

### Bash Scripts
- **Syntax Check**: `bash -n script.sh`
- **Test Compatibility**: `bash scripts/tests/test-compatibility.sh`
- **Validate Components**: `./scripts/validate-component.sh`

## Code Style Guidelines

### File Naming
- **Files**: kebab-case (`my-new-agent.md`, `telegram-bot.ts`)
- **Types/Interfaces**: PascalCase (`MyComponentProps`)
- **Variables/Functions**: camelCase (`myFunction`, `userName`)

### TypeScript
- Use ES modules (`"type": "module"`)
- Target ES2022, use ESNext modules
- Include JSDoc comments for all exports
- Use explicit types (avoid `any`)
- Export functions explicitly

### Markdown (Agents/Commands)
- YAML frontmatter required with `description`
- Agents need `mode` field in frontmatter
- Use clear headings and code blocks with syntax highlighting
- Include examples and usage instructions

### Bash
- Use `set -e` for error handling
- Add comments for complex logic
- Include help text and usage examples
- Use meaningful variable names

### Error Handling
- TypeScript: Use proper error boundaries and type guards
- Bash: Use `set -e` and check command exit codes
- Always validate inputs and provide helpful error messages