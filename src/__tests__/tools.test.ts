import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { registerTools } from '../tools/index.js';

// Mock the connectors to avoid ESM issues with external dependencies
jest.mock('../connectors/index.js', () => ({
  connectors: {
    getOrCreateConnection: jest.fn(),
    listConnections: jest.fn(),
    deleteConnection: jest.fn(),
  },
  linearConnector: { execute: jest.fn() },
  notionConnector: { execute: jest.fn() },
  googleConnector: { execute: jest.fn() },
  githubConnector: { execute: jest.fn() },
}));

describe('Tool Registration with SDK 1.25.1', () => {
  let server: Server;

  beforeEach(() => {
    server = new Server(
      {
        name: 'test-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
  });

  test('should register tools successfully', () => {
    expect(() => registerTools(server)).not.toThrow();
  });

  test('should list all registered tools', async () => {
    registerTools(server);

    // Simulate ListToolsRequest
    const handler = (server as any)._requestHandlers?.get(ListToolsRequestSchema.shape.method.value);
    expect(handler).toBeDefined();

    if (handler) {
      const result = await handler({ method: 'tools/list', params: {} });
      expect(result).toHaveProperty('tools');
      expect(Array.isArray(result.tools)).toBe(true);
      expect(result.tools.length).toBeGreaterThan(0);

      // Verify each tool has required properties
      result.tools.forEach((tool: any) => {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('inputSchema');
        expect(tool.inputSchema).toHaveProperty('type');
        expect(tool.inputSchema.type).toBe('object');
      });
    }
  });

  test('should handle tool calls for agent tools', async () => {
    registerTools(server);

    const handler = (server as any)._requestHandlers?.get(CallToolRequestSchema.shape.method.value);
    expect(handler).toBeDefined();

    if (handler) {
      const result = await handler({
        method: 'tools/call',
        params: {
          name: 'list_agents',
          arguments: {},
        },
      });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content[0]).toHaveProperty('type');
      expect(result.content[0]).toHaveProperty('text');
    }
  });

  test('should handle unknown tool gracefully', async () => {
    registerTools(server);

    const handler = (server as any)._requestHandlers?.get(CallToolRequestSchema.shape.method.value);
    expect(handler).toBeDefined();

    if (handler) {
      const result = await handler({
        method: 'tools/call',
        params: {
          name: 'nonexistent_tool',
          arguments: {},
        },
      });

      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toContain('Unknown tool');
    }
  });

  test('should handle agent creation', async () => {
    registerTools(server);

    const handler = (server as any)._requestHandlers?.get(CallToolRequestSchema.shape.method.value);
    
    if (handler) {
      const result = await handler({
        method: 'tools/call',
        params: {
          name: 'create_agent',
          arguments: {
            name: 'Test Agent',
            type: 'reconnaissance',
            capabilities: ['network-scan', 'port-scan'],
          },
        },
      });

      expect(result).toHaveProperty('content');
      expect(result.content[0].type).toBe('text');
      
      const agentData = JSON.parse(result.content[0].text);
      expect(agentData).toHaveProperty('id');
      expect(agentData).toHaveProperty('name', 'Test Agent');
      expect(agentData).toHaveProperty('type', 'reconnaissance');
      expect(agentData).toHaveProperty('status', 'idle');
    }
  });

  test('should reject invalid tool arguments', async () => {
    registerTools(server);

    const handler = (server as any)._requestHandlers?.get(CallToolRequestSchema.shape.method.value);
    
    if (handler) {
      const result = await handler({
        method: 'tools/call',
        params: {
          name: 'create_agent',
          arguments: {
            // Missing required 'name' field
            type: 'reconnaissance',
          },
        },
      });

      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toContain('Invalid arguments');
    }
  });
});
