import dotenv from 'dotenv';
dotenv.config();
// Configuration constants
const DEFAULT_PORT = 3000;
const DEFAULT_MAX_CONCURRENT_OPERATIONS = 5;
const DEFAULT_MAX_AGENT_COUNT = 10;
const DEFAULT_OPERATION_TIMEOUT_MS = 3600000; // 1 hour
export const config = {
    port: parseInt(process.env.PORT || String(DEFAULT_PORT), 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    serverName: process.env.MCP_SERVER_NAME || 'redteam-mcp-server',
    version: process.env.MCP_VERSION || '1.0.0',
    logLevel: process.env.LOG_LEVEL || 'info',
    apiKey: process.env.API_KEY || '',
    maxConcurrentOperations: parseInt(process.env.MAX_CONCURRENT_OPERATIONS || String(DEFAULT_MAX_CONCURRENT_OPERATIONS), 10),
    maxAgentCount: parseInt(process.env.MAX_AGENT_COUNT || String(DEFAULT_MAX_AGENT_COUNT), 10),
    operationTimeout: parseInt(process.env.OPERATION_TIMEOUT || String(DEFAULT_OPERATION_TIMEOUT_MS), 10),
};
//# sourceMappingURL=index.js.map