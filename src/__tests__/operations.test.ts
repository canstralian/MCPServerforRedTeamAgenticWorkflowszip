import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
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

describe('Operation Tools with SDK 1.25.1', () => {
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
    registerTools(server);
  });

  test('should create and retrieve an operation', async () => {
    const handler = (server as any)._requestHandlers?.get(CallToolRequestSchema.shape.method.value);
    expect(handler).toBeDefined();

    if (handler) {
      // First create a target
      const targetResult = await handler({
        method: 'tools/call',
        params: {
          name: 'create_target',
          arguments: {
            name: 'Test Target',
            type: 'web_application',
            domain: 'example.com',
          },
        },
      });

      const target = JSON.parse(targetResult.content[0].text);
      expect(target).toHaveProperty('id');

      // Create an operation
      const createResult = await handler({
        method: 'tools/call',
        params: {
          name: 'create_operation',
          arguments: {
            name: 'Test Operation',
            description: 'Testing operation creation',
            targetId: target.id,
          },
        },
      });

      expect(createResult).toHaveProperty('content');
      const operation = JSON.parse(createResult.content[0].text);
      expect(operation).toHaveProperty('id');
      expect(operation).toHaveProperty('name', 'Test Operation');
      expect(operation).toHaveProperty('status', 'pending');
      expect(operation).toHaveProperty('phase', 'planning');

      // Retrieve the operation
      const getResult = await handler({
        method: 'tools/call',
        params: {
          name: 'get_operation',
          arguments: {
            operationId: operation.id,
          },
        },
      });

      const retrievedOp = JSON.parse(getResult.content[0].text);
      expect(retrievedOp.id).toBe(operation.id);
      expect(retrievedOp.name).toBe('Test Operation');
    }
  });

  test('should list operations', async () => {
    const handler = (server as any)._requestHandlers?.get(CallToolRequestSchema.shape.method.value);
    
    if (handler) {
      const result = await handler({
        method: 'tools/call',
        params: {
          name: 'list_operations',
          arguments: {},
        },
      });

      expect(result).toHaveProperty('content');
      const operations = JSON.parse(result.content[0].text);
      expect(Array.isArray(operations)).toBe(true);
    }
  });

  test('should update operation phase', async () => {
    const handler = (server as any)._requestHandlers?.get(CallToolRequestSchema.shape.method.value);
    
    if (handler) {
      // Create target and operation first
      const targetResult = await handler({
        method: 'tools/call',
        params: {
          name: 'create_target',
          arguments: {
            name: 'Test Target',
            type: 'network',
            ipAddress: '192.168.1.1',
          },
        },
      });

      const target = JSON.parse(targetResult.content[0].text);

      const createResult = await handler({
        method: 'tools/call',
        params: {
          name: 'create_operation',
          arguments: {
            name: 'Update Test',
            description: 'Test update',
            targetId: target.id,
          },
        },
      });

      const operation = JSON.parse(createResult.content[0].text);

      // Update operation
      const updateResult = await handler({
        method: 'tools/call',
        params: {
          name: 'update_operation',
          arguments: {
            operationId: operation.id,
            phase: 'reconnaissance',
          },
        },
      });

      const updated = JSON.parse(updateResult.content[0].text);
      expect(updated.phase).toBe('reconnaissance');
    }
  });
});
