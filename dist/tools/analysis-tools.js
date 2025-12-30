import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { store } from '../store/index.js';
import { FindingType, VulnerabilitySeverity } from '../types/index.js';
import { logger } from '../utils/logger.js';
const AddFindingSchema = z.object({
    operationId: z.string().uuid(),
    agentId: z.string().uuid(),
    type: z.nativeEnum(FindingType),
    severity: z.nativeEnum(VulnerabilitySeverity),
    title: z.string().min(1),
    description: z.string().min(1),
    evidence: z.array(z.string()).optional(),
    mitigation: z.string().optional(),
});
const ListFindingsSchema = z.object({
    operationId: z.string().uuid().optional(),
    agentId: z.string().uuid().optional(),
    severity: z.nativeEnum(VulnerabilitySeverity).optional(),
});
const GetFindingSchema = z.object({
    findingId: z.string().uuid(),
});
const GenerateReportSchema = z.object({
    operationId: z.string().uuid(),
});
function handleAddFinding(args) {
    const parsed = AddFindingSchema.safeParse(args);
    if (!parsed.success) {
        return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
    }
    const { operationId, agentId, type, severity, title, description, evidence, mitigation } = parsed.data;
    const finding = {
        id: uuidv4(),
        operationId,
        agentId,
        type,
        severity,
        title,
        description,
        evidence: evidence || [],
        timestamp: new Date(),
        mitigation,
    };
    store.addFinding(finding);
    logger.info(`Added finding: ${finding.id}`);
    return { content: [{ type: 'text', text: JSON.stringify(finding, null, 2) }] };
}
function handleListFindings(args) {
    const parsed = ListFindingsSchema.safeParse(args);
    if (!parsed.success) {
        return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
    }
    let findings = store.getAllFindings();
    if (parsed.data.operationId) {
        findings = store.getFindingsByOperation(parsed.data.operationId);
    }
    if (parsed.data.agentId) {
        findings = store.getFindingsByAgent(parsed.data.agentId);
    }
    if (parsed.data.severity) {
        findings = findings.filter((f) => f.severity === parsed.data.severity);
    }
    return { content: [{ type: 'text', text: JSON.stringify(findings, null, 2) }] };
}
function handleGetFinding(args) {
    const parsed = GetFindingSchema.safeParse(args);
    if (!parsed.success) {
        return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
    }
    const finding = store.getFinding(parsed.data.findingId);
    if (!finding) {
        return { content: [{ type: 'text', text: 'Finding not found' }] };
    }
    return { content: [{ type: 'text', text: JSON.stringify(finding, null, 2) }] };
}
function handleGenerateReport(args) {
    const parsed = GenerateReportSchema.safeParse(args);
    if (!parsed.success) {
        return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
    }
    const operation = store.getOperation(parsed.data.operationId);
    if (!operation) {
        return { content: [{ type: 'text', text: 'Operation not found' }] };
    }
    const target = store.getTarget(operation.targetId);
    const findings = store.getFindingsByOperation(parsed.data.operationId);
    const agents = operation.agentIds.map(id => store.getAgent(id)).filter(Boolean);
    const criticalFindings = findings.filter(f => f.severity === VulnerabilitySeverity.CRITICAL);
    const highFindings = findings.filter(f => f.severity === VulnerabilitySeverity.HIGH);
    const mediumFindings = findings.filter(f => f.severity === VulnerabilitySeverity.MEDIUM);
    const lowFindings = findings.filter(f => f.severity === VulnerabilitySeverity.LOW);
    const report = {
        reportId: uuidv4(),
        generatedAt: new Date().toISOString(),
        operation: {
            id: operation.id,
            name: operation.name,
            description: operation.description,
            phase: operation.phase,
            status: operation.status,
            duration: operation.endTime
                ? `${Math.round((new Date(operation.endTime).getTime() - new Date(operation.startTime).getTime()) / 1000 / 60)} minutes`
                : 'In Progress',
        },
        target: target ? {
            name: target.name,
            type: target.type,
            domain: target.domain,
            ipAddress: target.ipAddress,
            vulnerabilityCount: target.vulnerabilities?.length || 0,
        } : null,
        summary: {
            totalFindings: findings.length,
            critical: criticalFindings.length,
            high: highFindings.length,
            medium: mediumFindings.length,
            low: lowFindings.length,
            agentsDeployed: agents.length,
        },
        findings: findings.map(f => ({
            id: f.id,
            type: f.type,
            severity: f.severity,
            title: f.title,
            description: f.description,
            mitigation: f.mitigation,
        })),
        recommendations: generateRecommendations(findings),
    };
    logger.info(`Generated report for operation: ${parsed.data.operationId}`);
    return { content: [{ type: 'text', text: JSON.stringify(report, null, 2) }] };
}
function generateRecommendations(findings) {
    const recommendations = [];
    const findingTypes = new Set(findings.map(f => f.type));
    if (findingTypes.has(FindingType.VULNERABILITY)) {
        recommendations.push('Prioritize patching identified vulnerabilities based on severity');
    }
    if (findingTypes.has(FindingType.MISCONFIGURATION)) {
        recommendations.push('Review and harden system configurations');
    }
    if (findingTypes.has(FindingType.WEAK_CREDENTIAL)) {
        recommendations.push('Implement stronger password policies and multi-factor authentication');
    }
    if (findingTypes.has(FindingType.EXPOSED_DATA)) {
        recommendations.push('Encrypt sensitive data and implement proper access controls');
    }
    if (findingTypes.has(FindingType.PRIVILEGE_ESCALATION)) {
        recommendations.push('Review and restrict privilege assignments following least-privilege principle');
    }
    if (findingTypes.has(FindingType.LATERAL_MOVEMENT)) {
        recommendations.push('Implement network segmentation and monitor for lateral movement indicators');
    }
    if (recommendations.length === 0) {
        recommendations.push('Continue regular security assessments');
    }
    return recommendations;
}
function handleGetStatistics() {
    const operations = store.getAllOperations();
    const targets = store.getAllTargets();
    const agents = store.getAllAgents();
    const findings = store.getAllFindings();
    const stats = {
        overview: {
            totalOperations: operations.length,
            activeOperations: operations.filter(o => o.status === 'in_progress').length,
            completedOperations: operations.filter(o => o.status === 'completed').length,
            totalTargets: targets.length,
            totalAgents: agents.length,
            totalFindings: findings.length,
        },
        findingsBySeverity: {
            critical: findings.filter(f => f.severity === VulnerabilitySeverity.CRITICAL).length,
            high: findings.filter(f => f.severity === VulnerabilitySeverity.HIGH).length,
            medium: findings.filter(f => f.severity === VulnerabilitySeverity.MEDIUM).length,
            low: findings.filter(f => f.severity === VulnerabilitySeverity.LOW).length,
            info: findings.filter(f => f.severity === VulnerabilitySeverity.INFO).length,
        },
        findingsByType: {
            vulnerability: findings.filter(f => f.type === FindingType.VULNERABILITY).length,
            misconfiguration: findings.filter(f => f.type === FindingType.MISCONFIGURATION).length,
            weakCredential: findings.filter(f => f.type === FindingType.WEAK_CREDENTIAL).length,
            exposedData: findings.filter(f => f.type === FindingType.EXPOSED_DATA).length,
            privilegeEscalation: findings.filter(f => f.type === FindingType.PRIVILEGE_ESCALATION).length,
            lateralMovement: findings.filter(f => f.type === FindingType.LATERAL_MOVEMENT).length,
        },
        targetsByType: targets.reduce((acc, t) => {
            acc[t.type] = (acc[t.type] || 0) + 1;
            return acc;
        }, {}),
    };
    return { content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }] };
}
export const analysisTools = [
    {
        name: 'add_finding',
        description: 'Record a security finding discovered during an operation',
        inputSchema: {
            type: 'object',
            properties: {
                operationId: { type: 'string', description: 'Operation ID this finding belongs to (UUID format)' },
                agentId: { type: 'string', description: 'Agent ID that discovered this finding (UUID format)' },
                type: {
                    type: 'string',
                    enum: Object.values(FindingType),
                    description: 'Type of security finding',
                },
                severity: {
                    type: 'string',
                    enum: Object.values(VulnerabilitySeverity),
                    description: 'Finding severity level',
                },
                title: { type: 'string', description: 'Brief title of the finding' },
                description: { type: 'string', description: 'Detailed description of the finding' },
                evidence: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Evidence supporting this finding (logs, screenshots, etc.)',
                },
                mitigation: { type: 'string', description: 'Recommended mitigation steps' },
            },
            required: ['operationId', 'agentId', 'type', 'severity', 'title', 'description'],
        },
    },
    {
        name: 'list_findings',
        description: 'List security findings with optional filtering',
        inputSchema: {
            type: 'object',
            properties: {
                operationId: { type: 'string', description: 'Filter by operation ID (UUID format)' },
                agentId: { type: 'string', description: 'Filter by agent ID (UUID format)' },
                severity: {
                    type: 'string',
                    enum: Object.values(VulnerabilitySeverity),
                    description: 'Filter by severity',
                },
            },
        },
    },
    {
        name: 'get_finding',
        description: 'Get detailed information about a specific finding',
        inputSchema: {
            type: 'object',
            properties: {
                findingId: { type: 'string', description: 'Finding ID (UUID format)' },
            },
            required: ['findingId'],
        },
    },
    {
        name: 'generate_report',
        description: 'Generate a comprehensive security assessment report for an operation',
        inputSchema: {
            type: 'object',
            properties: {
                operationId: { type: 'string', description: 'Operation ID to generate report for (UUID format)' },
            },
            required: ['operationId'],
        },
    },
    {
        name: 'get_statistics',
        description: 'Get overall statistics and metrics across all operations',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
];
export function handleAnalysisTool(name, args) {
    switch (name) {
        case 'add_finding':
            return handleAddFinding(args);
        case 'list_findings':
            return handleListFindings(args);
        case 'get_finding':
            return handleGetFinding(args);
        case 'generate_report':
            return handleGenerateReport(args);
        case 'get_statistics':
            return handleGetStatistics();
        default:
            return null;
    }
}
export function registerAnalysisTools(server) {
}
//# sourceMappingURL=analysis-tools.js.map