import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Request,
} from '@modelcontextprotocol/sdk/types.js';

/**
 * Test helper to invoke a request handler on the server.
 * 
 * This function provides a safe way to test server request handling without
 * directly accessing private members. It simulates how the SDK internally
 * routes requests to registered handlers.
 * 
 * @param server - The MCP server instance
 * @param request - The request to send
 * @returns The response from the handler
 */
export async function invokeRequestHandler(server: Server, request: Request): Promise<any> {
  // Access the request handlers map - this is the only way to test the Server class
  // since it doesn't provide a public API for invoking handlers directly.
  // This is a known limitation of testing with the low-level Server API.
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
