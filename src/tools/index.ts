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
import { connectorTools, handleConnectorTool } from './connector-tools.js';

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
  hackerone_create_report: WorkflowStage.POST_EXPLOITATION,
  hackerone_update_report_state: WorkflowStage.REPORTING,
  hackerone_add_comment: WorkflowStage.REPORTING,
  hackerone_update_severity: WorkflowStage.POST_EXPLOITATION,
  hackerone_award_bounty: WorkflowStage.REPORTING,
  hackerone_get_program: WorkflowStage.RECONNAISSANCE,
  hackerone_get_programs: WorkflowStage.RECONNAISSANCE,
  hackerone_get_balance: WorkflowStage.REPORTING,
  hackerone_get_analytics: WorkflowStage.REPORTING,
  hackerone_list_assets: WorkflowStage.RECONNAISSANCE,
  hackerone_create_asset: WorkflowStage.PLANNING,
  hackerone_get_activities: WorkflowStage.RECONNAISSANCE,

  linear_create_issue: WorkflowStage.PLANNING,
  linear_list_issues: WorkflowStage.PLANNING,
  linear_update_issue: WorkflowStage.EXPLOITATION,
  linear_list_teams: WorkflowStage.PLANNING,
  linear_add_comment: WorkflowStage.REPORTING,

  sheets_create_spreadsheet: WorkflowStage.PLANNING,
  sheets_read_data: WorkflowStage.RECONNAISSANCE,
  sheets_write_data: WorkflowStage.POST_EXPLOITATION,
  sheets_append_data: WorkflowStage.POST_EXPLOITATION,

  drive_list_files: WorkflowStage.RECONNAISSANCE,
  drive_create_folder: WorkflowStage.PLANNING,
  drive_upload_file: WorkflowStage.POST_EXPLOITATION,
  drive_download_file: WorkflowStage.RECONNAISSANCE,

  docs_create_document: WorkflowStage.REPORTING,
  docs_get_document: WorkflowStage.REPORTING,
  docs_insert_text: WorkflowStage.REPORTING,

  gmail_send_email: WorkflowStage.REPORTING,
  gmail_list_messages: WorkflowStage.RECONNAISSANCE,
  gmail_get_message: WorkflowStage.RECONNAISSANCE,

  calendar_create_event: WorkflowStage.PLANNING,
  calendar_list_events: WorkflowStage.PLANNING,
  calendar_update_event: WorkflowStage.PLANNING,

  notion_search: WorkflowStage.RECONNAISSANCE,
  notion_create_page: WorkflowStage.POST_EXPLOITATION,
  notion_get_page: WorkflowStage.RECONNAISSANCE,
  notion_update_page: WorkflowStage.POST_EXPLOITATION,
  notion_query_database: WorkflowStage.RECONNAISSANCE,

  github_list_repos: WorkflowStage.RECONNAISSANCE,
  github_get_repo: WorkflowStage.RECONNAISSANCE,
  github_list_issues: WorkflowStage.RECONNAISSANCE,
  github_create_issue: WorkflowStage.POST_EXPLOITATION,
  github_get_file: WorkflowStage.RECONNAISSANCE,
  github_create_file: WorkflowStage.POST_EXPLOITATION,
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
  ...addStageToTools(connectorTools),
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

    const connectorResult = await handleConnectorTool(name, typedArgs);
    if (connectorResult) return connectorResult;

    return { content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
  });
}

export { WorkflowStage as Stage };
