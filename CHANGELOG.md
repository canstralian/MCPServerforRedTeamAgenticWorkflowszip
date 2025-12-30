# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-30

### Added

- **Security Integrations**
  - VirusTotal API integration for file, URL, IP, and domain scanning
  - AlienVault OTX integration for threat intelligence and IOC lookups
  - HackerOne integration for bug bounty report management
- **New Reconnaissance Tools**
  - `virustotal_scan_hash` - Look up file hashes for malware analysis
  - `virustotal_scan_url` - Scan URLs for malicious content
  - `virustotal_scan_ip` - Get IP address reputation reports
  - `virustotal_scan_domain` - Get domain reputation reports
  - `otx_get_indicator` - Query threat intelligence for IOCs
  - `otx_get_pulses` - Access threat feed subscriptions
- **New Reporting Tools**
  - `hackerone_list_reports` - List vulnerability reports from programs
  - `hackerone_get_report` - Get detailed report information
- **Notion Integration** - Documentation page for tracking integrations

### Changed

- HackerOne authentication simplified to single `HACKERONE_API_KEY` format
- Tool count increased from 24 to 32

## [1.0.0] - 2025-12-30

### Added

- **Core MCP Server**
  - StdioServerTransport for LLM communication
  - JSON-RPC 2.0 protocol support
  - Tool listing and execution handlers

- **Agent Management Tools**
  - `create_agent` - Create agents with type and capabilities
  - `list_agents` - List agents with status filtering
  - `get_agent` - Retrieve agent details
  - `update_agent` - Modify agent properties
  - `activate_agent` - Set agent to active status
  - `delete_agent` - Remove agents

- **Operation Management Tools**
  - `create_operation` - Create new operations
  - `list_operations` - List with status/phase filters
  - `get_operation` - Get operation details with findings
  - `update_operation` - Update operation phase
  - `start_operation` - Begin operation execution
  - `complete_operation` - Mark operation complete
  - `delete_operation` - Remove operations

- **Target Management Tools**
  - `create_target` - Define targets with type classification
  - `list_targets` - List targets with type filtering
  - `get_target` - Get target details with vulnerabilities
  - `update_target` - Modify target information
  - `add_vulnerability` - Record vulnerabilities on targets
  - `delete_target` - Remove targets

- **Analysis & Reporting Tools**
  - `add_finding` - Record findings with severity and evidence
  - `list_findings` - Filter by operation, agent, or severity
  - `get_finding` - Get detailed finding information
  - `generate_report` - Create comprehensive reports
  - `get_statistics` - Get metrics across operations

- **Workflow Organization**
  - Tools organized by MITRE ATT&CK phases
  - Workflow stage metadata on all tools
  - Stage prefixes in tool descriptions

- **Infrastructure**
  - TypeScript with ES modules
  - Winston logging
  - Zod schema validation
  - In-memory data store
  - UUID generation

### Technical Details

- Node.js 18+ required
- MCP SDK integration
- MITRE ATT&CK phase alignment

## [Unreleased]

### Planned

- Persistent storage options (SQLite, PostgreSQL)
- Additional recon integrations (Shodan, Censys)
- Automated reporting templates
- Operation templates/playbooks
- Multi-tenant support
