import { Server } from '@modelcontextprotocol/sdk/server/index.js';
export declare enum WorkflowStage {
    PLANNING = "planning",
    RECONNAISSANCE = "reconnaissance",
    EXPLOITATION = "exploitation",
    POST_EXPLOITATION = "post_exploitation",
    REPORTING = "reporting"
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
export declare function getToolsByStage(stage: WorkflowStage): ToolDefinition[];
export declare function getAllToolsOrganized(): Record<WorkflowStage, ToolDefinition[]>;
export declare function registerTools(server: Server): void;
export { WorkflowStage as Stage };
//# sourceMappingURL=index.d.ts.map