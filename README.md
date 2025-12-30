# MCP Red Team Server

[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server for orchestrating red team security assessments. This server enables LLMs to manage security operations, agents, targets, and findings through structured tool calls aligned with the MITRE ATT&CK framework.

## Features

- **32 MCP Tools** organized by MITRE ATT&CK workflow stages
- **Multi-LLM Support** - Works with Claude, GPT-4, Gemini, and any MCP-compatible model
- **Security Integrations** - VirusTotal, AlienVault OTX, and HackerOne APIs
- **Operation Management** - Track assessments from planning through reporting
- **Finding Documentation** - Record vulnerabilities with severity, evidence, and CVSS scores

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-redteam-server.git
cd mcp-redteam-server

# Install dependencies
npm install

# Start the server
npm run dev
```

### MCP Client Configuration

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "redteam": {
      "command": "npm",
      "args": ["run", "start"],
      "cwd": "/path/to/mcp-redteam-server"
    }
  }
}
```

## Tools by Workflow Stage

### Planning (6 tools)

Setup agents, operations, and targets before engagement.

| Tool | Description |
|------|-------------|
| `create_agent` | Create a new agent with type and capabilities |
| `list_agents` | List all agents, optionally filtered by status |
| `get_agent` | Get detailed info about a specific agent |
| `update_agent` | Update agent properties |
| `create_operation` | Create a new operation targeting a system |
| `create_target` | Define a target (web app, network, host, API, database, cloud) |

### Reconnaissance (11 tools)

Gather intelligence on targets using built-in tools and external APIs.

| Tool | Description |
|------|-------------|
| `list_operations` | List operations with status/phase filters |
| `get_operation` | Get operation details including findings |
| `list_targets` | List all targets with optional type filter |
| `get_target` | Get target details including vulnerabilities |
| `update_target` | Update target information |
| `virustotal_scan_hash` | Look up file hash on VirusTotal |
| `virustotal_scan_url` | Scan URL for malicious content |
| `virustotal_scan_ip` | Get VirusTotal IP address report |
| `virustotal_scan_domain` | Get VirusTotal domain report |
| `otx_get_indicator` | Get AlienVault OTX threat intelligence |
| `otx_get_pulses` | Get OTX threat feeds/pulses |

### Exploitation (4 tools)

Execute attacks, activate agents, and record vulnerabilities.

| Tool | Description |
|------|-------------|
| `activate_agent` | Set agent status to active for deployment |
| `start_operation` | Begin execution of an operation |
| `update_operation` | Update operation phase or details |
| `add_vulnerability` | Record a vulnerability on a target |

### Post-Exploitation (1 tool)

Document findings during active exploitation.

| Tool | Description |
|------|-------------|
| `add_finding` | Record a security finding with severity, evidence, and mitigation |

### Reporting (10 tools)

Generate reports, review findings, and manage resources.

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

Scan files, URLs, IPs, and domains for malware and reputation data.

```bash
# Set your API key
export VIRUSTOTAL_API_KEY="your-api-key"
```

Get your key: [VirusTotal API](https://www.virustotal.com/gui/my-apikey)

### AlienVault OTX

Access Open Threat Exchange for threat intelligence and IOC lookups.

```bash
# Set your API key
export OTX_API_KEY="your-api-key"
```

Get your key: [AlienVault OTX](https://otx.alienvault.com/api)

### HackerOne

Manage bug bounty reports and vulnerability disclosures.

```bash
# Set your API key (format: username:token)
export HACKERONE_API_KEY="your-username:your-token"
```

Get your credentials: HackerOne Settings → API Tokens

## Enums and Types

### Agent Types

```
reconnaissance | exploitation | post_exploitation | 
persistence | lateral_movement | command_control
```

### Operation Phases (MITRE ATT&CK)

```
planning | reconnaissance | initial_access | execution |
persistence | privilege_escalation | defense_evasion |
credential_access | discovery | lateral_movement |
collection | exfiltration | impact
```

### Target Types

```
web_application | network | host | api | database | cloud_infrastructure
```

### Finding Types

```
vulnerability | misconfiguration | weak_credential |
exposed_data | privilege_escalation | lateral_movement
```

### Severity Levels

```
critical | high | medium | low | info
```

## Project Structure

```
src/
├── index.ts              # Server entry point
├── config/
│   └── index.ts          # Configuration
├── store/
│   └── index.ts          # In-memory data store
├── tools/
│   ├── index.ts          # Tool registration with workflow stages
│   ├── agent-tools.ts    # Agent CRUD tools
│   ├── operation-tools.ts # Operation lifecycle tools
│   ├── target-tools.ts   # Target management tools
│   ├── analysis-tools.ts # Findings and reporting tools
│   └── integration-tools.ts # External API integrations
├── resources/
│   └── index.ts          # MCP resource registration
├── types/
│   └── index.ts          # TypeScript interfaces
└── utils/
    └── logger.ts         # Winston logging
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
| `HACKERONE_API_KEY` | - | HackerOne API key (username:token) |

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Lint code
npm run lint
```

## LLM Compatibility

This server implements the Model Context Protocol standard and works with:

- **Claude** (Anthropic) - Native MCP support
- **GPT-4/GPT-4o** (OpenAI) - Via MCP adapters
- **Gemini** (Google) - Via MCP adapters
- **Open-source models** - Any model with MCP/function calling support

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io) by Anthropic
- [MITRE ATT&CK Framework](https://attack.mitre.org/)
- Security research community
