import { FindingType, VulnerabilitySeverity } from '../types/index.js';
export declare const analysisTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            operationId: {
                type: string;
                description: string;
            };
            agentId: {
                type: string;
                description: string;
            };
            type: {
                type: string;
                enum: FindingType[];
                description: string;
            };
            severity: {
                type: string;
                enum: VulnerabilitySeverity[];
                description: string;
            };
            title: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            evidence: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            mitigation: {
                type: string;
                description: string;
            };
            findingId?: undefined;
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
            agentId: {
                type: string;
                description: string;
            };
            severity: {
                type: string;
                enum: VulnerabilitySeverity[];
                description: string;
            };
            type?: undefined;
            title?: undefined;
            description?: undefined;
            evidence?: undefined;
            mitigation?: undefined;
            findingId?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            findingId: {
                type: string;
                description: string;
            };
            operationId?: undefined;
            agentId?: undefined;
            type?: undefined;
            severity?: undefined;
            title?: undefined;
            description?: undefined;
            evidence?: undefined;
            mitigation?: undefined;
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
            agentId?: undefined;
            type?: undefined;
            severity?: undefined;
            title?: undefined;
            description?: undefined;
            evidence?: undefined;
            mitigation?: undefined;
            findingId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            operationId?: undefined;
            agentId?: undefined;
            type?: undefined;
            severity?: undefined;
            title?: undefined;
            description?: undefined;
            evidence?: undefined;
            mitigation?: undefined;
            findingId?: undefined;
        };
        required?: undefined;
    };
})[];
export declare function handleAnalysisTool(name: string, args: Record<string, unknown>): {
    content: Array<{
        type: string;
        text: string;
    }>;
} | null;
//# sourceMappingURL=analysis-tools.d.ts.map