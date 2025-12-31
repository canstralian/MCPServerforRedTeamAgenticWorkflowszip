import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Request,
} from '@modelcontextprotocol/sdk/types.js';

/**
 * Test helper to invoke a request handler on the server.
 * 
 * NOTE: This is a workaround for testing the low-level Server class, which does not
 * provide a public API for invoking handlers directly. This approach accesses private
 * members and is dependent on internal implementation details. This is a known
 * limitation when testing with the low-level Server API.
 * 
 * For new implementations, consider using McpServer which provides a better testing
 * interface through its public API.
 * 
 * @param server - The MCP server instance
 * @param request - The request to send
 * @returns The response from the handler
 */
export async function invokeRequestHandler(server: Server, request: Request): Promise<any> {
  // Access the request handlers map - this is the only way to test the Server class
  // since it doesn't provide a public API for invoking handlers directly.
  const handlers = (server as any)._requestHandlers;
  
  if (!handlers) {
    throw new Error('Server request handlers not initialized');
  }

  const handler = handlers.get(request.method);
  
  if (!handler) {
    throw new Error(`No handler registered for method: ${request.method}`);
  }

  return await handler(request);
}

/**
 * Helper to list all tools from the server.
 */
export async function listTools(server: Server) {
  return invokeRequestHandler(server, {
    method: ListToolsRequestSchema.shape.method.value,
    params: {},
  });
}

/**
 * Helper to call a tool on the server.
 */
export async function callTool(server: Server, name: string, args: Record<string, unknown>) {
  return invokeRequestHandler(server, {
    method: CallToolRequestSchema.shape.method.value,
    params: {
      name,
      arguments: args,
    },
  });
}
