import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { store } from '../store/index.js';
import { Target, TargetType, Vulnerability, VulnerabilitySeverity } from '../types/index.js';
import { logger } from '../utils/logger.js';

const CreateTargetSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.nativeEnum(TargetType),
  ipAddress: z.string().max(45).optional(), // Max IPv6 length
  domain: z.string().max(253).optional(), // Max domain length
  ports: z.array(z.number().min(1).max(65535)).max(1000).optional(),
  metadata: z.record(z.unknown()).optional(),
});

const GetTargetSchema = z.object({
  targetId: z.string().uuid(),
});

const ListTargetsSchema = z.object({
  type: z.nativeEnum(TargetType).optional(),
});

const UpdateTargetSchema = z.object({
  targetId: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  ipAddress: z.string().max(45).optional(),
  domain: z.string().max(253).optional(),
  ports: z.array(z.number().min(1).max(65535)).max(1000).optional(),
});

const AddVulnerabilitySchema = z.object({
  targetId: z.string().uuid(),
  name: z.string().min(1).max(255),
  severity: z.nativeEnum(VulnerabilitySeverity),
  cvss: z.number().min(0).max(10),
  description: z.string().min(1).max(5000),
  exploitable: z.boolean().optional(),
  mitigation: z.string().max(5000).optional(),
});

function handleCreateTarget(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = CreateTargetSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const { name, type, ipAddress, domain, ports, metadata } = parsed.data;
  
  const target: Target = {
    id: uuidv4(),
    name,
    type,
    ipAddress,
    domain,
    ports,
    vulnerabilities: [],
    metadata: metadata || {},
  };
  store.addTarget(target);
  logger.info(`Created target: ${target.id}`);
  return { content: [{ type: 'text', text: JSON.stringify(target, null, 2) }] };
}

function handleListTargets(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = ListTargetsSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  let targets = store.getAllTargets();
  if (parsed.data.type) {
    targets = targets.filter((t) => t.type === parsed.data.type);
  }
  return { content: [{ type: 'text', text: JSON.stringify(targets, null, 2) }] };
}

function handleGetTarget(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = GetTargetSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const target = store.getTarget(parsed.data.targetId);
  if (!target) {
    return { content: [{ type: 'text', text: 'Target not found' }] };
  }
  return { content: [{ type: 'text', text: JSON.stringify(target, null, 2) }] };
}

function handleUpdateTarget(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = UpdateTargetSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const { targetId, ...updates } = parsed.data;
  const target = store.updateTarget(targetId, updates as Partial<Target>);
  if (!target) {
    return { content: [{ type: 'text', text: 'Target not found' }] };
  }
  logger.info(`Updated target: ${targetId}`);
  return { content: [{ type: 'text', text: JSON.stringify(target, null, 2) }] };
}

function handleAddVulnerability(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = AddVulnerabilitySchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const { targetId, name, severity, cvss, description, exploitable, mitigation } = parsed.data;
  
  const target = store.getTarget(targetId);
  if (!target) {
    return { content: [{ type: 'text', text: 'Target not found' }] };
  }
  
  const vulnerability: Vulnerability = {
    id: uuidv4(),
    name,
    severity,
    cvss,
    description,
    exploitable: exploitable || false,
    mitigation,
  };
  
  const updatedVulnerabilities = [...(target.vulnerabilities || []), vulnerability];
  store.updateTarget(targetId, { vulnerabilities: updatedVulnerabilities });
  logger.info(`Added vulnerability ${vulnerability.id} to target ${targetId}`);
  return { content: [{ type: 'text', text: JSON.stringify(vulnerability, null, 2) }] };
}

function handleDeleteTarget(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = GetTargetSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const success = store.deleteTarget(parsed.data.targetId);
  if (!success) {
    return { content: [{ type: 'text', text: 'Target not found' }] };
  }
  logger.info(`Deleted target: ${parsed.data.targetId}`);
  return { content: [{ type: 'text', text: 'Target deleted successfully' }] };
}

export const targetTools = [
  {
    name: 'create_target',
    description: 'Create a new target for red team operations (web app, network, host, API, database, or cloud)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Target name or identifier' },
        type: {
          type: 'string',
          enum: Object.values(TargetType),
          description: 'Type of target system',
        },
        ipAddress: { type: 'string', description: 'IP address (if applicable)' },
        domain: { type: 'string', description: 'Domain name (if applicable)' },
        ports: {
          type: 'array',
          items: { type: 'number' },
          description: 'Open ports discovered',
        },
        metadata: {
          type: 'object',
          description: 'Additional target metadata',
        },
      },
      required: ['name', 'type'],
    },
  },
  {
    name: 'list_targets',
    description: 'List all targets with optional type filtering',
    inputSchema: {
      type: 'object' as const,
      properties: {
        type: {
          type: 'string',
          enum: Object.values(TargetType),
          description: 'Filter by target type',
        },
      },
    },
  },
  {
    name: 'get_target',
    description: 'Get detailed information about a specific target including vulnerabilities',
    inputSchema: {
      type: 'object' as const,
      properties: {
        targetId: { type: 'string', description: 'Target ID (UUID format)' },
      },
      required: ['targetId'],
    },
  },
  {
    name: 'update_target',
    description: 'Update target information',
    inputSchema: {
      type: 'object' as const,
      properties: {
        targetId: { type: 'string', description: 'Target ID (UUID format)' },
        name: { type: 'string', description: 'Updated name' },
        ipAddress: { type: 'string', description: 'Updated IP address' },
        domain: { type: 'string', description: 'Updated domain' },
        ports: {
          type: 'array',
          items: { type: 'number' },
          description: 'Updated port list',
        },
      },
      required: ['targetId'],
    },
  },
  {
    name: 'add_vulnerability',
    description: 'Add a discovered vulnerability to a target',
    inputSchema: {
      type: 'object' as const,
      properties: {
        targetId: { type: 'string', description: 'Target ID (UUID format)' },
        name: { type: 'string', description: 'Vulnerability name (e.g., CVE-2024-XXXX)' },
        severity: {
          type: 'string',
          enum: Object.values(VulnerabilitySeverity),
          description: 'Vulnerability severity level',
        },
        cvss: { type: 'number', description: 'CVSS score (0-10)' },
        description: { type: 'string', description: 'Detailed vulnerability description' },
        exploitable: { type: 'boolean', description: 'Whether the vulnerability is exploitable' },
        mitigation: { type: 'string', description: 'Recommended mitigation steps' },
      },
      required: ['targetId', 'name', 'severity', 'cvss', 'description'],
    },
  },
  {
    name: 'delete_target',
    description: 'Delete a target from the system',
    inputSchema: {
      type: 'object' as const,
      properties: {
        targetId: { type: 'string', description: 'Target ID to delete (UUID format)' },
      },
      required: ['targetId'],
    },
  },
];

export function handleTargetTool(name: string, args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } | null {
  switch (name) {
    case 'create_target':
      return handleCreateTarget(args);
    case 'list_targets':
      return handleListTargets(args);
    case 'get_target':
      return handleGetTarget(args);
    case 'update_target':
      return handleUpdateTarget(args);
    case 'add_vulnerability':
      return handleAddVulnerability(args);
    case 'delete_target':
      return handleDeleteTarget(args);
    default:
      return null;
  }
}
