# TOOLING Agent Implementation Proposal

## Executive Summary

This proposal outlines the creation of a specialized TOOLING agent for OpenCode that focuses on
creating high-quality, production-ready tools. This agent will capture all foundational steps, best
practices, and patterns for tool development within the OpenCode ecosystem.

## Purpose

Create a specialized agent that serves as the definitive tool development authority within
OpenCode, capable of:

- **Tool Architecture Design** - Designing scalable, maintainable tool structures
- **Implementation Guidance** - Step-by-step tool development with best practices
- **Testing Framework Creation** - Automated testing strategies for tool validation
- **Integration Support** - Seamless OpenCode integration following established patterns
- **Documentation Generation** - Comprehensive tool documentation and examples

## Core Responsibilities

### 1. Tool Architecture & Design
- Analyze requirements and design optimal tool architecture
- Create modular, extensible tool structures
- Establish data models and interfaces
- Design configuration management systems
- Plan error handling and validation strategies

### 2. Implementation Guidance
- Provide step-by-step implementation workflows
- Generate boilerplate code and templates
- Guide dependency management and package configuration
- Establish coding standards and conventions
- Create build and deployment processes

### 3. Testing Framework Development
- Design comprehensive testing strategies
- Create unit test templates and utilities
- Establish integration testing patterns
- Develop performance benchmarking tools
- Create validation and quality assurance processes

### 4. OpenCode Integration
- Ensure compliance with OpenCode tool SDK patterns
- Implement proper tool exports and interfaces
- Create configuration and environment management
- Establish error handling and user feedback systems
- Design plugin architecture compatibility

### 5. Documentation & Examples
- Generate comprehensive tool documentation
- Create usage examples and tutorials
- Develop API reference materials
- Establish troubleshooting guides
- Create best practice documentation

## Technical Architecture

### Agent Capabilities

#### Core Tool Development Functions ```typescript interface ToolDesign { name: string;
description: string; version: string; dependencies: Dependency[]; interfaces: ToolInterface[];
configuration: ToolConfig; }

interface ImplementationPlan { phases: DevelopmentPhase[]; milestones: Milestone[]; deliverables:
Deliverable[]; timeline: ProjectTimeline; }

// Tool design and architecture export const designTool = tool({ description: "Design architecture
for new OpenCode tool", args: { requirements: tool.schema.string().describe("Tool requirements and
specifications"), similarTools: tool.schema.array().optional().describe("Similar existing tools for
reference"), constraints: tool.schema.array().optional().describe("Technical constraints and
limitations") }, async execute(args, context) { // Implementation } });

// Implementation guidance export const implementTool = tool({ description: "Provide step-by-step
tool implementation guidance", args: { design: tool.schema.object().describe("Tool design
specification"), phase: tool.schema.enum(['planning', 'implementation', 'testing',
'deployment']).describe("Current development phase"), environment:
tool.schema.string().optional().describe("Development environment setup") }, async execute(args,
context) { // Implementation } }); ```

#### Testing Framework Creation ```typescript interface TestingStrategy { unitTests: TestSuite[];
integrationTests: TestSuite[]; performanceTests: PerformanceBenchmark[]; validationCriteria:
ValidationCriteria[]; }

export const createTestFramework = tool({ description: "Create comprehensive testing framework for
tool validation", args: { toolSpec: tool.schema.object().describe("Tool specification for
testing"), testTypes: tool.schema.array().describe("Types of tests to create"), coverage:
tool.schema.number().optional().describe("Target test coverage percentage") }, async execute(args,
context) { // Implementation } }); ```

#### Documentation Generation ```typescript interface DocumentationPlan { userGuide:
UserGuideSection[]; apiReference: APIReferenceEntry[]; examples: CodeExample[]; troubleshooting:
TroubleshootingGuide[]; }

export const generateDocumentation = tool({ description: "Generate comprehensive documentation for
OpenCode tools", args: { toolCode: tool.schema.string().describe("Tool source code for analysis"),
docType: tool.schema.enum(['user-guide', 'api-reference', 'examples',
'troubleshooting']).describe("Type of documentation to generate"), audience:
tool.schema.enum(['beginners', 'advanced', 'contributors']).describe("Target audience") }, async
execute(args, context) { // Implementation } }); ```

### Knowledge Base & Patterns

#### Tool Development Patterns
- **Modular Architecture** - Separation of concerns, reusable components
- **Configuration Management** - Environment variables, user preferences, defaults
- **Error Handling** - Graceful degradation, clear error messages
- **Testing Strategies** - Unit, integration, performance, validation
- **Documentation Standards** - Clear examples, API references, troubleshooting

#### OpenCode Integration Patterns
- **SDK Usage** - Proper use of `@opencode-ai/plugin/tool`
- **Schema Validation** - Zod schemas for argument validation
- **Tool Exports** - Multiple tool interfaces from single implementation
- **Environment Management** - Test modes, API key handling, configuration
- **Build Processes** - TypeScript compilation, dependency management

#### Best Practices Library
- **Code Organization** - File structure, naming conventions, imports
- **Performance Optimization** - Memory management, async operations, caching
- **Security Considerations** - Input validation, secret management, safe defaults
- **Maintainability** - Code comments, type safety, error handling
- **User Experience** - Clear error messages, progress indicators, help text

## Implementation Plan

### Phase 1: Foundation (Week 1)
1. **Agent Core Development**
   - Basic tool design functions
   - Implementation guidance framework
   - OpenCode pattern integration
   - Error handling and validation

2. **Knowledge Base Creation**
   - Tool development patterns documentation
   - OpenCode integration guidelines
   - Best practices library
   - Common templates and boilerplates

### Phase 2: Advanced Features (Week 2)
1. **Testing Framework Development**
   - Test strategy creation tools
   - Automated test generation
   - Performance benchmarking utilities
   - Validation criteria definition

2. **Documentation Generation**
   - Automated documentation creation
   - Example generation tools
   - API reference generation
   - Troubleshooting guide creation

### Phase 3: Integration & Polish (Week 3)
1. **Advanced Capabilities**
   - Multi-tool project management
   - Dependency analysis and optimization
   - Performance profiling tools
   - Security audit capabilities

2. **User Experience Enhancement**
   - Interactive tool development wizards
   - Progress tracking and reporting
   - Error recovery and suggestions
   - Learning and recommendation system

### Phase 4: Production Readiness (Week 4)
1. **Quality Assurance**
   - Comprehensive testing of agent capabilities
   - Validation against real tool development scenarios
   - Performance optimization and tuning
   - Security review and hardening

2. **Documentation & Training**
   - Complete user documentation
   - Tutorial and example creation
   - Video guide development
   - Community support setup

## Technical Requirements

### Dependencies ```json { "dependencies": { "@opencode-ai/sdk": "^0.10.0", "@opencode-ai/plugin":
"^0.10.0", "zod": "^4.1.9", "typescript": "^5.0.0" }, "devDependencies": { "@types/node":
"^24.2.1", "bun-types": "latest" } } ```

### File Structure ``` opencode/agent/subagents/tooling/ ├── tooling-agent.md              # Main
agent definition ├── src/ │   ├── core/                    # Core tooling functions │   │   ├──
designer.ts           # Tool architecture design │   │   ├── implementer.ts        # Implementation
guidance │   │   ├── tester.ts            # Testing framework creation │   │   └── documenter.ts
# Documentation generation │   ├── patterns/                 # Development patterns library │   │
├── architecture.ts       # Tool architecture patterns │   │   ├── integration.ts        # OpenCode
integration patterns │   │   ├── testing.ts           # Testing strategy patterns │   │   └──
best-practices.ts    # General best practices │   ├── templates/                # Code and document
templates │   │   ├── tool-template.ts     # Tool boilerplate │   │   ├── test-template.ts     #
Test suite template │   │   └── doc-template.ts      # Documentation template │   └── utils/
# Utility functions │       ├── validation.ts         # Input validation utilities │       ├──
generation.ts         # Code generation utilities │       └── analysis.ts          # Code analysis
utilities ├── knowledge/                     # Knowledge base │   ├── tool-development-guide.md │
├── opencode-patterns.md │   ├── testing-strategies.md │   └── troubleshooting.md └── tests/
# Agent testing ├── unit.test.ts ├── integration.test.ts └── validation.test.ts ```

## Agent Interfaces

### Primary Tool Development Functions

#### 1. Tool Designer ```typescript export const designToolArchitecture = tool({ description:
"Design optimal architecture for new OpenCode tool", args: { requirements:
tool.schema.string().describe("Detailed tool requirements"), complexity:
tool.schema.enum(['simple', 'moderate', 'complex']).describe("Tool complexity level"), constraints:
tool.schema.array().optional().describe("Technical and business constraints"), referenceTools:
tool.schema.array().optional().describe("Existing tools for reference") }, async execute(args,
context) { // Analyze requirements and design architecture // Create modular, scalable structure //
Define interfaces and data models // Plan configuration management // Design error handling
strategy } }); ```

#### 2. Implementation Guide ```typescript export const guideImplementation = tool({ description:
"Provide step-by-step tool implementation guidance", args: { architecture:
tool.schema.object().describe("Tool architecture specification"), phase:
tool.schema.enum(['planning', 'setup', 'development', 'testing',
'deployment']).describe("Development phase"), environment:
tool.schema.string().optional().describe("Development environment details"), preferences:
tool.schema.object().optional().describe("Coding preferences and standards") }, async execute(args,
context) { // Generate implementation plan // Create boilerplate code // Provide step-by-step
guidance // Generate configuration files // Create testing framework } }); ```

#### 3. Test Framework Creator ```typescript export const createTestingFramework = tool({
description: "Create comprehensive testing framework for tool validation", args: { toolSpec:
tool.schema.object().describe("Tool specification"), testTypes: tool.schema.array().describe("Types
of tests required"), coverage: tool.schema.number().optional().describe("Target test coverage
percentage"), performance: tool.schema.boolean().optional().describe("Include performance testing")
}, async execute(args, context) { // Design test strategy // Generate unit tests // Create
integration tests // Setup performance benchmarks // Define validation criteria } }); ```

#### 4. Documentation Generator ```typescript export const generateToolDocumentation = tool({
description: "Generate comprehensive documentation for OpenCode tools", args: { toolCode:
tool.schema.string().describe("Tool implementation code"), docTypes:
tool.schema.array().describe("Documentation types to generate"), audience:
tool.schema.enum(['users', 'developers', 'contributors']).describe("Target audience"), examples:
tool.schema.boolean().optional().describe("Include usage examples") }, async execute(args, context)
{ // Analyze tool code // Generate user guides // Create API references // Develop code examples //
Write troubleshooting guides } }); ```

## Knowledge Base Content

### Tool Development Guide
1. **Requirements Analysis**
   - Functional requirement gathering
   - Technical constraint identification
   - User experience considerations
   - Performance and scalability requirements

2. **Architecture Design**
   - Modular component design
   - Interface definition and contracts
   - Configuration management strategy
   - Error handling and validation design
   - Data flow and processing design

3. **Implementation Best Practices**
   - Code organization and structure
   - TypeScript and type safety
   - Async programming patterns
   - Memory and performance optimization
   - Security considerations and input validation

4. **Testing Strategies**
   - Unit testing with comprehensive coverage
   - Integration testing with real scenarios
   - Performance testing and benchmarking
   - Error handling and edge case testing
   - User acceptance testing

5. **OpenCode Integration**
   - SDK usage patterns and conventions
   - Tool export and interface design
   - Configuration and environment management
   - Error reporting and user feedback
   - Build and deployment processes

### Pattern Library
1. **Architectural Patterns**
   - Modular tool structure
   - Plugin-based extensibility
   - Configuration-driven behavior
   - Event-driven processing
   - Pipeline-based data processing

2. **Integration Patterns**
   - OpenCode SDK best practices
   - Schema validation with Zod
   - Environment variable management
   - Test mode implementation
   - Error handling patterns

3. **Testing Patterns**
   - Mock-based unit testing
   - Integration test scenarios
   - Performance benchmarking
   - Validation test automation
   - Continuous integration setup

## Success Metrics

### Functional Requirements
- ✅ Design scalable tool architectures
- ✅ Generate complete implementation guidance
- ✅ Create comprehensive testing frameworks
- ✅ Produce production-ready documentation
- ✅ Support multiple tool complexity levels
- ✅ Integrate with OpenCode patterns

### Quality Requirements
- ✅ Generated code follows best practices
- ✅ Testing frameworks provide >90% coverage
- ✅ Documentation is clear and comprehensive
- ✅ Tools are production-ready and maintainable
- ✅ Performance meets OpenCode standards
- ✅ Security considerations are addressed

### User Experience Requirements
- ✅ Clear, step-by-step guidance
- ✅ Interactive development wizards
- ✅ Progress tracking and reporting
- ✅ Error recovery and suggestions
- ✅ Learning from previous developments

## Advanced Features

### Intelligent Assistance
1. **Requirement Analysis**
   - Natural language processing for requirement extraction
   - Ambiguity detection and clarification
   - Constraint identification and documentation
   - Feasibility analysis and recommendations

2. **Automated Generation**
   - Boilerplate code generation
   - Test suite auto-generation
   - Documentation draft creation
   - Configuration file generation
   - Build script creation

3. **Quality Assurance**
   - Code quality analysis and suggestions
   - Security vulnerability scanning
   - Performance bottleneck identification
   - Best practice compliance checking
   - Maintainability assessment

### Learning & Adaptation
1. **Pattern Recognition**
   - Learn from successful tool implementations
   - Identify common patterns and anti-patterns
   - Adapt recommendations based on project context
   - Improve guidance over time

2. **Community Integration**
   - Incorporate community feedback
   - Track emerging best practices
   - Update pattern library regularly
   - Share successful patterns
   - Contribute to OpenCode ecosystem

## Implementation Timeline

### Week 1: Core Foundation
- Agent basic structure and interfaces
- Tool design and architecture functions
- Basic implementation guidance
- OpenCode pattern integration

### Week 2: Framework Development
- Testing framework creation tools
- Documentation generation capabilities
- Knowledge base structure
- Pattern library foundation

### Week 3: Advanced Features
- Intelligent assistance features
- Automated generation capabilities
- Quality assurance tools
- Learning and adaptation systems

### Week 4: Polish & Integration
- Comprehensive testing and validation
- Performance optimization
- Documentation completion
- Community preparation
- Production deployment

## Conclusion

The TOOLING agent will serve as the definitive authority for tool development within OpenCode,
significantly reducing the barrier to creating high-quality, production-ready tools. By capturing
all foundational steps, best practices, and patterns from our Crawl4AI tool planning experience,
this agent will enable:

- **Rapid Tool Development** - Accelerated development through guidance and automation
- **Quality Assurance** - Consistent high-quality outputs through established patterns
- **Knowledge Preservation** - Captured expertise and best practices for reuse
- **Community Enablement** - Empowering users to create custom tools effectively
- **Ecosystem Growth** - Expanding OpenCode capabilities through tool proliferation

#### 8. Multi-Component Orchestrator
```typescript
export const orchestrateComponents = tool({
  description: "Orchestrate multiple tools, agents, and commands in complex workflows",
  args: {
    components: tool.schema.array().describe("Components to orchestrate"),
    workflow: tool.schema.string().describe("Workflow definition"),
    configuration: tool.schema.object().optional().describe("Orchestration configuration")
  },
  async execute(args, context) {
    // Design orchestration patterns
    // Create component coordination
    // Execute complex workflows
    // Manage state and communication
  }
});
```

## Advanced Capabilities

### Multi-Component Development
1. **Tool-Agent Integration**
   - Tools that can delegate to specialized agents
   - Agents that coordinate multiple tools
   - Commands that orchestrate tool execution
   - Hybrid components with mixed capabilities

2. **Workflow Orchestration**
   - Sequential and parallel execution patterns
   - Conditional branching and decision logic
   - Error recovery and rollback mechanisms
   - State management across components

3. **Ecosystem Management**
   - Component discovery and registration
   - Dependency management between components
   - Version compatibility and upgrade paths
   - Configuration sharing and inheritance

### Advanced Agent Capabilities
1. **Multi-Agent Coordination**
   - Agent-to-agent communication protocols
   - Task delegation and load balancing
   - Collaborative problem-solving patterns
   - Distributed state management
   - Conflict resolution and negotiation

2. **Intelligent Workflow Design**
   - Dynamic workflow adaptation
   - Context-aware decision making
   - Learning from execution history
   - Performance optimization
   - User preference integration

3. **Command Chaining & Pipelines**
   - Sequential command execution
   - Data flow between commands
   - Conditional command execution
   - Error handling across chains
   - Progress tracking and reporting

## Success Metrics

### Functional Requirements
- ✅ Design scalable architectures for all component types
- ✅ Generate complete implementation guidance for tools, agents, and commands
- ✅ Create comprehensive testing frameworks for all components
- ✅ Produce production-ready documentation for all component types
- ✅ Support multi-component integration and orchestration
- ✅ Integrate with OpenCode patterns for all component types

### Quality Requirements
- ✅ Generated code follows best practices for all component types
- ✅ Testing frameworks provide >90% coverage for all components
- ✅ Documentation is clear and comprehensive for all component types
- ✅ Components are production-ready and maintainable
- ✅ Performance meets OpenCode standards for all component types
- ✅ Security considerations are addressed for all component types

### User Experience Requirements
- ✅ Clear, step-by-step guidance for all component types
- ✅ Interactive development wizards for all component types
- ✅ Progress tracking and reporting across all components
- ✅ Error recovery and suggestions for all component types
- ✅ Learning from previous developments across all component types

## Implementation Timeline

### Week 1: Core Foundation
- Agent basic structure and interfaces
- Tool design and architecture functions
- Command design and parsing functions
- Basic implementation guidance for all component types
- OpenCode pattern integration for all component types

### Week 2: Framework Development
- Testing framework creation tools for all component types
- Documentation generation capabilities for all component types
- Knowledge base structure for all component types
- Pattern library foundation for all component types
- Multi-component interaction patterns

### Week 3: Advanced Features
- Multi-agent coordination capabilities
- Workflow orchestration systems
- Intelligent assistance features for all component types
- Quality assurance tools for all component types
- Learning and adaptation systems

### Week 4: Production Readiness
- Comprehensive testing and validation for all component types
- Performance optimization for all component types
- Documentation completion for all component types
- Community preparation for all component types
- Production deployment for complete ecosystem

## Template Analysis & Structure Guidance

### OpenCode Tool Structure Patterns

Based on analysis of `/opencode/tool/` directory, the TOOLING agent must follow these established patterns:

#### 1. **Tool Directory Structure**
```
opencode/tool/your-tool-name/
├── index.ts              # Main tool file - ALL functionality in one file
├── package.json           # Dependencies and build configuration
├── README.md             # Tool documentation and usage examples
├── tsconfig.json         # TypeScript configuration
└── tests/               # Testing directory (optional but recommended)
    ├── unit.test.ts      # Unit tests
    ├── integration.test.ts # Integration tests
    └── validation.test.ts # Validation framework
```

#### 2. **Single File Pattern**
- **Index.ts Only**: All tool functionality in single `index.ts` file
- **Multiple Exports**: Export multiple tool functions from one file
- **No Subdirectories**: Keep flat structure for simplicity
- **Self-Contained**: Each tool is independent and isolated

#### 3. **Tool Export Pattern**
```typescript
// Template structure from /opencode/tool/template/index.ts
import { tool } from "@opencode-ai/plugin/tool"

// Main tool function
export async function yourToolFunction(input: string): Promise<string> {
  // Tool implementation logic
}

// Tool definition for OpenCode
export const yourToolName = tool({
  description: "Clear description of tool functionality",
  args: {
    input: tool.schema.string().describe("Input parameter description")
  },
  async execute(args, context) {
    try {
      return await yourToolFunction(args.input)
    } catch (error) {
      return `Error: ${error.message}`
    }
  },
})

// Default export
export default yourToolName
```

#### 4. **Integration Patterns**
- **Environment Variables**: Use `getApiKey()` pattern for API keys
- **Test Mode**: Implement `isTestMode()` for development
- **Error Handling**: Consistent try-catch with clear messages
- **Dependencies**: Follow `@opencode-ai/sdk` and `@opencode-ai/plugin` patterns
- **Build Scripts**: Standard `bun build` and `bun run type-check`

### TOOLING Agent Template Creation

#### 1. **Tool Creation Template**
```typescript
export const createTool = tool({
  description: "Create new OpenCode tool following established patterns",
  args: {
    name: tool.schema.string().describe("Tool name (kebab-case)"),
    description: tool.schema.string().describe("Tool functionality description"),
    complexity: tool.schema.enum(['simple', 'moderate', 'complex']).describe("Tool complexity"),
    api: tool.schema.boolean().optional().describe("Requires external API integration"),
    testMode: tool.schema.boolean().optional().describe("Include comprehensive testing")
  },
  async execute(args, context) {
    // Generate tool directory structure
    // Create index.ts with proper exports
    // Generate package.json with dependencies
    // Create README.md with documentation
    // Create tsconfig.json for TypeScript
    // Generate test files if requested
    // Follow template/index.ts patterns exactly
  }
});
```

#### 2. **Agent Creation Template**
```typescript
export const createAgent = tool({
  description: "Create specialized OpenCode agent with coordination capabilities",
  args: {
    name: tool.schema.string().describe("Agent name (kebab-case)"),
    purpose: tool.schema.string().describe("Agent primary purpose and domain"),
    subagents: tool.schema.array().optional().describe("Required subagents"),
    workflows: tool.schema.array().optional().describe("Agent workflows to implement")
  },
  async execute(args, context) {
    // Generate agent directory structure
    // Create agent definition with proper mode
    // Create coordination patterns for subagents
    // Generate workflow orchestration logic
    // Follow OpenCode agent patterns exactly
  }
});
```

#### 3. **Command Creation Template**
```typescript
export const createCommand = tool({
  description: "Create OpenCode slash command with CLI integration",
  args: {
    name: tool.schema.string().describe("Command name (kebab-case)"),
    functionality: tool.schema.string().describe("Command functionality description"),
    arguments: tool.schema.array().describe("Command arguments and options"),
    category: tool.schema.enum(['utility', 'development', 'analysis']).describe("Command category")
  },
  async execute(args, context) {
    // Generate command directory structure  
    // Create command definition with proper syntax
    // Create argument parsing and validation
    // Generate help system and documentation
    // Follow OpenCode command patterns exactly
  }
});
```

### TOOLING Agent Implementation Strategy

#### 1. Template-Based Generation
- **Exact Pattern Matching**: Follow `/opencode/tool/template/` patterns precisely
- **Structure Replication**: Replicate exact directory structure and file organization
- **Code Generation**: Generate boilerplate that matches established conventions
- **Naming Conventions**: Use kebab-case for directories, PascalCase for functions

#### 2. Component Type Detection
- **Tool Creation**: When user requests "tool" - use tool template
- **Agent Creation**: When user requests "agent" - use agent template  
- **Command Creation**: When user requests "command" - use command template
- **Mixed Components**: When user requests multiple types - create coordinated structure

#### 3. Quality Assurance
- **Pattern Compliance**: Ensure generated components follow OpenCode patterns
- **Integration Testing**: Test components work with OpenCode SDK
- **Validation Framework**: Include testing templates and validation logic
- **Documentation Generation**: Auto-generate comprehensive documentation

### OpenCode Agent Implementation Patterns

Based on OpenCode documentation analysis, the TOOLING agent must understand these key implementation patterns:

#### 1. **Primary Agent vs Subagent Decision Matrix**

**Use Primary Agent When:**
- **Complex Workflows**: Multi-step processes requiring coordination and state management
- **User Interaction**: Direct user interaction with conversation context
- **Tool Orchestration**: Need to coordinate multiple tools and commands
- **Session Management**: Persistent state across multiple operations
- **Decision Making**: Complex analysis and strategic planning

**Use Subagent When:**
- **Specialized Tasks**: Single-purpose, focused functionality
- **Simple Operations**: Straightforward input/output without complex coordination
- **Performance Critical**: Speed and efficiency are primary concerns
- **Isolation**: Independent operation without complex dependencies
- **Tool-Specific**: Built around specific tool or command capabilities

#### 2. **Agent Configuration Patterns**

**Primary Agent Configuration:**
```typescript
// Primary agent with full capabilities
export const primaryAgent = {
  description: "Comprehensive agent for complex workflows",
  mode: "primary",  // CRITICAL for primary agents
  tools: ["write", "edit", "bash", "webfetch"],  // Full tool access
  temperature: 0.1,  // Lower for focused responses
  prompt: "You are a primary agent responsible for complex workflows...",
  model: "anthropic/claude-sonnet-4-20250514",  // Capable model
  memory: "persistent",  // Maintain conversation context
  delegation: true  // Can delegate to subagents
}
```

**Subagent Configuration:**
```typescript
// Specialized subagent
export const specializedSubagent = {
  description: "Focused agent for specific domain",
  mode: "subagent",  // CRITICAL for subagents
  tools: ["read", "grep"],  // Limited, focused tools
  temperature: 0.3,  // Higher for creative solutions
  prompt: "You are a specialized subagent for...",
  model: "anthropic/claude-haiku-4-20250514",  // Fast model
  memory: "session",  // Limited session context
  delegation: false  // Cannot delegate further
}
```

#### 3. **Agent Creation Best Practices**

**For Primary Agents:**
- **Comprehensive Descriptions**: Clear purpose and capability overview
- **Tool Integration**: Full access to OpenCode tools ecosystem
- **Workflow Design**: Multi-step process management
- **Error Handling**: Graceful degradation and clear error messages
- **Context Management**: Persistent state and conversation tracking
- **Delegation Patterns**: Clear subagent coordination protocols

**For Subagents:**
- **Focused Scope**: Narrow, well-defined purpose
- **Limited Tools**: Only essential tools for the specific domain
- **Fast Performance**: Optimized for speed and efficiency
- **Clear Boundaries**: Well-defined limitations and capabilities
- **Simple Interface**: Straightforward input/output patterns

#### 4. **Agent Communication Patterns**

**Primary to Subagent:**
```typescript
// Delegation pattern from primary agent
interface DelegationRequest {
  task: string;
  context: any;
  tools: string[];
  requirements: string;
}

// In primary agent
await context.delegate("subagent-name", {
  task: "Analyze this code for security issues",
  context: currentContext,
  tools: ["read", "grep"],
  requirements: "Focus on authentication and data validation"
});
```

**Subagent to Primary:**
```typescript
// Response pattern from subagent
interface SubagentResponse {
  results: any;
  confidence: number;
  recommendations: string[];
  status: "completed" | "needs_clarification";
}

// In subagent
return {
  results: analysisResults,
  confidence: 0.85,
  recommendations: ["Add input validation", "Implement rate limiting"],
  status: "completed"
};
```

### TOOLING Agent Template Creation

#### 1. **Agent Type Assessment Tool**
```typescript
export const assessAgentType = tool({
  description: "Assess requirements and determine optimal agent type",
  args: {
    requirements: tool.schema.string().describe("Detailed agent requirements"),
    complexity: tool.schema.enum(['simple', 'moderate', 'complex']).describe("Workflow complexity"),
    userInteraction: tool.schema.boolean().describe("Requires direct user interaction"),
    toolCoordination: tool.schema.boolean().describe("Needs to coordinate multiple tools")
  },
  async execute(args, context) {
    // Analyze requirements and recommend agent type
    const complexity = args.complexity || 'moderate';
    const needsPrimaryAgent = args.userInteraction || args.toolCoordination || complexity === 'complex';
    
    if (needsPrimaryAgent) {
      return {
        agentType: "primary",
        configuration: primaryAgent,
        template: "primary-agent",
        reasoning: "Complex workflow requires primary agent with full capabilities"
      };
    } else {
      return {
        agentType: "subagent", 
        configuration: specializedSubagent,
        template: "subagent",
        reasoning: "Focused task optimized for subagent efficiency"
      };
    }
  }
});
```

#### 2. **Primary Agent Generator**
```typescript
export const createPrimaryAgent = tool({
  description: "Create comprehensive primary agent with full OpenCode integration",
  args: {
    name: tool.schema.string().describe("Agent name (kebab-case)"),
    purpose: tool.schema.string().describe("Agent's primary purpose and domain"),
    workflows: tool.schema.array().describe("Workflows agent should handle"),
    tools: tool.schema.array().optional().describe("Specific tools required"),
    model: tool.schema.string().optional().describe("Preferred model for agent")
  },
  async execute(args, context) {
    // Generate primary agent structure
    // Create comprehensive configuration
    // Implement workflow orchestration
    // Add delegation capabilities
    // Generate documentation and tests
  }
});
```

#### 3. **Subagent Generator**
```typescript
export const createSubagent = tool({
  description: "Create focused subagent for specialized tasks",
  args: {
    name: tool.schema.string().describe("Subagent name (kebab-case)"),
    domain: tool.schema.string().describe("Specific domain or specialization"),
    capabilities: tool.schema.array().describe("Core capabilities required"),
    parentAgent: tool.schema.string().optional().describe("Parent primary agent if any")
  },
  async execute(args, context) {
    // Generate subagent structure
    // Create focused configuration
    // Implement specialized functionality
    // Optimize for performance
    // Generate documentation and tests
  }
});
```

### Advanced Agent Capabilities

#### 1. **Multi-Agent Orchestration**
```typescript
// Agent coordination patterns
export const orchestrateAgents = tool({
  description: "Coordinate multiple agents for complex workflows",
  args: {
    agents: tool.schema.array().describe("Agents to orchestrate"),
    workflow: tool.schema.string().describe("Workflow definition"),
    configuration: tool.schema.object().optional().describe("Orchestration settings")
  },
  async execute(args, context) {
    // Create agent communication protocols
    // Implement task distribution logic
    // Manage state between agents
    // Handle error recovery and rollback
    // Generate comprehensive reports
  }
});
```

#### 2. **Agent Learning System**
```typescript
// Learning and adaptation patterns
export const improveAgent = tool({
  description: "Analyze agent performance and suggest improvements",
  args: {
    agentName: tool.schema.string().describe("Agent to analyze"),
    performance: tool.schema.object().describe("Performance metrics"),
    feedback: tool.schema.array().optional().describe("User feedback and outcomes")
  },
  async execute(args, context) {
    // Analyze agent execution history
    // Identify patterns and bottlenecks
    // Suggest configuration improvements
    // Generate optimization recommendations
    // Update knowledge base
  }
});
```

### Implementation Quality Gates

#### 1. **Agent Validation Checklist**
- ✅ **Mode Configuration**: Correct `mode: "primary"` or `mode: "subagent"`
- ✅ **Tool Access**: Appropriate tool permissions for agent type
- ✅ **Temperature Settings**: Optimal temperature for agent purpose
- ✅ **Memory Management**: Proper memory configuration for agent complexity
- ✅ **Delegation Support**: Primary agents can delegate, subagents cannot
- ✅ **Error Handling**: Comprehensive error handling and user feedback

#### 2. **Integration Testing Requirements**
- ✅ **OpenCode SDK Compliance**: Proper use of `@opencode-ai/plugin` and `@opencode-ai/sdk`
- ✅ **Tool Integration**: Seamless integration with OpenCode tool ecosystem
- ✅ **Configuration Management**: Proper handling of environment variables and settings
- ✅ **Performance Standards**: Meet OpenCode performance benchmarks
- ✅ **Documentation Quality**: Clear, comprehensive documentation following OpenCode patterns

This enhanced TOOLING agent proposal now provides **complete guidance for implementing both primary agents and subagents** with proper OpenCode integration, ensuring optimal agent type selection, configuration patterns, and ecosystem coordination.
- **Validation Framework**: Include testing templates and validation logic

#### 4. **Advanced Features**
- **Component Coordination**: Generate interaction patterns between components
- **Workflow Orchestration**: Create complex workflow definitions
- **Ecosystem Integration**: Ensure components work together seamlessly
- **Learning System**: Capture patterns and improve over time

## Conclusion

The TOOLING agent will serve as a definitive authority for developing complete OpenCode ecosystem components, significantly reducing the barrier to creating high-quality, production-ready **tools, agents, AND commands**. By capturing all foundational steps, best practices, and patterns from our comprehensive development experience, this agent will enable:

- **🚀 Rapid Development** - Accelerated development through guidance and automation for all component types
- **📈 Quality Consistency** - Consistent high-quality outputs through established patterns across all components
- **🧠 Knowledge Preservation** - Captured expertise and best practices for reuse across all component types
- **🌐 Ecosystem Growth** - Expanding OpenCode capabilities through component proliferation of all types
- **🔄 Workflow Orchestration** - Complex multi-component workflow creation and management
- **🛡️ Risk Reduction** - Minimize common development pitfalls across all component types
- **📋 Template Precision** - Exact replication of proven OpenCode patterns and structures

This agent will be a comprehensive force multiplier for the OpenCode ecosystem, enabling users to create specialized tools, coordinate multiple agents, and orchestrate commands that extend the platform's capabilities in countless directions and complex workflows.
