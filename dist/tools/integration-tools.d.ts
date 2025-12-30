interface ToolResponse {
    content: Array<{
        type: string;
        text: string;
    }>;
}
export declare const integrationTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            hash: {
                type: string;
                description: string;
            };
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            report_id?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            url: {
                type: string;
                description: string;
            };
            hash?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            report_id?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            ip: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            report_id?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            domain: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            report_id?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            indicator_type: {
                type: string;
                enum: string[];
                description: string;
            };
            indicator: {
                type: string;
                description: string;
            };
            section: {
                type: string;
                enum: string[];
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            report_id?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            query: {
                type: string;
                description: string;
            };
            limit: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            report_id?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            program: {
                type: string;
                description: string;
            };
            state: {
                type: string;
                enum: string[];
                description: string;
            };
            severity: {
                type: string;
                enum: string[];
                description: string;
            };
            sort: {
                type: string;
                enum: string[];
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            report_id?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            report_id: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            program: {
                type: string;
                description: string;
            };
            title: {
                type: string;
                description: string;
            };
            vulnerability_information: {
                type: string;
                description: string;
            };
            impact: {
                type: string;
                description: string;
            };
            severity_rating: {
                type: string;
                enum: string[];
                description: string;
            };
            source: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            report_id?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            report_id: {
                type: string;
                description: string;
            };
            state: {
                type: string;
                enum: string[];
                description: string;
            };
            message: {
                type: string;
                description: string;
            };
            close_reason: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            severity?: undefined;
            sort?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            report_id: {
                type: string;
                description: string;
            };
            message: {
                type: string;
                description: string;
            };
            internal: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            close_reason?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            report_id: {
                type: string;
                description: string;
            };
            rating: {
                type: string;
                enum: string[];
                description: string;
            };
            cvss_vector: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            report_id: {
                type: string;
                description: string;
            };
            amount: {
                type: string;
                description: string;
            };
            bonus_amount: {
                type: string;
                description: string;
            };
            message: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            program: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            report_id?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            report_id?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            program: {
                type: string;
                description: string;
            };
            metric: {
                type: string;
                enum: string[];
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            report_id?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            organization_id: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            report_id?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            organization_id: {
                type: string;
                description: string;
            };
            asset_type: {
                type: string;
                enum: string[];
                description: string;
            };
            identifier: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            program?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            report_id?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            program: {
                type: string;
                description: string;
            };
            report_id: {
                type: string;
                description: string;
            };
            hash?: undefined;
            url?: undefined;
            ip?: undefined;
            domain?: undefined;
            indicator_type?: undefined;
            indicator?: undefined;
            section?: undefined;
            query?: undefined;
            limit?: undefined;
            state?: undefined;
            severity?: undefined;
            sort?: undefined;
            title?: undefined;
            vulnerability_information?: undefined;
            impact?: undefined;
            severity_rating?: undefined;
            source?: undefined;
            message?: undefined;
            close_reason?: undefined;
            internal?: undefined;
            rating?: undefined;
            cvss_vector?: undefined;
            amount?: undefined;
            bonus_amount?: undefined;
            metric?: undefined;
            organization_id?: undefined;
            asset_type?: undefined;
            identifier?: undefined;
            description?: undefined;
        };
        required: string[];
    };
})[];
export declare function handleIntegrationTool(name: string, args: Record<string, unknown>): ToolResponse | null;
export {};
//# sourceMappingURL=integration-tools.d.ts.map