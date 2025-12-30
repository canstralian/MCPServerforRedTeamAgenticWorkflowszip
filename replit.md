# MCP Red Team Server

## Overview

This is a Model Context Protocol (MCP) server for red team agentic workflows. It provides a comprehensive set of tools for managing security assessment operations, agents, targets, and findings through the MCP standard protocol.

**Purpose:** Enable LLMs to orchestrate red team security assessments through structured tool calls.

**Current State:** Fully functional MCP server with 45 tools organized by MITRE ATT&CK workflow stages, plus comprehensive security integrations for VirusTotal, AlienVault OTX, and HackerOne.

## LLM Compatibility

This server implements the **Model Context Protocol (MCP)** standard, making it compatible with any LLM that supports MCP tool calling:

### Supported LLM Platforms
- **Claude** (Anthropic) - Native MCP support via Claude Desktop and API
- **OpenAI GPT-4/GPT-4o** - Via MCP client adapters
- **Google Gemini** - Via MCP client adapters  
- **Open-source models** - Any model supporting function/tool calling with an MCP adapter

### Connection Method
The server uses **StdioServerTransport** for communication:
- Communicates via standard input/output (stdin/stdout)
- JSON-RPC 2.0 message format
- Supports tool listing and tool calling protocols

### Integration Example
```json
{
  "mcpServers": {
    "redteam": {
      "command": "npm",
      "args": ["run", "start"],
      "cwd": "/path/to/project"
    }
  }
}
```

## Tools by Workflow Stage (MITRE ATT&CK Aligned)

### 1. PLANNING (6 tools)
Setup agents, operations, and targets before engagement begins.

| Tool | Description |
|------|-------------|
| `create_agent` | Create a new agent with type and capabilities |
| `list_agents` | List all agents, optionally filtered by status |
| `get_agent` | Get detailed info about a specific agent |
| `update_agent` | Update agent properties |
| `create_operation` | Create a new operation targeting a system |
| `create_target` | Define a new target (web app, network, host, API, database, cloud) |

### 2. RECONNAISSANCE (11 tools)
Gather intelligence on targets using built-in tools and external APIs.

| Tool | Description |
|------|-------------|
| `list_operations` | List operations with status/phase filters |
| `get_operation` | Get operation details including findings |
| `list_targets` | List all targets with optional type filter |
| `get_target` | Get target details including vulnerabilities |
| `update_target` | Update target information |
| `virustotal_scan_hash` | Look up file hash on VirusTotal for malware analysis |
| `virustotal_scan_url` | Scan URL on VirusTotal for malicious content |
| `virustotal_scan_ip` | Get VirusTotal report for an IP address |
| `virustotal_scan_domain` | Get VirusTotal report for a domain |
| `otx_get_indicator` | Get AlienVault OTX threat intelligence for IOCs |
| `otx_get_pulses` | Get AlienVault OTX threat feeds/pulses |

### 3. EXPLOITATION (4 tools)
Execute attacks, activate agents, and record vulnerabilities.

| Tool | Description |
|------|-------------|
| `activate_agent` | Set agent status to active for deployment |
| `start_operation` | Begin execution of an operation |
| `update_operation` | Update operation phase or details |
| `add_vulnerability` | Record a vulnerability on a target |

### 4. POST-EXPLOITATION (1 tool)
Document findings during active exploitation.

| Tool | Description |
|------|-------------|
| `add_finding` | Record a security finding with severity, evidence, and mitigation |

### 5. REPORTING (10 tools)
Generate reports, review findings, and clean up resources.

| Tool | Description |
|------|-------------|
| `list_findings` | List findings filtered by operation, agent, or severity |
| `get_finding` | Get detailed finding information |
| `generate_report` | Generate comprehensive operation report |
| `get_statistics` | Get overall metrics across all operations |
| `complete_operation` | Mark operation as completed |
| `delete_operation` | Remove an operation |
| `delete_target` | Remove a target |
| `delete_agent` | Remove an agent |
| `hackerone_list_reports` | List HackerOne vulnerability reports |
| `hackerone_get_report` | Get HackerOne report details |

## Security Integrations

### VirusTotal
- **Purpose:** File/URL/IP/domain scanning and malware analysis
- **API Key:** `VIRUSTOTAL_API_KEY`
- **Docs:** https://developers.virustotal.com/reference

### AlienVault OTX
- **Purpose:** Open Threat Exchange - threat intelligence and IOC lookups
- **API Key:** `OTX_API_KEY`
- **Docs:** https://otx.alienvault.com/api

### HackerOne
- **Purpose:** Bug bounty and vulnerability disclosure management
- **API Key:** `HACKERONE_API_KEY` (format: `username:token`)
- **Docs:** https://api.hackerone.com/

## Enums and Types

### Agent Types
`reconnaissance`, `exploitation`, `post_exploitation`, `persistence`, `lateral_movement`, `command_control`

### Operation Phases (MITRE ATT&CK)
`planning`, `reconnaissance`, `initial_access`, `execution`, `persistence`, `privilege_escalation`, `defense_evasion`, `credential_access`, `discovery`, `lateral_movement`, `collection`, `exfiltration`, `impact`

### Target Types
`web_application`, `network`, `host`, `api`, `database`, `cloud_infrastructure`

### Finding Types
`vulnerability`, `misconfiguration`, `weak_credential`, `exposed_data`, `privilege_escalation`, `lateral_movement`

### Severity Levels
`critical`, `high`, `medium`, `low`, `info`

## Project Architecture

```
src/
├── index.ts              # Server entry point
├── config/
│   └── index.ts          # Configuration (port, env, server name)
├── store/
│   └── index.ts          # In-memory data store for agents, operations, targets, findings
├── tools/
│   ├── index.ts          # Tool registration hub with workflow stage mapping
│   ├── agent-tools.ts    # Agent CRUD tools
│   ├── operation-tools.ts # Operation lifecycle tools
│   ├── target-tools.ts   # Target management tools
│   ├── analysis-tools.ts # Findings and reporting tools
│   └── integration-tools.ts # External API integrations (VT, OTX, H1)
├── resources/
│   └── index.ts          # MCP resource registration
├── types/
│   └── index.ts          # TypeScript interfaces and enums
└── utils/
    └── logger.ts         # Winston logging
```

## Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm run start
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment |
| `MCP_SERVER_NAME` | redteam-mcp-server | Server name |
| `MCP_VERSION` | 1.0.0 | Server version |
| `LOG_LEVEL` | info | Logging level |
| `VIRUSTOTAL_API_KEY` | - | VirusTotal API key |
| `OTX_API_KEY` | - | AlienVault OTX API key |
| `HACKERONE_API_KEY` | - | HackerOne API key (username:token format) |

## Recent Changes

- **2025-12-30:** Added security integrations (VirusTotal, AlienVault OTX, HackerOne)
- **2025-12-30:** Added 8 new reconnaissance and reporting tools for external APIs
- **2025-12-30:** Simplified HackerOne auth to single API key format
- **2025-12-30:** Created Notion workspace for Red Team Operations tracking
- **2025-12-30:** Reorganized tools by MITRE ATT&CK workflow stages
- **2025-12-30:** Implemented full tool suite (32 tools) for agents, operations, targets, and analysis

## Notion Integration

Connected to Notion workspace for documentation and tracking:
- **Red Team Operations Hub** - Central workspace page
- **Activity Log** - Track operations and activities
- **Recon Targets** - Manage reconnaissance targets
- **Findings** - Document discovered vulnerabilities
- **Integrations** - API integration documentation

## User Preferences

- Uses TypeScript with ES modules
- Winston for logging
- Zod for schema validation
- UUID for unique identifiers
- Tools organized by MITRE ATT&CK workflow stages
- Security integrations via environment variables
