import { TargetType, VulnerabilitySeverity } from '../types/index.js';
export declare const targetTools: ({
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
                enum: TargetType[];
                description: string;
            };
            ipAddress: {
                type: string;
                description: string;
            };
            domain: {
                type: string;
                description: string;
            };
            ports: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            metadata: {
                type: string;
                description: string;
            };
            targetId?: undefined;
            severity?: undefined;
            cvss?: undefined;
            description?: undefined;
            exploitable?: undefined;
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
            type: {
                type: string;
                enum: TargetType[];
                description: string;
            };
            name?: undefined;
            ipAddress?: undefined;
            domain?: undefined;
            ports?: undefined;
            metadata?: undefined;
            targetId?: undefined;
            severity?: undefined;
            cvss?: undefined;
            description?: undefined;
            exploitable?: undefined;
            mitigation?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            targetId: {
                type: string;
                description: string;
            };
            name?: undefined;
            type?: undefined;
            ipAddress?: undefined;
            domain?: undefined;
            ports?: undefined;
            metadata?: undefined;
            severity?: undefined;
            cvss?: undefined;
            description?: undefined;
            exploitable?: undefined;
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
            targetId: {
                type: string;
                description: string;
            };
            name: {
                type: string;
                description: string;
            };
            ipAddress: {
                type: string;
                description: string;
            };
            domain: {
                type: string;
                description: string;
            };
            ports: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            type?: undefined;
            metadata?: undefined;
            severity?: undefined;
            cvss?: undefined;
            description?: undefined;
            exploitable?: undefined;
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
            targetId: {
                type: string;
                description: string;
            };
            name: {
                type: string;
                description: string;
            };
            severity: {
                type: string;
                enum: VulnerabilitySeverity[];
                description: string;
            };
            cvss: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            exploitable: {
                type: string;
                description: string;
            };
            mitigation: {
                type: string;
                description: string;
            };
            type?: undefined;
            ipAddress?: undefined;
            domain?: undefined;
            ports?: undefined;
            metadata?: undefined;
        };
        required: string[];
    };
})[];
export declare function handleTargetTool(name: string, args: Record<string, unknown>): {
    content: Array<{
        type: string;
        text: string;
    }>;
} | null;
//# sourceMappingURL=target-tools.d.ts.map