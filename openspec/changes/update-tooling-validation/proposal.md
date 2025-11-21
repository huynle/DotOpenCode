# Update Tooling Agent Validation with OPENCODE_CONFIG_DIR

## Why
The current tooling agent and its validator subagent do not use `OPENCODE_CONFIG_DIR` environment variable when testing newly created tools. This leads to testing tools in the global config (`~/.config/opencode`) instead of the current project's `@opencode/` folder, which is problematic for:

1. **Feature Development**: When developing tools in feature branches/worktrees, validation should test against the current `@opencode/` folder, not the global config
2. **Isolation**: Tools should be tested in isolation using the project's own opencode configuration
3. **Consistency**: The project documentation emphasizes using `OPENCODE_CONFIG_DIR` for testing, but the tooling agent doesn't follow this practice

## What Changes
Update the tooling agent and validator subagent to:

1. **Environment Detection**: Check for `OPENCODE_CONFIG_DIR` environment variable before validation
2. **Config Directory Resolution**: Use the detected config directory or fallback to current `@opencode/` folder
3. **CLI Command Updates**: Modify all `opencode run` commands to use the appropriate config directory
4. **Path Resolution**: Update tool location detection to work with custom config directories

## Impact
- **Positive**: Ensures tools are tested against the correct configuration during development
- **Positive**: Maintains isolation between feature development and production tools
- **Positive**: Aligns tooling agent behavior with project documentation and best practices
- **Minimal**: Changes are isolated to validation logic, no impact on tool creation functionality
- **Backwards Compatible**: Still works with existing global config when `OPENCODE_CONFIG_DIR` is not set

## Scope
This change affects:
- `opencode/agent/tooling.md` - Main tooling agent validation workflow
- `opencode/agent/subagents/tooling/validator.md` - CLI validation commands
- Validation test commands and environment setup

The change does not affect:
- Tool creation process
- Tool implementation
- Other subagents (analyzer, documenter)
- OpenCode CLI functionality