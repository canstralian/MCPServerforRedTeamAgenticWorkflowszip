interface ToolResponse {
  content: Array<{ type: string; text: string }>;
}

export const integrationTools = [
  {
    name: 'virustotal_scan_hash',
    description: 'Look up a file hash (MD5, SHA1, SHA256) on VirusTotal for malware analysis',
    inputSchema: {
      type: 'object' as const,
      properties: {
        hash: {
          type: 'string',
          description: 'File hash to look up (MD5, SHA1, or SHA256)',
        },
      },
      required: ['hash'],
    },
  },
  {
    name: 'virustotal_scan_url',
    description: 'Scan a URL on VirusTotal for malicious content',
    inputSchema: {
      type: 'object' as const,
      properties: {
        url: {
          type: 'string',
          description: 'URL to scan',
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'virustotal_scan_ip',
    description: 'Get VirusTotal report for an IP address',
    inputSchema: {
      type: 'object' as const,
      properties: {
        ip: {
          type: 'string',
          description: 'IP address to look up',
        },
      },
      required: ['ip'],
    },
  },
  {
    name: 'virustotal_scan_domain',
    description: 'Get VirusTotal report for a domain',
    inputSchema: {
      type: 'object' as const,
      properties: {
        domain: {
          type: 'string',
          description: 'Domain to look up',
        },
      },
      required: ['domain'],
    },
  },
  {
    name: 'otx_get_indicator',
    description: 'Get AlienVault OTX threat intelligence for an indicator (IP, domain, hostname, URL, hash)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        indicator_type: {
          type: 'string',
          enum: ['IPv4', 'IPv6', 'domain', 'hostname', 'url', 'FileHash-MD5', 'FileHash-SHA1', 'FileHash-SHA256'],
          description: 'Type of indicator',
        },
        indicator: {
          type: 'string',
          description: 'The indicator value to look up',
        },
        section: {
          type: 'string',
          enum: ['general', 'reputation', 'geo', 'malware', 'url_list', 'passive_dns', 'analysis'],
          description: 'Section of data to retrieve (default: general)',
        },
      },
      required: ['indicator_type', 'indicator'],
    },
  },
  {
    name: 'otx_get_pulses',
    description: 'Get AlienVault OTX pulses (threat feeds) subscribed to or search for pulses',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query for pulses (optional)',
        },
        limit: {
          type: 'number',
          description: 'Number of pulses to return (default: 10)',
        },
      },
      required: [],
    },
  },
  {
    name: 'hackerone_list_reports',
    description: 'List vulnerability reports from HackerOne program with filters',
    inputSchema: {
      type: 'object' as const,
      properties: {
        program: {
          type: 'string',
          description: 'HackerOne program handle',
        },
        state: {
          type: 'string',
          enum: ['new', 'triaged', 'needs-more-info', 'resolved', 'not-applicable', 'informative', 'duplicate', 'spam'],
          description: 'Filter by report state (optional)',
        },
        severity: {
          type: 'string',
          enum: ['none', 'low', 'medium', 'high', 'critical'],
          description: 'Filter by severity (optional)',
        },
        sort: {
          type: 'string',
          enum: ['reports.created_at', 'reports.last_activity_at', 'reports.last_program_activity_at', 'reports.bounty_awarded_at', 'reports.swag_awarded_at', 'reports.severity_score'],
          description: 'Sort field (optional)',
        },
      },
      required: ['program'],
    },
  },
  {
    name: 'hackerone_get_report',
    description: 'Get details of a specific HackerOne report',
    inputSchema: {
      type: 'object' as const,
      properties: {
        report_id: {
          type: 'string',
          description: 'HackerOne report ID',
        },
      },
      required: ['report_id'],
    },
  },
  {
    name: 'hackerone_create_report',
    description: 'Create/import a vulnerability report to HackerOne (for internal findings or scanner imports)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        program: {
          type: 'string',
          description: 'HackerOne program handle (team_handle)',
        },
        title: {
          type: 'string',
          description: 'Report title',
        },
        vulnerability_information: {
          type: 'string',
          description: 'Detailed vulnerability description',
        },
        impact: {
          type: 'string',
          description: 'Impact description',
        },
        severity_rating: {
          type: 'string',
          enum: ['none', 'low', 'medium', 'high', 'critical'],
          description: 'Severity rating',
        },
        source: {
          type: 'string',
          description: 'Source of the vulnerability (e.g., internal_scan, detectify, burp)',
        },
      },
      required: ['program', 'title', 'vulnerability_information'],
    },
  },
  {
    name: 'hackerone_update_report_state',
    description: 'Change the state of a HackerOne report (triage, resolve, close)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        report_id: {
          type: 'string',
          description: 'HackerOne report ID',
        },
        state: {
          type: 'string',
          enum: ['triaged', 'needs-more-info', 'resolved', 'not-applicable', 'informative', 'duplicate', 'spam'],
          description: 'New state for the report',
        },
        message: {
          type: 'string',
          description: 'Comment to add with state change',
        },
        close_reason: {
          type: 'string',
          description: 'Reason for closing (required for resolved/not-applicable)',
        },
      },
      required: ['report_id', 'state'],
    },
  },
  {
    name: 'hackerone_add_comment',
    description: 'Add a comment to a HackerOne report',
    inputSchema: {
      type: 'object' as const,
      properties: {
        report_id: {
          type: 'string',
          description: 'HackerOne report ID',
        },
        message: {
          type: 'string',
          description: 'Comment message (supports markdown)',
        },
        internal: {
          type: 'boolean',
          description: 'If true, comment is only visible to program team (default: false)',
        },
      },
      required: ['report_id', 'message'],
    },
  },
  {
    name: 'hackerone_update_severity',
    description: 'Update the severity of a HackerOne report',
    inputSchema: {
      type: 'object' as const,
      properties: {
        report_id: {
          type: 'string',
          description: 'HackerOne report ID',
        },
        rating: {
          type: 'string',
          enum: ['none', 'low', 'medium', 'high', 'critical'],
          description: 'Severity rating',
        },
        cvss_vector: {
          type: 'string',
          description: 'CVSS vector string (optional)',
        },
      },
      required: ['report_id', 'rating'],
    },
  },
  {
    name: 'hackerone_award_bounty',
    description: 'Award a bounty on a HackerOne report',
    inputSchema: {
      type: 'object' as const,
      properties: {
        report_id: {
          type: 'string',
          description: 'HackerOne report ID',
        },
        amount: {
          type: 'number',
          description: 'Bounty amount in dollars',
        },
        bonus_amount: {
          type: 'number',
          description: 'Bonus amount in dollars (optional)',
        },
        message: {
          type: 'string',
          description: 'Message to include with bounty award',
        },
      },
      required: ['report_id', 'amount'],
    },
  },
  {
    name: 'hackerone_get_program',
    description: 'Get details of a HackerOne program including scope and policy',
    inputSchema: {
      type: 'object' as const,
      properties: {
        program: {
          type: 'string',
          description: 'HackerOne program handle',
        },
      },
      required: ['program'],
    },
  },
  {
    name: 'hackerone_get_programs',
    description: 'List all HackerOne programs you have access to',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'hackerone_get_balance',
    description: 'Get the bounty balance for a HackerOne program',
    inputSchema: {
      type: 'object' as const,
      properties: {
        program: {
          type: 'string',
          description: 'HackerOne program handle',
        },
      },
      required: ['program'],
    },
  },
  {
    name: 'hackerone_get_analytics',
    description: 'Get analytics data for a HackerOne program',
    inputSchema: {
      type: 'object' as const,
      properties: {
        program: {
          type: 'string',
          description: 'HackerOne program handle',
        },
        metric: {
          type: 'string',
          enum: ['reports_by_severity', 'reports_by_state', 'bounty_awarded', 'response_efficiency', 'time_to_resolution'],
          description: 'Analytics metric to retrieve',
        },
      },
      required: ['program', 'metric'],
    },
  },
  {
    name: 'hackerone_list_assets',
    description: 'List assets in a HackerOne organization',
    inputSchema: {
      type: 'object' as const,
      properties: {
        organization_id: {
          type: 'string',
          description: 'HackerOne organization ID',
        },
      },
      required: ['organization_id'],
    },
  },
  {
    name: 'hackerone_create_asset',
    description: 'Create a new asset in a HackerOne organization',
    inputSchema: {
      type: 'object' as const,
      properties: {
        organization_id: {
          type: 'string',
          description: 'HackerOne organization ID',
        },
        asset_type: {
          type: 'string',
          enum: ['DOMAIN', 'IP_ADDRESS', 'CIDR', 'URL', 'WILDCARD', 'HARDWARE', 'CODE', 'MOBILE_APPLICATION', 'DOWNLOADABLE_EXECUTABLES', 'SOURCE_CODE', 'OTHER'],
          description: 'Type of asset',
        },
        identifier: {
          type: 'string',
          description: 'Asset identifier (e.g., domain name, IP address)',
        },
        description: {
          type: 'string',
          description: 'Asset description',
        },
      },
      required: ['organization_id', 'asset_type', 'identifier'],
    },
  },
  {
    name: 'hackerone_get_activities',
    description: 'Get activity feed for a HackerOne program (comments, state changes, etc.)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        program: {
          type: 'string',
          description: 'HackerOne program handle',
        },
        report_id: {
          type: 'string',
          description: 'Filter by specific report ID (optional)',
        },
      },
      required: ['program'],
    },
  },
];

export function handleIntegrationTool(name: string, args: Record<string, unknown>): ToolResponse | null {
  switch (name) {
    case 'virustotal_scan_hash': {
      const hash = args.hash as string;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'virustotal_hash_lookup',
            hash,
            status: 'pending',
            message: `Querying VirusTotal for hash: ${hash}`,
            api_endpoint: `files/${hash}`,
          }, null, 2),
        }],
      };
    }

    case 'virustotal_scan_url': {
      const url = args.url as string;
      const urlId = Buffer.from(url).toString('base64').replace(/=/g, '');
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'virustotal_url_scan',
            url,
            url_id: urlId,
            status: 'pending',
            message: `Querying VirusTotal for URL: ${url}`,
            api_endpoint: `urls/${urlId}`,
          }, null, 2),
        }],
      };
    }

    case 'virustotal_scan_ip': {
      const ip = args.ip as string;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'virustotal_ip_lookup',
            ip,
            status: 'pending',
            message: `Querying VirusTotal for IP: ${ip}`,
            api_endpoint: `ip_addresses/${ip}`,
          }, null, 2),
        }],
      };
    }

    case 'virustotal_scan_domain': {
      const domain = args.domain as string;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'virustotal_domain_lookup',
            domain,
            status: 'pending',
            message: `Querying VirusTotal for domain: ${domain}`,
            api_endpoint: `domains/${domain}`,
          }, null, 2),
        }],
      };
    }

    case 'otx_get_indicator': {
      const indicatorType = args.indicator_type as string;
      const indicator = args.indicator as string;
      const section = (args.section as string) || 'general';
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'otx_indicator_lookup',
            indicator_type: indicatorType,
            indicator,
            section,
            status: 'pending',
            message: `Querying AlienVault OTX for ${indicatorType}: ${indicator}`,
            api_endpoint: `indicators/${indicatorType}/${indicator}/${section}`,
          }, null, 2),
        }],
      };
    }

    case 'otx_get_pulses': {
      const query = args.query as string | undefined;
      const limit = (args.limit as number) || 10;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'otx_pulses_query',
            query: query || 'subscribed',
            limit,
            status: 'pending',
            message: query ? `Searching OTX pulses for: ${query}` : 'Fetching subscribed OTX pulses',
            api_endpoint: query ? `search/pulses?q=${encodeURIComponent(query)}&limit=${limit}` : `pulses/subscribed?limit=${limit}`,
          }, null, 2),
        }],
      };
    }

    case 'hackerone_list_reports': {
      const program = args.program as string;
      const state = args.state as string | undefined;
      const severity = args.severity as string | undefined;
      const sort = args.sort as string | undefined;
      let endpoint = `reports?filter[program][]=${program}`;
      if (state) endpoint += `&filter[state][]=${state}`;
      if (severity) endpoint += `&filter[severity][]=${severity}`;
      if (sort) endpoint += `&sort=${sort}`;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_list_reports',
            program,
            state: state || 'all',
            severity: severity || 'all',
            sort: sort || 'default',
            status: 'pending',
            message: `Listing HackerOne reports for program: ${program}`,
            api_endpoint: endpoint,
          }, null, 2),
        }],
      };
    }

    case 'hackerone_get_report': {
      const reportId = args.report_id as string;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_get_report',
            report_id: reportId,
            status: 'pending',
            message: `Fetching HackerOne report: ${reportId}`,
            api_endpoint: `reports/${reportId}`,
          }, null, 2),
        }],
      };
    }

    case 'hackerone_create_report': {
      const program = args.program as string;
      const title = args.title as string;
      const vulnInfo = args.vulnerability_information as string;
      const impact = args.impact as string | undefined;
      const severity = args.severity_rating as string | undefined;
      const source = args.source as string | undefined;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_create_report',
            program,
            title,
            severity: severity || 'none',
            source: source || 'internal',
            status: 'pending',
            message_display: `Creating HackerOne report: ${title}`,
            api_endpoint: 'reports',
            method: 'POST',
            payload: {
              data: {
                type: 'report',
                attributes: {
                  team_handle: program,
                  title,
                  vulnerability_information: vulnInfo,
                  ...(impact && { impact }),
                  ...(severity && { severity_rating: severity }),
                  ...(source && { source }),
                },
                relationships: {
                  program: {
                    data: {
                      type: 'program',
                      attributes: {
                        handle: program,
                      },
                    },
                  },
                },
              },
            },
          }, null, 2),
        }],
      };
    }

    case 'hackerone_update_report_state': {
      const reportId = args.report_id as string;
      const state = args.state as string;
      const message = args.message as string | undefined;
      const closeReason = args.close_reason as string | undefined;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_update_report_state',
            report_id: reportId,
            new_state: state,
            status: 'pending',
            message_display: `Updating report ${reportId} state to: ${state}`,
            api_endpoint: `reports/${reportId}/state_changes`,
            method: 'POST',
            payload: {
              data: {
                type: 'state-change',
                attributes: {
                  state,
                  message: message || '',
                  ...(closeReason && { close_reason: closeReason }),
                },
              },
            },
          }, null, 2),
        }],
      };
    }

    case 'hackerone_add_comment': {
      const reportId = args.report_id as string;
      const commentMessage = args.message as string;
      const internal = args.internal as boolean | undefined;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_add_comment',
            report_id: reportId,
            internal: internal || false,
            status: 'pending',
            message_display: `Adding comment to report ${reportId}`,
            api_endpoint: `reports/${reportId}/activities`,
            method: 'POST',
            payload: {
              data: {
                type: 'activity-comment',
                attributes: {
                  message: commentMessage,
                  internal: internal || false,
                },
              },
            },
          }, null, 2),
        }],
      };
    }

    case 'hackerone_update_severity': {
      const reportId = args.report_id as string;
      const rating = args.rating as string;
      const cvssVector = args.cvss_vector as string | undefined;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_update_severity',
            report_id: reportId,
            rating,
            cvss_vector: cvssVector || null,
            status: 'pending',
            message_display: `Updating severity of report ${reportId} to: ${rating}`,
            api_endpoint: `reports/${reportId}/severities`,
            method: 'POST',
            payload: {
              data: {
                type: 'severity',
                attributes: {
                  rating,
                  ...(cvssVector && { cvss_vector_string: cvssVector }),
                },
              },
            },
          }, null, 2),
        }],
      };
    }

    case 'hackerone_award_bounty': {
      const reportId = args.report_id as string;
      const amount = args.amount as number;
      const bonusAmount = args.bonus_amount as number | undefined;
      const bountyMessage = args.message as string | undefined;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_award_bounty',
            report_id: reportId,
            amount,
            bonus_amount: bonusAmount || 0,
            status: 'pending',
            message_display: `Awarding $${amount} bounty on report ${reportId}`,
            api_endpoint: `reports/${reportId}/bounties`,
            method: 'POST',
            payload: {
              data: {
                type: 'bounty',
                attributes: {
                  amount: amount.toString(),
                  ...(bonusAmount && { bonus_amount: bonusAmount.toString() }),
                  ...(bountyMessage && { message: bountyMessage }),
                },
              },
            },
          }, null, 2),
        }],
      };
    }

    case 'hackerone_get_program': {
      const program = args.program as string;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_get_program',
            program,
            status: 'pending',
            message: `Fetching program details: ${program}`,
            api_endpoint: `programs/${program}`,
          }, null, 2),
        }],
      };
    }

    case 'hackerone_get_programs': {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_get_programs',
            status: 'pending',
            message: 'Listing all accessible HackerOne programs',
            api_endpoint: 'me/programs',
          }, null, 2),
        }],
      };
    }

    case 'hackerone_get_balance': {
      const program = args.program as string;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_get_balance',
            program,
            status: 'pending',
            message: `Fetching bounty balance for program: ${program}`,
            api_endpoint: `programs/${program}/billing/balance`,
          }, null, 2),
        }],
      };
    }

    case 'hackerone_get_analytics': {
      const program = args.program as string;
      const metric = args.metric as string;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_get_analytics',
            program,
            metric,
            status: 'pending',
            message: `Fetching ${metric} analytics for program: ${program}`,
            api_endpoint: `programs/${program}/analytics`,
          }, null, 2),
        }],
      };
    }

    case 'hackerone_list_assets': {
      const orgId = args.organization_id as string;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_list_assets',
            organization_id: orgId,
            status: 'pending',
            message: `Listing assets for organization: ${orgId}`,
            api_endpoint: `organizations/${orgId}/assets`,
          }, null, 2),
        }],
      };
    }

    case 'hackerone_create_asset': {
      const orgId = args.organization_id as string;
      const assetType = args.asset_type as string;
      const identifier = args.identifier as string;
      const description = args.description as string | undefined;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_create_asset',
            organization_id: orgId,
            asset_type: assetType,
            identifier,
            status: 'pending',
            message_display: `Creating ${assetType} asset: ${identifier}`,
            api_endpoint: `organizations/${orgId}/assets`,
            method: 'POST',
            payload: {
              data: {
                type: 'asset',
                attributes: {
                  asset_type: assetType,
                  identifier,
                  ...(description && { description }),
                },
              },
            },
          }, null, 2),
        }],
      };
    }

    case 'hackerone_get_activities': {
      const program = args.program as string;
      const reportId = args.report_id as string | undefined;
      const endpoint = reportId 
        ? `reports/${reportId}/activities` 
        : `programs/${program}/activities`;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_get_activities',
            program,
            report_id: reportId || null,
            status: 'pending',
            message: reportId 
              ? `Fetching activities for report: ${reportId}` 
              : `Fetching activities for program: ${program}`,
            api_endpoint: endpoint,
          }, null, 2),
        }],
      };
    }

    default:
      return null;
  }
}
