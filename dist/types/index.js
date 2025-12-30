export var AgentType;
(function (AgentType) {
    AgentType["RECONNAISSANCE"] = "reconnaissance";
    AgentType["EXPLOITATION"] = "exploitation";
    AgentType["POST_EXPLOITATION"] = "post_exploitation";
    AgentType["PERSISTENCE"] = "persistence";
    AgentType["LATERAL_MOVEMENT"] = "lateral_movement";
    AgentType["COMMAND_CONTROL"] = "command_control";
})(AgentType || (AgentType = {}));
export var AgentStatus;
(function (AgentStatus) {
    AgentStatus["IDLE"] = "idle";
    AgentStatus["ACTIVE"] = "active";
    AgentStatus["COMPLETED"] = "completed";
    AgentStatus["FAILED"] = "failed";
    AgentStatus["SUSPENDED"] = "suspended";
})(AgentStatus || (AgentStatus = {}));
export var OperationPhase;
(function (OperationPhase) {
    OperationPhase["PLANNING"] = "planning";
    OperationPhase["RECONNAISSANCE"] = "reconnaissance";
    OperationPhase["INITIAL_ACCESS"] = "initial_access";
    OperationPhase["EXECUTION"] = "execution";
    OperationPhase["PERSISTENCE"] = "persistence";
    OperationPhase["PRIVILEGE_ESCALATION"] = "privilege_escalation";
    OperationPhase["DEFENSE_EVASION"] = "defense_evasion";
    OperationPhase["CREDENTIAL_ACCESS"] = "credential_access";
    OperationPhase["DISCOVERY"] = "discovery";
    OperationPhase["LATERAL_MOVEMENT"] = "lateral_movement";
    OperationPhase["COLLECTION"] = "collection";
    OperationPhase["EXFILTRATION"] = "exfiltration";
    OperationPhase["IMPACT"] = "impact";
})(OperationPhase || (OperationPhase = {}));
export var OperationStatus;
(function (OperationStatus) {
    OperationStatus["PENDING"] = "pending";
    OperationStatus["IN_PROGRESS"] = "in_progress";
    OperationStatus["COMPLETED"] = "completed";
    OperationStatus["FAILED"] = "failed";
    OperationStatus["CANCELLED"] = "cancelled";
})(OperationStatus || (OperationStatus = {}));
export var TargetType;
(function (TargetType) {
    TargetType["WEB_APPLICATION"] = "web_application";
    TargetType["NETWORK"] = "network";
    TargetType["HOST"] = "host";
    TargetType["API"] = "api";
    TargetType["DATABASE"] = "database";
    TargetType["CLOUD_INFRASTRUCTURE"] = "cloud_infrastructure";
})(TargetType || (TargetType = {}));
export var VulnerabilitySeverity;
(function (VulnerabilitySeverity) {
    VulnerabilitySeverity["CRITICAL"] = "critical";
    VulnerabilitySeverity["HIGH"] = "high";
    VulnerabilitySeverity["MEDIUM"] = "medium";
    VulnerabilitySeverity["LOW"] = "low";
    VulnerabilitySeverity["INFO"] = "info";
})(VulnerabilitySeverity || (VulnerabilitySeverity = {}));
export var FindingType;
(function (FindingType) {
    FindingType["VULNERABILITY"] = "vulnerability";
    FindingType["MISCONFIGURATION"] = "misconfiguration";
    FindingType["WEAK_CREDENTIAL"] = "weak_credential";
    FindingType["EXPOSED_DATA"] = "exposed_data";
    FindingType["PRIVILEGE_ESCALATION"] = "privilege_escalation";
    FindingType["LATERAL_MOVEMENT"] = "lateral_movement";
})(FindingType || (FindingType = {}));
//# sourceMappingURL=index.js.map