class DataStore {
    agents = new Map();
    operations = new Map();
    targets = new Map();
    findings = new Map();
    // Agent methods
    addAgent(agent) {
        this.agents.set(agent.id, agent);
    }
    getAgent(id) {
        return this.agents.get(id);
    }
    getAllAgents() {
        return Array.from(this.agents.values());
    }
    updateAgent(id, updates) {
        const agent = this.agents.get(id);
        if (agent) {
            const updated = { ...agent, ...updates };
            this.agents.set(id, updated);
            return updated;
        }
        return undefined;
    }
    deleteAgent(id) {
        return this.agents.delete(id);
    }
    // Operation methods
    addOperation(operation) {
        this.operations.set(operation.id, operation);
    }
    getOperation(id) {
        return this.operations.get(id);
    }
    getAllOperations() {
        return Array.from(this.operations.values());
    }
    updateOperation(id, updates) {
        const operation = this.operations.get(id);
        if (operation) {
            const updated = { ...operation, ...updates };
            this.operations.set(id, updated);
            return updated;
        }
        return undefined;
    }
    deleteOperation(id) {
        return this.operations.delete(id);
    }
    // Target methods
    addTarget(target) {
        this.targets.set(target.id, target);
    }
    getTarget(id) {
        return this.targets.get(id);
    }
    getAllTargets() {
        return Array.from(this.targets.values());
    }
    updateTarget(id, updates) {
        const target = this.targets.get(id);
        if (target) {
            const updated = { ...target, ...updates };
            this.targets.set(id, updated);
            return updated;
        }
        return undefined;
    }
    deleteTarget(id) {
        return this.targets.delete(id);
    }
    // Finding methods
    addFinding(finding) {
        this.findings.set(finding.id, finding);
    }
    getFinding(id) {
        return this.findings.get(id);
    }
    getAllFindings() {
        return Array.from(this.findings.values());
    }
    getFindingsByOperation(operationId) {
        return Array.from(this.findings.values()).filter((f) => f.operationId === operationId);
    }
    getFindingsByAgent(agentId) {
        return Array.from(this.findings.values()).filter((f) => f.agentId === agentId);
    }
}
export const store = new DataStore();
//# sourceMappingURL=index.js.map