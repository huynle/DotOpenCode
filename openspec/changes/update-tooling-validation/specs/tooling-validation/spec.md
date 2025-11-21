# Tooling Agent Validation Enhancement Specification

## ADDED Requirements

### Requirement: Environment Config Detection
The tooling agent MUST detect and use `OPENCODE_CONFIG_DIR` environment variable when performing tool validation, ensuring tools are tested against the correct configuration directory.

#### Scenario:
When a developer is working on a new tool in a feature worktree and sets `OPENCODE_CONFIG_DIR=/path/to/feature/@opencode`, the tooling agent should automatically detect this and validate the tool using that specific config directory instead of the global `~/.config/opencode`.

### Requirement: Config Directory Parameter Passing
The tooling agent MUST pass the detected config directory to the validator subagent, enabling CLI commands to use the appropriate OpenCode configuration.

#### Scenario:
When invoking the validator subagent, the tooling agent should include the config directory information so that all `opencode run` commands use `--config /path/to/config` flag.

### Requirement: Isolated Validation Testing
The tooling agent MUST support isolated validation testing using custom config directories, enabling developers to test tools in feature worktrees without affecting the global configuration.

#### Scenario:
A developer creates a new tool in a feature worktree and wants to validate it without installing it globally. They set `OPENCODE_CONFIG_DIR` to point to their feature's `@opencode/` folder and run validation.

### Requirement: Backwards Compatibility
The tooling agent MUST maintain backwards compatibility with existing workflows when `OPENCODE_CONFIG_DIR` is not set.

#### Scenario:
Existing users who don't use `OPENCODE_CONFIG_DIR` should continue to have their tools validated against the global configuration as before.

## MODIFIED Requirements

### Requirement: Validation Workflow
The tooling agent MUST update the validation workflow to incorporate config directory detection and usage throughout the validation process.

#### Scenario:
When a developer runs validation in Phase 4 of tool creation, the workflow MUST detect `OPENCODE_CONFIG_DIR` and use it for all validation steps, providing clear feedback about which config directory is being used.

### Requirement: CLI Test Commands
The validator subagent MUST modify all CLI test commands to support custom config directories.

#### Scenario:
When the validator subagent runs `opencode run` commands, it MUST include `--config` flag when a custom config directory is detected, ensuring tools are tested against the correct configuration.

## REMOVED Requirements

None - this enhancement adds new capabilities without removing existing functionality.