import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

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
    description: 'List vulnerability reports from HackerOne program',
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
];

async function virusTotalRequest(endpoint: string): Promise<unknown> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    throw new Error('VIRUSTOTAL_API_KEY not configured. Please add it to your secrets.');
  }

  const response = await fetch(`https://www.virustotal.com/api/v3/${endpoint}`, {
    headers: {
      'x-apikey': apiKey,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`VirusTotal API error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function otxRequest(endpoint: string): Promise<unknown> {
  const apiKey = process.env.OTX_API_KEY;
  if (!apiKey) {
    throw new Error('OTX_API_KEY not configured. Please add it to your secrets.');
  }

  const response = await fetch(`https://otx.alienvault.com/api/v1/${endpoint}`, {
    headers: {
      'X-OTX-API-KEY': apiKey,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AlienVault OTX API error: ${response.status} - ${error}`);
  }

  return response.json();
}

const HACKERONE_ERROR_MESSAGES: Record<number, string> = {
  400: 'Bad Request - Request does not conform with the specification',
  401: 'Unauthorized - Invalid API credentials. Ensure HACKERONE_API_KEY is in format username:token',
  403: 'Forbidden - API token does not grant access to this resource',
  404: 'Not Found - The requested resource does not exist',
  406: 'Not Acceptable - Invalid response format requested',
  422: 'Unprocessable Entity - Request syntax is correct but could not be processed',
  429: 'Too Many Requests - Rate limit exceeded. Read: 600/min, Write: 25/20sec',
  500: 'Internal Server Error - HackerOne server error',
  503: 'Service Unavailable - Check status at hackeronestatus.com',
};

async function hackerOneRequest(endpoint: string): Promise<unknown> {
  const apiKey = process.env.HACKERONE_API_KEY;

  if (!apiKey) {
    throw new Error('HACKERONE_API_KEY not configured. Please add it to your secrets in the format: username:token');
  }

  const auth = Buffer.from(apiKey).toString('base64');
  
  const response = await fetch(`https://api.hackerone.com/v1/${endpoint}`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorMessage = HACKERONE_ERROR_MESSAGES[response.status] || `Unknown error`;
    const errorBody = await response.text();
    throw new Error(`HackerOne API error (${response.status}): ${errorMessage}. Details: ${errorBody}`);
  }

  return response.json();
}

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
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'hackerone_list_reports',
            program,
            state: state || 'all',
            status: 'pending',
            message: `Listing HackerOne reports for program: ${program}`,
            api_endpoint: `reports?filter[program][]=${program}${state ? `&filter[state][]=${state}` : ''}`,
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

    default:
      return null;
  }
}
