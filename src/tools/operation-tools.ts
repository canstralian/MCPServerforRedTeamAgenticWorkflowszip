import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { store } from '../store/index.js';
import { Operation, OperationPhase, OperationStatus } from '../types/index.js';
import { logger } from '../utils/logger.js';

const CreateOperationSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  targetId: z.string().uuid(),
  phase: z.nativeEnum(OperationPhase).optional(),
  agentIds: z.array(z.string().uuid()).optional(),
});

const GetOperationSchema = z.object({
  operationId: z.string().uuid(),
});

const ListOperationsSchema = z.object({
  status: z.nativeEnum(OperationStatus).optional(),
  phase: z.nativeEnum(OperationPhase).optional(),
});

const UpdateOperationSchema = z.object({
  operationId: z.string().uuid(),
  phase: z.nativeEnum(OperationPhase).optional(),
  description: z.string().optional(),
});

function handleCreateOperation(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = CreateOperationSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const { name, description, targetId, phase, agentIds } = parsed.data;
  
  const operation: Operation = {
    id: uuidv4(),
    name,
    description,
    phase: phase || OperationPhase.PLANNING,
    status: OperationStatus.PENDING,
    targetId,
    agentIds: agentIds || [],
    startTime: new Date(),
    findings: [],
  };
  store.addOperation(operation);
  logger.info(`Created operation: ${operation.id}`);
  return { content: [{ type: 'text', text: JSON.stringify(operation, null, 2) }] };
}

function handleListOperations(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = ListOperationsSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  let operations = store.getAllOperations();
  if (parsed.data.status) {
    operations = operations.filter((o) => o.status === parsed.data.status);
  }
  if (parsed.data.phase) {
    operations = operations.filter((o) => o.phase === parsed.data.phase);
  }
  return { content: [{ type: 'text', text: JSON.stringify(operations, null, 2) }] };
}

function handleGetOperation(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = GetOperationSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const operation = store.getOperation(parsed.data.operationId);
  if (!operation) {
    return { content: [{ type: 'text', text: 'Operation not found' }] };
  }
  return { content: [{ type: 'text', text: JSON.stringify(operation, null, 2) }] };
}

function handleUpdateOperation(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = UpdateOperationSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const { operationId, ...updates } = parsed.data;
  const operation = store.updateOperation(operationId, updates as Partial<Operation>);
  if (!operation) {
    return { content: [{ type: 'text', text: 'Operation not found' }] };
  }
  logger.info(`Updated operation: ${operationId}`);
  return { content: [{ type: 'text', text: JSON.stringify(operation, null, 2) }] };
}

function handleStartOperation(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = GetOperationSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const operation = store.getOperation(parsed.data.operationId);
  if (!operation) {
    return { content: [{ type: 'text', text: 'Operation not found' }] };
  }
  const updated = store.updateOperation(parsed.data.operationId, {
    status: OperationStatus.IN_PROGRESS,
    startTime: new Date(),
  });
  logger.info(`Started operation: ${parsed.data.operationId}`);
  return { content: [{ type: 'text', text: JSON.stringify(updated, null, 2) }] };
}

function handleCompleteOperation(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = GetOperationSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const operation = store.getOperation(parsed.data.operationId);
  if (!operation) {
    return { content: [{ type: 'text', text: 'Operation not found' }] };
  }
  const updated = store.updateOperation(parsed.data.operationId, {
    status: OperationStatus.COMPLETED,
    endTime: new Date(),
  });
  logger.info(`Completed operation: ${parsed.data.operationId}`);
  return { content: [{ type: 'text', text: JSON.stringify(updated, null, 2) }] };
}

function handleDeleteOperation(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = GetOperationSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const success = store.deleteOperation(parsed.data.operationId);
  if (!success) {
    return { content: [{ type: 'text', text: 'Operation not found' }] };
  }
  logger.info(`Deleted operation: ${parsed.data.operationId}`);
  return { content: [{ type: 'text', text: 'Operation deleted successfully' }] };
}

export const operationTools = [
  {
    name: 'create_operation',
    description: 'Create a new red team operation targeting a specific system',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Operation name' },
        description: { type: 'string', description: 'Operation description and objectives' },
        targetId: { type: 'string', description: 'Target system ID (UUID format)' },
        phase: {
          type: 'string',
          enum: Object.values(OperationPhase),
          description: 'Initial operation phase (MITRE ATT&CK aligned)',
        },
        agentIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Agent IDs to assign to this operation',
        },
      },
      required: ['name', 'description', 'targetId'],
    },
  },
  {
    name: 'list_operations',
    description: 'List all operations with optional filtering',
    inputSchema: {
      type: 'object' as const,
      properties: {
        status: {
          type: 'string',
          enum: Object.values(OperationStatus),
          description: 'Filter by operation status',
        },
        phase: {
          type: 'string',
          enum: Object.values(OperationPhase),
          description: 'Filter by operation phase',
        },
      },
    },
  },
  {
    name: 'get_operation',
    description: 'Get detailed information about a specific operation including findings',
    inputSchema: {
      type: 'object' as const,
      properties: {
        operationId: { type: 'string', description: 'Operation ID (UUID format)' },
      },
      required: ['operationId'],
    },
  },
  {
    name: 'update_operation',
    description: 'Update operation details or phase',
    inputSchema: {
      type: 'object' as const,
      properties: {
        operationId: { type: 'string', description: 'Operation ID (UUID format)' },
        phase: {
          type: 'string',
          enum: Object.values(OperationPhase),
          description: 'New operation phase',
        },
        description: { type: 'string', description: 'Updated description' },
      },
      required: ['operationId'],
    },
  },
  {
    name: 'start_operation',
    description: 'Start an operation and set it to in-progress status',
    inputSchema: {
      type: 'object' as const,
      properties: {
        operationId: { type: 'string', description: 'Operation ID to start (UUID format)' },
      },
      required: ['operationId'],
    },
  },
  {
    name: 'complete_operation',
    description: 'Mark an operation as completed',
    inputSchema: {
      type: 'object' as const,
      properties: {
        operationId: { type: 'string', description: 'Operation ID to complete (UUID format)' },
      },
      required: ['operationId'],
    },
  },
  {
    name: 'delete_operation',
    description: 'Delete an operation and its associated data',
    inputSchema: {
      type: 'object' as const,
      properties: {
        operationId: { type: 'string', description: 'Operation ID to delete (UUID format)' },
      },
      required: ['operationId'],
    },
  },
];

export function handleOperationTool(name: string, args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } | null {
  switch (name) {
    case 'create_operation':
      return handleCreateOperation(args);
    case 'list_operations':
      return handleListOperations(args);
    case 'get_operation':
      return handleGetOperation(args);
    case 'update_operation':
      return handleUpdateOperation(args);
    case 'start_operation':
      return handleStartOperation(args);
    case 'complete_operation':
      return handleCompleteOperation(args);
    case 'delete_operation':
      return handleDeleteOperation(args);
    default:
      return null;
  }
}

export function registerOperationTools(server: Server): void {
}
