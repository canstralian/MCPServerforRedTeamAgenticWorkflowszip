import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { registerTools } from '../tools/index.js';
import { callTool } from './helpers.js';

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
    // First create a target
    const targetResult = await callTool(server, 'create_target', {
      name: 'Test Target',
      type: 'web_application',
      domain: 'example.com',
    });

    const target = JSON.parse(targetResult.content[0].text);
    expect(target).toHaveProperty('id');

    // Create an operation
    const createResult = await callTool(server, 'create_operation', {
      name: 'Test Operation',
      description: 'Testing operation creation',
      targetId: target.id,
    });

    expect(createResult).toHaveProperty('content');
    const operation = JSON.parse(createResult.content[0].text);
    expect(operation).toHaveProperty('id');
    expect(operation).toHaveProperty('name', 'Test Operation');
    expect(operation).toHaveProperty('status', 'pending');
    expect(operation).toHaveProperty('phase', 'planning');

    // Retrieve the operation
    const getResult = await callTool(server, 'get_operation', {
      operationId: operation.id,
    });

    const retrievedOp = JSON.parse(getResult.content[0].text);
    expect(retrievedOp.id).toBe(operation.id);
    expect(retrievedOp.name).toBe('Test Operation');
  });

  test('should list operations', async () => {
    const result = await callTool(server, 'list_operations', {});

    expect(result).toHaveProperty('content');
    const operations = JSON.parse(result.content[0].text);
    expect(Array.isArray(operations)).toBe(true);
  });

  test('should update operation phase', async () => {
    // Create target and operation first
    const targetResult = await callTool(server, 'create_target', {
      name: 'Test Target',
      type: 'network',
      ipAddress: '192.168.1.1',
    });

    const target = JSON.parse(targetResult.content[0].text);

    const createResult = await callTool(server, 'create_operation', {
      name: 'Update Test',
      description: 'Test update',
      targetId: target.id,
    });

    const operation = JSON.parse(createResult.content[0].text);

    // Update operation
    const updateResult = await callTool(server, 'update_operation', {
      operationId: operation.id,
      phase: 'reconnaissance',
    });

    const updated = JSON.parse(updateResult.content[0].text);
    expect(updated.phase).toBe('reconnaissance');
  });
});
