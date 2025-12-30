export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  capabilities: string[];
  createdAt: Date;
  lastActive: Date;
}

export enum AgentType {
  RECONNAISSANCE = 'reconnaissance',
  EXPLOITATION = 'exploitation',
  POST_EXPLOITATION = 'post_exploitation',
  PERSISTENCE = 'persistence',
  LATERAL_MOVEMENT = 'lateral_movement',
  COMMAND_CONTROL = 'command_control',
}

export enum AgentStatus {
  IDLE = 'idle',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SUSPENDED = 'suspended',
}

export interface Operation {
  id: string;
  name: string;
  description: string;
  phase: OperationPhase;
  status: OperationStatus;
  targetId: string;
  agentIds: string[];
  startTime: Date;
  endTime?: Date;
  findings: Finding[];
}

export enum OperationPhase {
  PLANNING = 'planning',
  RECONNAISSANCE = 'reconnaissance',
  INITIAL_ACCESS = 'initial_access',
  EXECUTION = 'execution',
  PERSISTENCE = 'persistence',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  DEFENSE_EVASION = 'defense_evasion',
  CREDENTIAL_ACCESS = 'credential_access',
  DISCOVERY = 'discovery',
  LATERAL_MOVEMENT = 'lateral_movement',
  COLLECTION = 'collection',
  EXFILTRATION = 'exfiltration',
  IMPACT = 'impact',
}

export enum OperationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface Target {
  id: string;
  name: string;
  type: TargetType;
  ipAddress?: string;
  domain?: string;
  ports?: number[];
  vulnerabilities?: Vulnerability[];
  metadata: Record<string, any>;
}

export enum TargetType {
  WEB_APPLICATION = 'web_application',
  NETWORK = 'network',
  HOST = 'host',
  API = 'api',
  DATABASE = 'database',
  CLOUD_INFRASTRUCTURE = 'cloud_infrastructure',
}

export interface Vulnerability {
  id: string;
  name: string;
  severity: VulnerabilitySeverity;
  cvss: number;
  description: string;
  exploitable: boolean;
  mitigation?: string;
}

export enum VulnerabilitySeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

export interface Finding {
  id: string;
  operationId: string;
  agentId: string;
  type: FindingType;
  severity: VulnerabilitySeverity;
  title: string;
  description: string;
  evidence: string[];
  timestamp: Date;
  mitigation?: string;
}

export enum FindingType {
  VULNERABILITY = 'vulnerability',
  MISCONFIGURATION = 'misconfiguration',
  WEAK_CREDENTIAL = 'weak_credential',
  EXPOSED_DATA = 'exposed_data',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  LATERAL_MOVEMENT = 'lateral_movement',
}
