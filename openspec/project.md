# Project Context

## Purpose
OpenAgents is an AI agent framework for plan-first development workflows with approval-based execution. It provides a comprehensive system of AI agents, subagents, commands, and tools that work with the OpenCode CLI to enable intelligent software development across multiple programming languages. The project aims to make AI-assisted development more structured, safe, and effective by implementing approval-first workflows and specialized agents for different development tasks.

## Tech Stack
- **TypeScript** - Primary language for tools, plugins, and agent implementations
- **Bun** - Runtime and build tool for TypeScript projects
- **Node.js** - Runtime environment for OpenCode CLI integration
- **Markdown** - Agent and command definitions with YAML frontmatter
- **Bash** - Installation scripts and validation tools
- **JSON** - Component registry and configuration files
- **Git** - Version control and workflow management
- **Git Worktree** - Parallel development trees for feature isolation

### Key Dependencies
- `@opencode-ai/sdk` (v0.10.0) - OpenCode integration
- `@opencode-ai/plugin` (v0.10.0) - Plugin development framework
- `zod` (v4.1.9) - Schema validation
- `@types/node` (v24.2.1) - TypeScript definitions

## Project Conventions

### Code Style
- **File Naming**: kebab-case for files (`my-new-agent.md`, `telegram-bot.ts`)
- **Types/Interfaces**: PascalCase (`MyComponentProps`)
- **Variables/Functions**: camelCase (`myFunction`, `userName`)
- **ES Modules**: Use `"type": "module"` in package.json
- **TypeScript**: Target ES2022, explicit types (avoid `any`), JSDoc comments for exports
- **Markdown**: YAML frontmatter required with `description` field, agents need `mode` field

### Architecture Patterns
- **Agent-First Design**: Universal agents coordinate specialized subagents ([Agent Design Guide](https://opencode.ai/docs/agents/))
- **Context-Aware System**: Agents load patterns from `.opencode/context/` automatically
- **Approval-First Workflow**: Plans are proposed before execution
- **Modular Components**: Registry-based component management with dependencies
- **Plugin Architecture**: Extensible tools and plugins for external integrations ([Custom Tools Guide](https://opencode.ai/docs/custom-tools/))

### Testing Strategy
- **TypeScript**: `tsc --noEmit` or `bun run type-check` for static analysis
- **Unit Tests**: `bun test.ts` or `bun run test` for component testing
- **Compatibility**: `bash scripts/tests/test-compatibility.sh` for cross-platform validation
- **Component Validation**: `./scripts/validate-component.sh` for registry consistency
- **Tool Testing**: Reference [Tools Documentation](https://opencode.ai/docs/tools/) for built-in tool testing patterns

### Git Workflow
- **Main Branch**: `main` for stable releases
- **Feature Branches**: Topic branches for development
- **Conventional Commits**: Use `/commit` command for smart commit messages ([Commands Guide](https://opencode.ai/docs/commands/))
- **Pull Requests**: Required for contributions with code review
- **GitHub Integration**: Leverage [GitHub Documentation](https://opencode.ai/docs/github/) for workflow automation
- **Git Worktree Strategy**: Use git worktrees for isolated feature development

### Git Worktree Development Workflow
- **Global Config**: `@opencode/` is symlinked to `$HOME/.config/opencode` (global OpenCode project)
- **Feature Worktrees**: Create new worktrees for each proposal with `git worktree add ../feature-tree1`
- **Testing Isolation**: Test OpenCode commands/agents/tools using `export OPENCODE_CONFIG_DIR=/path/to/feature/config`
- **Command Testing**: Run `opencode run "hello world"` with custom config directory for feature testing
- **Worktree Management**: Use `/worktrees` command for managing multiple development trees
- **Merge Requirement**: **CRITICAL** - Only after completion of a proposal with thorough testing and validation using isolated `OPENCODE_CONFIG_DIR` environment variable is a git worktree feature merged into `main` branch. This is crucial to keep the project stable.

## Domain Context
OpenAgents operates in the AI-assisted software development domain, specifically:
- **Multi-Language Support**: TypeScript, Python, Go, Rust, and more
- **OpenCode Integration**: Works as a plugin system for the OpenCode CLI ([OpenCode Docs](https://opencode.ai/docs/))
- **Plan-First Development**: Emphasizes planning and approval before execution
- **Quality Assurance**: Built-in testing, code review, and validation
- **Context Awareness**: Agents adapt to project-specific patterns and standards
- **Agent Configuration**: Follow [Agent Configuration Patterns](https://opencode.ai/docs/agents/#tools) for tool permissions and modes

## Important Constraints
- **OpenCode Dependency**: Requires OpenCode CLI to function
- **Cross-Platform**: Must work on macOS, Linux, and Windows (Git Bash/WSL)
- **Bash 3.2+**: Minimum bash version for script compatibility
- **Security**: No secrets in code, environment variables for sensitive data
- **Approval Workflow**: Must maintain user approval before executing changes
- **Registry Consistency**: All components must be registered in registry.json
- **Worktree Testing**: All OpenCode commands/agents/tools must be tested in isolated worktrees using `OPENCODE_CONFIG_DIR`
- **Merge Validation**: **MANDATORY** - Features must undergo complete testing and validation in isolated worktrees before any merge to `main` branch
- **Stability First**: Project stability is maintained by strict enforcement of isolated testing workflow
- **Symlink Management**: `@opencode/` symlink to `$HOME/.config/opencode` must be maintained for global config access

## External Dependencies
- **OpenCode CLI**: Core AI assistant platform ([Official Documentation](https://opencode.ai/docs/))
- **Telegram API**: Optional notification system via bot integration
- **Gemini AI**: Optional image generation and editing capabilities
- **GitHub**: Repository hosting and CI/CD workflows ([GitHub Integration Guide](https://opencode.ai/docs/github/))
- **Node Package Registry**: Distribution of TypeScript dependencies
- **Bun Runtime**: Build tool and JavaScript runtime
- **MCP Servers**: Potential integration with [MCP Servers](https://opencode.ai/docs/mcp-servers/) for external services

## Documentation References

### Core OpenCode Documentation
- **Getting Started**: [https://opencode.ai/docs/](https://opencode.ai/docs/)
- **Agents**: [https://opencode.ai/docs/agents/](https://opencode.ai/docs/agents/)
- **Tools**: [https://opencode.ai/docs/tools/](https://opencode.ai/docs/tools/)
- **Commands**: [https://opencode.ai/docs/commands/](https://opencode.ai/docs/commands/)
- **Configuration**: [https://opencode.ai/docs/config/](https://opencode.ai/docs/config/)

### Development References
- **Custom Tools**: [https://opencode.ai/docs/custom-tools/](https://opencode.ai/docs/custom-tools/)
- **MCP Servers**: [https://opencode.ai/docs/mcp-servers/](https://opencode.ai/docs/mcp-servers/)
- **Permissions**: [https://opencode.ai/docs/permissions/](https://opencode.ai/docs/permissions/)
- **LSP Servers**: [https://opencode.ai/docs/lsp/](https://opencode.ai/docs/lsp/)

### Integration Guides
- **GitHub**: [https://opencode.ai/docs/github/](https://opencode.ai/docs/github/)
- **GitLab**: [https://opencode.ai/docs/gitlab/](https://opencode.ai/docs/gitlab/)
- **IDE Integration**: [https://opencode.ai/docs/ide/](https://opencode.ai/docs/ide/)
- **TUI**: [https://opencode.ai/docs/tui/](https://opencode.ai/docs/tui/)
