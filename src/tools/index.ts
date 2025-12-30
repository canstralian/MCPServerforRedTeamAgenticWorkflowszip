import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { agentTools, handleAgentTool } from './agent-tools.js';
import { operationTools, handleOperationTool } from './operation-tools.js';
import { targetTools, handleTargetTool } from './target-tools.js';
import { analysisTools, handleAnalysisTool } from './analysis-tools.js';
import { integrationTools, handleIntegrationTool } from './integration-tools.js';

export enum WorkflowStage {
  PLANNING = 'planning',
  RECONNAISSANCE = 'reconnaissance',
  EXPLOITATION = 'exploitation',
  POST_EXPLOITATION = 'post_exploitation',
  REPORTING = 'reporting',
}

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  stage: WorkflowStage;
}

const toolStageMapping: Record<string, WorkflowStage> = {
  create_agent: WorkflowStage.PLANNING,
  list_agents: WorkflowStage.PLANNING,
  get_agent: WorkflowStage.PLANNING,
  update_agent: WorkflowStage.PLANNING,
  activate_agent: WorkflowStage.EXPLOITATION,
  delete_agent: WorkflowStage.REPORTING,
  
  create_operation: WorkflowStage.PLANNING,
  list_operations: WorkflowStage.RECONNAISSANCE,
  get_operation: WorkflowStage.RECONNAISSANCE,
  update_operation: WorkflowStage.EXPLOITATION,
  start_operation: WorkflowStage.EXPLOITATION,
  complete_operation: WorkflowStage.REPORTING,
  delete_operation: WorkflowStage.REPORTING,
  
  create_target: WorkflowStage.PLANNING,
  list_targets: WorkflowStage.RECONNAISSANCE,
  get_target: WorkflowStage.RECONNAISSANCE,
  update_target: WorkflowStage.RECONNAISSANCE,
  add_vulnerability: WorkflowStage.EXPLOITATION,
  delete_target: WorkflowStage.REPORTING,
  
  add_finding: WorkflowStage.POST_EXPLOITATION,
  list_findings: WorkflowStage.REPORTING,
  get_finding: WorkflowStage.REPORTING,
  generate_report: WorkflowStage.REPORTING,
  get_statistics: WorkflowStage.REPORTING,
  
  virustotal_scan_hash: WorkflowStage.RECONNAISSANCE,
  virustotal_scan_url: WorkflowStage.RECONNAISSANCE,
  virustotal_scan_ip: WorkflowStage.RECONNAISSANCE,
  virustotal_scan_domain: WorkflowStage.RECONNAISSANCE,
  otx_get_indicator: WorkflowStage.RECONNAISSANCE,
  otx_get_pulses: WorkflowStage.RECONNAISSANCE,
  hackerone_list_reports: WorkflowStage.REPORTING,
  hackerone_get_report: WorkflowStage.REPORTING,
};

function addStageToTools(tools: Array<{ name: string; description: string; inputSchema: unknown }>): ToolDefinition[] {
  return tools.map(tool => ({
    ...tool,
    inputSchema: tool.inputSchema as ToolDefinition['inputSchema'],
    stage: toolStageMapping[tool.name] || WorkflowStage.PLANNING,
  }));
}

const allToolsWithStages: ToolDefinition[] = [
  ...addStageToTools(agentTools),
  ...addStageToTools(operationTools),
  ...addStageToTools(targetTools),
  ...addStageToTools(analysisTools),
  ...addStageToTools(integrationTools),
];

const toolsByStage = {
  [WorkflowStage.PLANNING]: allToolsWithStages.filter(t => t.stage === WorkflowStage.PLANNING),
  [WorkflowStage.RECONNAISSANCE]: allToolsWithStages.filter(t => t.stage === WorkflowStage.RECONNAISSANCE),
  [WorkflowStage.EXPLOITATION]: allToolsWithStages.filter(t => t.stage === WorkflowStage.EXPLOITATION),
  [WorkflowStage.POST_EXPLOITATION]: allToolsWithStages.filter(t => t.stage === WorkflowStage.POST_EXPLOITATION),
  [WorkflowStage.REPORTING]: allToolsWithStages.filter(t => t.stage === WorkflowStage.REPORTING),
};

export function getToolsByStage(stage: WorkflowStage): ToolDefinition[] {
  return toolsByStage[stage];
}

export function getAllToolsOrganized(): Record<WorkflowStage, ToolDefinition[]> {
  return toolsByStage;
}

export function registerTools(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const toolsWithMetadata = allToolsWithStages.map(tool => ({
      name: tool.name,
      description: `[${tool.stage.toUpperCase()}] ${tool.description}`,
      inputSchema: tool.inputSchema,
    }));
    return { tools: toolsWithMetadata };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const typedArgs = args as Record<string, unknown>;

    let result = handleAgentTool(name, typedArgs);
    if (result) return result;

    result = handleOperationTool(name, typedArgs);
    if (result) return result;

    result = handleTargetTool(name, typedArgs);
    if (result) return result;

    result = handleAnalysisTool(name, typedArgs);
    if (result) return result;

    result = handleIntegrationTool(name, typedArgs);
    if (result) return result;

    return { content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
  });
}

export { WorkflowStage as Stage };
