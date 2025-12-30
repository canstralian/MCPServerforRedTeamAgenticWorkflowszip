import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { agentTools, handleAgentTool } from './agent-tools.js';
import { operationTools, handleOperationTool } from './operation-tools.js';
import { targetTools, handleTargetTool } from './target-tools.js';
import { analysisTools, handleAnalysisTool } from './analysis-tools.js';

const allTools = [
  ...agentTools,
  ...operationTools,
  ...targetTools,
  ...analysisTools,
];

export function registerTools(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: allTools };
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

    return { content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
  });
}

export { registerAgentTools } from './agent-tools.js';
export { registerOperationTools } from './operation-tools.js';
export { registerTargetTools } from './target-tools.js';
export { registerAnalysisTools } from './analysis-tools.js';
