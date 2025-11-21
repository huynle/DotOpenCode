# Update Tooling Agent Validation Tasks

## Implementation Tasks

### Phase 1: Environment Detection and Setup
- [x] Add environment detection logic to tooling agent for `OPENCODE_CONFIG_DIR`
- [x] Create config directory resolution function with fallback to current `@opencode/`
- [x] Update tooling agent validation workflow to use detected config directory
- [x] Test environment detection with various scenarios

### Phase 2: Validator Subagent Updates
- [x] Update validator subagent to accept and use config directory parameter
- [x] Modify all `opencode run` commands to include `--config` flag when needed
- [x] Update tool location detection to work with custom config directories
- [x] Add config directory validation to pre-flight checks

### Phase 3: CLI Command Integration
- [x] Update all validation test commands to use appropriate config directory
- [x] Modify tool discovery tests to work with custom config paths
- [x] Update error handling for config directory issues
- [x] Test CLI commands with both global and project-specific configs

### Phase 4: Documentation and Examples
- [x] Update tooling agent documentation to reflect `OPENCODE_CONFIG_DIR` usage
- [x] Add examples of testing tools in feature worktrees
- [x] Update validator subagent documentation with new parameters
- [x] Create troubleshooting guide for config directory issues

### Phase 5: Testing and Validation
- [x] Test validation workflow with `OPENCODE_CONFIG_DIR` set to current `@opencode/`
- [x] Test validation workflow with `OPENCODE_CONFIG_DIR` set to feature worktree
- [x] Test validation workflow without `OPENCODE_CONFIG_DIR` (fallback behavior)
- [x] Verify backwards compatibility with existing global config setup
- [x] Run full validation test suite on existing tools

### Phase 6: Integration Testing
- [x] Test complete tool creation workflow with updated validation
- [x] Validate tool testing in isolated git worktrees
- [x] Test with multiple concurrent config directories
- [x] Verify tool isolation and no cross-contamination between configs

## Dependencies
- Requires understanding of current `@opencode/` symlink structure
- Needs testing with actual git worktree setup
- Depends on OpenCode CLI `--config` flag availability and behavior

## Validation Criteria
- Tools are tested against correct config directory
- No impact on existing global config workflow
- Proper error handling for invalid config directories
- Clear documentation and examples provided
- All existing validation tests still pass