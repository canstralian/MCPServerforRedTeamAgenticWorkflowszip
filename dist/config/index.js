import dotenv from 'dotenv';
dotenv.config();
export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    serverName: process.env.MCP_SERVER_NAME || 'redteam-mcp-server',
    version: process.env.MCP_VERSION || '1.0.0',
    logLevel: process.env.LOG_LEVEL || 'info',
    apiKey: process.env.API_KEY || '',
    maxConcurrentOperations: parseInt(process.env.MAX_CONCURRENT_OPERATIONS || '5', 10),
    maxAgentCount: parseInt(process.env.MAX_AGENT_COUNT || '10', 10),
    operationTimeout: parseInt(process.env.OPERATION_TIMEOUT || '3600000', 10),
};
//# sourceMappingURL=index.js.map