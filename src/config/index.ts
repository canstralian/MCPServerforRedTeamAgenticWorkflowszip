import dotenv from 'dotenv';

dotenv.config();

// TODO: Add configuration validation using Zod or similar library to catch errors early
// TODO: Support multiple configuration sources (env, config file, CLI args) with precedence
// TODO: Add environment-specific configuration files (dev, staging, prod)
// TODO: Implement config hot-reloading for dynamic settings updates
// TODO: Add sensitive data encryption for API keys in config
// TODO: Create typed configuration interface for better IDE support
// TODO: Add configuration documentation generator for auto-generating .env.example
// TODO: Implement feature flags system for gradual rollout of new features

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
  // TODO: Add database connection settings when moving from in-memory storage
  // TODO: Add Redis/cache configuration for session management
  // TODO: Add rate limiting configuration (requests per minute/hour)
  // TODO: Add webhook configuration for operation notifications
  // TODO: Add backup/restore configuration settings
};
