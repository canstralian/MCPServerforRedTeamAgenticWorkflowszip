import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { OperationPhase, OperationStatus } from '../types/index.js';
export declare const operationTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            name: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            targetId: {
                type: string;
                description: string;
            };
            phase: {
                type: string;
                enum: OperationPhase[];
                description: string;
            };
            agentIds: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            status?: undefined;
            operationId?: undefined;
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
                enum: OperationStatus[];
                description: string;
            };
            phase: {
                type: string;
                enum: OperationPhase[];
                description: string;
            };
            name?: undefined;
            description?: undefined;
            targetId?: undefined;
            agentIds?: undefined;
            operationId?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            operationId: {
                type: string;
                description: string;
            };
            name?: undefined;
            description?: undefined;
            targetId?: undefined;
            phase?: undefined;
            agentIds?: undefined;
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
            operationId: {
                type: string;
                description: string;
            };
            phase: {
                type: string;
                enum: OperationPhase[];
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            name?: undefined;
            targetId?: undefined;
            agentIds?: undefined;
            status?: undefined;
        };
        required: string[];
    };
})[];
export declare function handleOperationTool(name: string, args: Record<string, unknown>): {
    content: Array<{
        type: string;
        text: string;
    }>;
} | null;
export declare function registerOperationTools(server: Server): void;
//# sourceMappingURL=operation-tools.d.ts.map