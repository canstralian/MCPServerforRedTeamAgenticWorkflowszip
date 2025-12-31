export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  capabilities: string[];
  createdAt: Date;
  lastActive: Date;
  // TODO: Add performance metrics (success rate, avg execution time)
  // TODO: Add cost tracking for agent operations
  // TODO: Add agent versioning for capability updates
  // TODO: Add agent health check status
  // TODO: Add tags/labels for agent organization
}

// TODO: Add more specialized agent types (network_scanner, web_crawler, etc.)
// TODO: Consider hierarchical agent types for better categorization
export enum AgentType {
  RECONNAISSANCE = 'reconnaissance',
  EXPLOITATION = 'exploitation',
  POST_EXPLOITATION = 'post_exploitation',
  PERSISTENCE = 'persistence',
  LATERAL_MOVEMENT = 'lateral_movement',
  COMMAND_CONTROL = 'command_control',
}

// TODO: Add PAUSED status for temporarily halted agents
// TODO: Add MAINTENANCE status for agents under update
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
  // TODO: Add operation priority level (critical, high, medium, low)
  // TODO: Add estimated completion time
  // TODO: Add operation dependencies for sequential workflows
  // TODO: Add operation metadata (tags, owner, team)
  // TODO: Add budget/cost tracking for operation
  // TODO: Add compliance framework mapping (NIST, ISO, etc.)
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

// TODO: Add PAUSED status for operations that can be resumed
// TODO: Add SCHEDULED status for future operations
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
  // TODO: Add geolocation data for target
  // TODO: Add technology stack detection results
  // TODO: Add asset criticality rating
  // TODO: Add compliance requirements for target
  // TODO: Add owner/team information
  // TODO: Add last scan timestamp and scan frequency
}

// TODO: Add more target types (IoT, mobile_app, container, kubernetes)
// TODO: Add blockchain/smart_contract target type
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
  // TODO: Add CVE identifier linking
  // TODO: Add CWE categorization
  // TODO: Add exploit availability status
  // TODO: Add OWASP Top 10 mapping
  // TODO: Add remediation effort estimation
  // TODO: Add affected versions/components
  // TODO: Add patch availability information
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
  // TODO: Add remediation status tracking (open, in_progress, resolved, accepted_risk)
  // TODO: Add finding validation status (verified, false_positive)
  // TODO: Add business impact assessment
  // TODO: Add remediation deadline/SLA
  // TODO: Add affected assets list
  // TODO: Add MITRE ATT&CK technique mapping
  // TODO: Add proof-of-concept code/steps
}

// TODO: Add more finding types (insecure_communication, insufficient_logging, etc.)
// TODO: Add compliance_violation type
export enum FindingType {
  VULNERABILITY = 'vulnerability',
  MISCONFIGURATION = 'misconfiguration',
  WEAK_CREDENTIAL = 'weak_credential',
  EXPOSED_DATA = 'exposed_data',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  LATERAL_MOVEMENT = 'lateral_movement',
}
