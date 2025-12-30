import { AgentType, AgentStatus } from '../types/index.js';
export declare const agentTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            name: {
                type: string;
                description: string;
            };
            type: {
                type: string;
                enum: AgentType[];
                description: string;
            };
            capabilities: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            status?: undefined;
            agentId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            status: {
                type: string;
                enum: AgentStatus[];
                description: string;
            };
            name?: undefined;
            type?: undefined;
            capabilities?: undefined;
            agentId?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            agentId: {
                type: string;
                description: string;
            };
            name?: undefined;
            type?: undefined;
            capabilities?: undefined;
            status?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            agentId: {
                type: string;
                description: string;
            };
            name: {
                type: string;
                description: string;
            };
            status: {
                type: string;
                enum: AgentStatus[];
                description: string;
            };
            capabilities: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            type?: undefined;
        };
        required: string[];
    };
})[];
export declare function handleAgentTool(name: string, args: Record<string, unknown>): {
    content: Array<{
        type: string;
        text: string;
    }>;
} | null;
//# sourceMappingURL=agent-tools.d.ts.map