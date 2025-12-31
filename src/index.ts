import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools/index.js';
import { registerResources } from './resources/index.js';
import { logger } from './utils/logger.js';
import { config } from './config/index.js';

/**
 * MCP Red Team Server main entry point.
 * 
 * Note: This implementation uses the Server class from @modelcontextprotocol/sdk v1.25.1,
 * which is marked as deprecated in favor of McpServer for new implementations. However,
 * the Server class is still fully supported and backward-compatible with the SDK.
 * 
 * The current implementation has been tested and verified to work correctly with SDK 1.25.1.
 * A future refactoring to use McpServer with the high-level registerTool/registerResource
 * APIs would be beneficial but is not required for compatibility.
 */
async function main() {
  logger.info('Starting MCP Red Team Server...');

  const server = new Server(
    {
      name: config.serverName,
      version: config.version,
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  registerTools(server);
  registerResources(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info('MCP Red Team Server started successfully');
}

main().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
