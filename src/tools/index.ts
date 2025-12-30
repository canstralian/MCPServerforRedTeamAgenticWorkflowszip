import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { registerAgentTools } from './agent-tools.js';
import { registerOperationTools } from './operation-tools.js';
import { registerTargetTools } from './target-tools.js';
import { registerAnalysisTools } from './analysis-tools.js';

export function registerTools(server: Server): void {
  registerAgentTools(server);
  registerOperationTools(server);
  registerTargetTools(server);
  registerAnalysisTools(server);
}
