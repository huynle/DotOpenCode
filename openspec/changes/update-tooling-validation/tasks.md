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

### Phase 7: Real CLI Testing Enforcement
- [x] Update validator subagent to REQUIRE actual `opencode` CLI execution with `OPENCODE_CONFIG_DIR`
- [x] Add validation checks to ensure real CLI commands are being executed, not simulations
- [x] Update all test commands to use `OPENCODE_CONFIG_DIR=/path/to/config opencode run` format
- [x] Document the CLI testing requirements in validator documentation

### Phase 8: Tool Export Registration
- [x] Update tooling agent to automatically add exports to `@opencode/tool/index.ts`
- [x] Create export registration templates for different tool types
- [x] Add validation step to verify tool exports are present and correct
- [x] Test tool accessibility after export registration
- [x] Update documentation with export registration examples

### Phase 9: File Structure Enforcement
- [x] Document file structure constraints in `@opencode/tool/README.md`
- [x] Add validation checks to detect test files in `@opencode/tool/` directory
- [x] Create warnings when non-production files are detected in tool directories
- [x] Update tooling agent documentation to emphasize production-only code requirement
- [x] Add examples of correct tool directory structure with tests placed separately

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
- **NEW**: Real `opencode` CLI commands are executed with `OPENCODE_CONFIG_DIR` set
- **NEW**: Tools are properly exported in `@opencode/tool/index.ts` and accessible
- **NEW**: File structure constraints are documented and enforced
- **NEW**: No test or mock code exists within `@opencode/tool/` directories