import { logger } from '../utils/logger.js';
import {
  getGmailClient,
  getCalendarClient,
  getDriveClient,
  getSheetsClient,
  getDocsClient,
  getLinearClient,
  getNotionClient,
  getGithubClient,
} from '../connectors/index.js';

// TODO: Add connection pooling for connector clients
// TODO: Implement connector health monitoring
// TODO: Add automatic reconnection logic on connection failures
// TODO: Implement connector usage metrics and analytics
// TODO: Add more SaaS integrations (Slack, Microsoft Teams, Confluence, etc.)
// TODO: Add cloud provider integrations (AWS, Azure, GCP security services)
// TODO: Implement connector authentication caching
// TODO: Add bulk operation support for efficiency
// TODO: Implement webhook listeners for real-time updates
// TODO: Add connector error recovery and fallback mechanisms

interface ToolResponse {
  content: Array<{ type: string; text: string }>;
}

// TODO: Add schema validation for all connector tool inputs
// TODO: Implement connector-specific rate limiting
// TODO: Add response transformation for consistent format across connectors
export const connectorTools = [
  {
    // TODO: Add support for issue templates
    // TODO: Add attachment support for findings/evidence
    name: 'linear_create_issue',
    description: 'Create a new issue in Linear for tracking security findings or assessment tasks',
    inputSchema: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string',
          description: 'Issue title',
        },
        description: {
          type: 'string',
          description: 'Issue description (supports markdown)',
        },
        team_id: {
          type: 'string',
          description: 'Linear team ID',
        },
        priority: {
          type: 'number',
          description: 'Priority (0=none, 1=urgent, 2=high, 3=medium, 4=low)',
          enum: [0, 1, 2, 3, 4],
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
          description: 'Label IDs to apply',
        },
      },
      required: ['title', 'team_id'],
    },
  },
  {
    name: 'linear_list_issues',
    description: 'List issues from Linear with optional filters',
    inputSchema: {
      type: 'object' as const,
      properties: {
        team_id: {
          type: 'string',
          description: 'Filter by team ID',
        },
        state: {
          type: 'string',
          description: 'Filter by state name (e.g., "In Progress", "Done")',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of issues to return (default: 50)',
        },
      },
      required: [],
    },
  },
  {
    name: 'linear_update_issue',
    description: 'Update an existing Linear issue',
    inputSchema: {
      type: 'object' as const,
      properties: {
        issue_id: {
          type: 'string',
          description: 'Linear issue ID',
        },
        title: {
          type: 'string',
          description: 'New title',
        },
        description: {
          type: 'string',
          description: 'New description',
        },
        state_id: {
          type: 'string',
          description: 'New state ID',
        },
        priority: {
          type: 'number',
          description: 'New priority (0-4)',
        },
      },
      required: ['issue_id'],
    },
  },
  {
    name: 'linear_list_teams',
    description: 'List all teams in Linear workspace',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'linear_add_comment',
    description: 'Add a comment to a Linear issue',
    inputSchema: {
      type: 'object' as const,
      properties: {
        issue_id: {
          type: 'string',
          description: 'Linear issue ID',
        },
        body: {
          type: 'string',
          description: 'Comment body (supports markdown)',
        },
      },
      required: ['issue_id', 'body'],
    },
  },
  {
    name: 'sheets_create_spreadsheet',
    description: 'Create a new Google Sheets spreadsheet for tracking assessment data',
    inputSchema: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string',
          description: 'Spreadsheet title',
        },
        sheets: {
          type: 'array',
          items: { type: 'string' },
          description: 'Names of sheets to create (default: ["Sheet1"])',
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'sheets_read_data',
    description: 'Read data from a Google Sheets spreadsheet',
    inputSchema: {
      type: 'object' as const,
      properties: {
        spreadsheet_id: {
          type: 'string',
          description: 'Spreadsheet ID',
        },
        range: {
          type: 'string',
          description: 'Range to read (e.g., "Sheet1!A1:D10")',
        },
      },
      required: ['spreadsheet_id', 'range'],
    },
  },
  {
    name: 'sheets_write_data',
    description: 'Write data to a Google Sheets spreadsheet',
    inputSchema: {
      type: 'object' as const,
      properties: {
        spreadsheet_id: {
          type: 'string',
          description: 'Spreadsheet ID',
        },
        range: {
          type: 'string',
          description: 'Range to write (e.g., "Sheet1!A1")',
        },
        values: {
          type: 'array',
          items: {
            type: 'array',
            items: { type: 'string' },
          },
          description: 'Data to write as 2D array',
        },
      },
      required: ['spreadsheet_id', 'range', 'values'],
    },
  },
  {
    name: 'sheets_append_data',
    description: 'Append data to a Google Sheets spreadsheet',
    inputSchema: {
      type: 'object' as const,
      properties: {
        spreadsheet_id: {
          type: 'string',
          description: 'Spreadsheet ID',
        },
        range: {
          type: 'string',
          description: 'Range to append to (e.g., "Sheet1!A:D")',
        },
        values: {
          type: 'array',
          items: {
            type: 'array',
            items: { type: 'string' },
          },
          description: 'Data to append as 2D array',
        },
      },
      required: ['spreadsheet_id', 'range', 'values'],
    },
  },
  {
    name: 'drive_list_files',
    description: 'List files in Google Drive',
    inputSchema: {
      type: 'object' as const,
      properties: {
        folder_id: {
          type: 'string',
          description: 'Folder ID to list (default: root)',
        },
        query: {
          type: 'string',
          description: 'Search query',
        },
        limit: {
          type: 'number',
          description: 'Maximum files to return (default: 100)',
        },
      },
      required: [],
    },
  },
  {
    name: 'drive_create_folder',
    description: 'Create a folder in Google Drive for organizing assessment evidence',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string',
          description: 'Folder name',
        },
        parent_id: {
          type: 'string',
          description: 'Parent folder ID (default: root)',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'drive_upload_file',
    description: 'Upload a file to Google Drive',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string',
          description: 'File name',
        },
        content: {
          type: 'string',
          description: 'File content (text string, or base64 string if is_base64 is true)',
        },
        is_base64: {
          type: 'boolean',
          description: 'Set to true if content is base64 encoded binary data (default: false)',
        },
        mime_type: {
          type: 'string',
          description: 'MIME type (default: text/plain)',
        },
        folder_id: {
          type: 'string',
          description: 'Parent folder ID',
        },
      },
      required: ['name', 'content'],
    },
  },
  {
    name: 'drive_download_file',
    description: 'Download a file from Google Drive',
    inputSchema: {
      type: 'object' as const,
      properties: {
        file_id: {
          type: 'string',
          description: 'File ID to download',
        },
      },
      required: ['file_id'],
    },
  },
  {
    name: 'docs_create_document',
    description: 'Create a new Google Doc for assessment reports',
    inputSchema: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string',
          description: 'Document title',
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'docs_get_document',
    description: 'Get the content of a Google Doc',
    inputSchema: {
      type: 'object' as const,
      properties: {
        document_id: {
          type: 'string',
          description: 'Document ID',
        },
      },
      required: ['document_id'],
    },
  },
  {
    name: 'docs_insert_text',
    description: 'Insert text into a Google Doc',
    inputSchema: {
      type: 'object' as const,
      properties: {
        document_id: {
          type: 'string',
          description: 'Document ID',
        },
        text: {
          type: 'string',
          description: 'Text to insert',
        },
        index: {
          type: 'number',
          description: 'Position to insert (default: end of document)',
        },
      },
      required: ['document_id', 'text'],
    },
  },
  {
    name: 'gmail_send_email',
    description: 'Send an email via Gmail for notifications or report delivery',
    inputSchema: {
      type: 'object' as const,
      properties: {
        to: {
          type: 'string',
          description: 'Recipient email address',
        },
        subject: {
          type: 'string',
          description: 'Email subject',
        },
        body: {
          type: 'string',
          description: 'Email body (plain text or HTML)',
        },
        is_html: {
          type: 'boolean',
          description: 'Whether body is HTML (default: false)',
        },
      },
      required: ['to', 'subject', 'body'],
    },
  },
  {
    name: 'gmail_list_messages',
    description: 'List messages from Gmail inbox',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Gmail search query (e.g., "is:unread", "from:example@gmail.com")',
        },
        limit: {
          type: 'number',
          description: 'Maximum messages to return (default: 20)',
        },
      },
      required: [],
    },
  },
  {
    name: 'gmail_get_message',
    description: 'Get a specific Gmail message',
    inputSchema: {
      type: 'object' as const,
      properties: {
        message_id: {
          type: 'string',
          description: 'Message ID',
        },
      },
      required: ['message_id'],
    },
  },
  {
    name: 'calendar_create_event',
    description: 'Create a calendar event for scheduling assessments or reviews',
    inputSchema: {
      type: 'object' as const,
      properties: {
        summary: {
          type: 'string',
          description: 'Event title',
        },
        description: {
          type: 'string',
          description: 'Event description',
        },
        start_time: {
          type: 'string',
          description: 'Start time (ISO 8601 format)',
        },
        end_time: {
          type: 'string',
          description: 'End time (ISO 8601 format)',
        },
        attendees: {
          type: 'array',
          items: { type: 'string' },
          description: 'Attendee email addresses',
        },
        timezone: {
          type: 'string',
          description: 'Timezone (default: UTC)',
        },
      },
      required: ['summary', 'start_time', 'end_time'],
    },
  },
  {
    name: 'calendar_list_events',
    description: 'List upcoming calendar events',
    inputSchema: {
      type: 'object' as const,
      properties: {
        time_min: {
          type: 'string',
          description: 'Start of time range (ISO 8601)',
        },
        time_max: {
          type: 'string',
          description: 'End of time range (ISO 8601)',
        },
        limit: {
          type: 'number',
          description: 'Maximum events to return (default: 50)',
        },
      },
      required: [],
    },
  },
  {
    name: 'calendar_update_event',
    description: 'Update a calendar event',
    inputSchema: {
      type: 'object' as const,
      properties: {
        event_id: {
          type: 'string',
          description: 'Event ID',
        },
        summary: {
          type: 'string',
          description: 'New title',
        },
        description: {
          type: 'string',
          description: 'New description',
        },
        start_time: {
          type: 'string',
          description: 'New start time',
        },
        end_time: {
          type: 'string',
          description: 'New end time',
        },
      },
      required: ['event_id'],
    },
  },
  {
    name: 'notion_search',
    description: 'Search Notion workspace for pages and databases',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        filter: {
          type: 'string',
          enum: ['page', 'database'],
          description: 'Filter by object type',
        },
      },
      required: [],
    },
  },
  {
    name: 'notion_create_page',
    description: 'Create a new page in Notion for documentation',
    inputSchema: {
      type: 'object' as const,
      properties: {
        parent_id: {
          type: 'string',
          description: 'Parent page or database ID',
        },
        parent_type: {
          type: 'string',
          enum: ['page_id', 'database_id'],
          description: 'Type of parent',
        },
        title: {
          type: 'string',
          description: 'Page title',
        },
        content: {
          type: 'string',
          description: 'Page content (plain text)',
        },
      },
      required: ['parent_id', 'parent_type', 'title'],
    },
  },
  {
    name: 'notion_get_page',
    description: 'Get a Notion page by ID',
    inputSchema: {
      type: 'object' as const,
      properties: {
        page_id: {
          type: 'string',
          description: 'Notion page ID',
        },
      },
      required: ['page_id'],
    },
  },
  {
    name: 'notion_update_page',
    description: 'Update a Notion page properties',
    inputSchema: {
      type: 'object' as const,
      properties: {
        page_id: {
          type: 'string',
          description: 'Page ID',
        },
        properties: {
          type: 'object',
          description: 'Properties to update',
        },
      },
      required: ['page_id', 'properties'],
    },
  },
  {
    name: 'notion_query_database',
    description: 'Query a Notion database',
    inputSchema: {
      type: 'object' as const,
      properties: {
        database_id: {
          type: 'string',
          description: 'Database ID',
        },
        filter: {
          type: 'object',
          description: 'Notion filter object',
        },
        sorts: {
          type: 'array',
          description: 'Notion sorts array',
        },
      },
      required: ['database_id'],
    },
  },
  {
    name: 'github_list_repos',
    description: 'List GitHub repositories',
    inputSchema: {
      type: 'object' as const,
      properties: {
        type: {
          type: 'string',
          enum: ['all', 'owner', 'public', 'private', 'member'],
          description: 'Type of repos to list',
        },
        sort: {
          type: 'string',
          enum: ['created', 'updated', 'pushed', 'full_name'],
          description: 'Sort field',
        },
      },
      required: [],
    },
  },
  {
    name: 'github_get_repo',
    description: 'Get details of a GitHub repository',
    inputSchema: {
      type: 'object' as const,
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_list_issues',
    description: 'List issues in a GitHub repository',
    inputSchema: {
      type: 'object' as const,
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        state: {
          type: 'string',
          enum: ['open', 'closed', 'all'],
          description: 'Issue state filter',
        },
        labels: {
          type: 'string',
          description: 'Comma-separated list of label names',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_create_issue',
    description: 'Create an issue in a GitHub repository',
    inputSchema: {
      type: 'object' as const,
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        title: {
          type: 'string',
          description: 'Issue title',
        },
        body: {
          type: 'string',
          description: 'Issue body (supports markdown)',
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
          description: 'Labels to apply',
        },
      },
      required: ['owner', 'repo', 'title'],
    },
  },
  {
    name: 'github_get_file',
    description: 'Get contents of a file from a GitHub repository',
    inputSchema: {
      type: 'object' as const,
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        path: {
          type: 'string',
          description: 'File path',
        },
        ref: {
          type: 'string',
          description: 'Branch/tag/commit (default: main)',
        },
      },
      required: ['owner', 'repo', 'path'],
    },
  },
  {
    name: 'github_create_file',
    description: 'Create or update a file in a GitHub repository',
    inputSchema: {
      type: 'object' as const,
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        path: {
          type: 'string',
          description: 'File path',
        },
        content: {
          type: 'string',
          description: 'File content',
        },
        message: {
          type: 'string',
          description: 'Commit message',
        },
        branch: {
          type: 'string',
          description: 'Branch name (default: main)',
        },
        sha: {
          type: 'string',
          description: 'SHA of file being replaced (required for updates)',
        },
      },
      required: ['owner', 'repo', 'path', 'content', 'message'],
    },
  },
];

async function handleLinearCreateIssue(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getLinearClient();
    const issue = await client.createIssue({
      title: args.title as string,
      description: args.description as string | undefined,
      teamId: args.team_id as string,
      priority: args.priority as number | undefined,
      labelIds: args.labels as string[] | undefined,
    });
    const createdIssue = await issue.issue;
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          issue: {
            id: createdIssue?.id,
            identifier: createdIssue?.identifier,
            title: createdIssue?.title,
            url: createdIssue?.url,
          },
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Linear create issue error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleLinearListIssues(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getLinearClient();
    const limit = (args.limit as number) || 50;
    const filter: Record<string, unknown> = {};
    if (args.team_id) {
      filter.team = { id: { eq: args.team_id as string } };
    }
    if (args.state) {
      filter.state = { name: { eq: args.state as string } };
    }
    const issues = await client.issues({
      first: limit,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          issues: issues.nodes.map(issue => ({
            id: issue.id,
            identifier: issue.identifier,
            title: issue.title,
            state: issue.state,
            priority: issue.priority,
            url: issue.url,
          })),
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Linear list issues error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleLinearUpdateIssue(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getLinearClient();
    const issue = await client.updateIssue(args.issue_id as string, {
      title: args.title as string | undefined,
      description: args.description as string | undefined,
      stateId: args.state_id as string | undefined,
      priority: args.priority as number | undefined,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: issue.success }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Linear update issue error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleLinearListTeams(): Promise<ToolResponse> {
  try {
    const client = await getLinearClient();
    const teams = await client.teams();
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          teams: teams.nodes.map(team => ({
            id: team.id,
            name: team.name,
            key: team.key,
          })),
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Linear list teams error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleLinearAddComment(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getLinearClient();
    const comment = await client.createComment({
      issueId: args.issue_id as string,
      body: args.body as string,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: comment.success }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Linear add comment error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleSheetsCreateSpreadsheet(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getSheetsClient();
    const sheets = (args.sheets as string[]) || ['Sheet1'];
    const response = await client.spreadsheets.create({
      requestBody: {
        properties: { title: args.title as string },
        sheets: sheets.map(name => ({ properties: { title: name } })),
      },
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          spreadsheet: {
            id: response.data.spreadsheetId,
            url: response.data.spreadsheetUrl,
            title: response.data.properties?.title,
          },
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Sheets create error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleSheetsReadData(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getSheetsClient();
    const response = await client.spreadsheets.values.get({
      spreadsheetId: args.spreadsheet_id as string,
      range: args.range as string,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          range: response.data.range,
          values: response.data.values,
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Sheets read error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleSheetsWriteData(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getSheetsClient();
    const response = await client.spreadsheets.values.update({
      spreadsheetId: args.spreadsheet_id as string,
      range: args.range as string,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: args.values as string[][],
      },
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          updatedRange: response.data.updatedRange,
          updatedRows: response.data.updatedRows,
          updatedColumns: response.data.updatedColumns,
          updatedCells: response.data.updatedCells,
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Sheets write error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleSheetsAppendData(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getSheetsClient();
    const response = await client.spreadsheets.values.append({
      spreadsheetId: args.spreadsheet_id as string,
      range: args.range as string,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: args.values as string[][],
      },
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          updatedRange: response.data.updates?.updatedRange,
          updatedRows: response.data.updates?.updatedRows,
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Sheets append error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleDriveListFiles(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getDriveClient();
    const limit = (args.limit as number) || 100;
    let q = '';
    if (args.folder_id) {
      q = `'${args.folder_id}' in parents`;
    }
    if (args.query) {
      q = q ? `${q} and ${args.query}` : args.query as string;
    }
    const response = await client.files.list({
      pageSize: limit,
      q: q || undefined,
      fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink)',
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          files: response.data.files,
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Drive list error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleDriveCreateFolder(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getDriveClient();
    const response = await client.files.create({
      requestBody: {
        name: args.name as string,
        mimeType: 'application/vnd.google-apps.folder',
        parents: args.parent_id ? [args.parent_id as string] : undefined,
      },
      fields: 'id, name, webViewLink',
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          folder: response.data,
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Drive create folder error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleDriveUploadFile(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getDriveClient();
    const mimeType = (args.mime_type as string) || 'text/plain';
    const isBase64 = args.is_base64 as boolean;
    const contentStr = args.content as string;
    
    let contentBuffer: Buffer;
    if (isBase64) {
      contentBuffer = Buffer.from(contentStr, 'base64');
    } else {
      contentBuffer = Buffer.from(contentStr, 'utf-8');
    }
    
    const { Readable } = await import('stream');
    const stream = Readable.from(contentBuffer);
    
    const response = await client.files.create({
      requestBody: {
        name: args.name as string,
        parents: args.folder_id ? [args.folder_id as string] : undefined,
      },
      media: {
        mimeType,
        body: stream,
      },
      fields: 'id, name, webViewLink',
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          file: response.data,
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Drive upload error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleDriveDownloadFile(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getDriveClient();
    const response = await client.files.get({
      fileId: args.file_id as string,
      alt: 'media',
    }, { responseType: 'text' });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          content: response.data,
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Drive download error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleDocsCreateDocument(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getDocsClient();
    const response = await client.documents.create({
      requestBody: {
        title: args.title as string,
      },
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          document: {
            id: response.data.documentId,
            title: response.data.title,
          },
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Docs create error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleDocsGetDocument(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getDocsClient();
    const response = await client.documents.get({
      documentId: args.document_id as string,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          document: {
            id: response.data.documentId,
            title: response.data.title,
            body: response.data.body,
          },
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Docs get error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleDocsInsertText(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getDocsClient();
    const documentId = args.document_id as string;
    const text = args.text as string;
    const index = (args.index as number) || 1;
    await client.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [{
          insertText: {
            location: { index },
            text,
          },
        }],
      },
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: true }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Docs insert text error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleGmailSendEmail(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getGmailClient();
    const to = args.to as string;
    const subject = args.subject as string;
    const body = args.body as string;
    const isHtml = args.is_html as boolean;
    const contentType = isHtml ? 'text/html' : 'text/plain';
    
    const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;
    
    const messageParts = [
      'MIME-Version: 1.0',
      `To: ${to}`,
      `Subject: ${encodedSubject}`,
      `Content-Type: ${contentType}; charset=utf-8`,
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(body).toString('base64'),
    ];
    const rawMessage = messageParts.join('\r\n');
    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    const response = await client.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          messageId: response.data.id,
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Gmail send error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleGmailListMessages(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getGmailClient();
    const limit = (args.limit as number) || 20;
    const response = await client.users.messages.list({
      userId: 'me',
      maxResults: limit,
      q: args.query as string | undefined,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          messages: response.data.messages,
          resultSizeEstimate: response.data.resultSizeEstimate,
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Gmail list error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleGmailGetMessage(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getGmailClient();
    const response = await client.users.messages.get({
      userId: 'me',
      id: args.message_id as string,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: {
            id: response.data.id,
            threadId: response.data.threadId,
            snippet: response.data.snippet,
            payload: response.data.payload,
          },
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Gmail get message error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleCalendarCreateEvent(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getCalendarClient();
    const timezone = (args.timezone as string) || 'UTC';
    const response = await client.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: args.summary as string,
        description: args.description as string | undefined,
        start: {
          dateTime: args.start_time as string,
          timeZone: timezone,
        },
        end: {
          dateTime: args.end_time as string,
          timeZone: timezone,
        },
        attendees: (args.attendees as string[])?.map(email => ({ email })),
      },
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          event: {
            id: response.data.id,
            htmlLink: response.data.htmlLink,
            summary: response.data.summary,
          },
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Calendar create event error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleCalendarListEvents(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getCalendarClient();
    const limit = (args.limit as number) || 50;
    const response = await client.events.list({
      calendarId: 'primary',
      maxResults: limit,
      timeMin: (args.time_min as string) || new Date().toISOString(),
      timeMax: args.time_max as string | undefined,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          events: response.data.items?.map(event => ({
            id: event.id,
            summary: event.summary,
            start: event.start,
            end: event.end,
            htmlLink: event.htmlLink,
          })),
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Calendar list events error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleCalendarUpdateEvent(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getCalendarClient();
    const updateData: Record<string, unknown> = {};
    if (args.summary) updateData.summary = args.summary;
    if (args.description) updateData.description = args.description;
    if (args.start_time) updateData.start = { dateTime: args.start_time };
    if (args.end_time) updateData.end = { dateTime: args.end_time };
    const response = await client.events.patch({
      calendarId: 'primary',
      eventId: args.event_id as string,
      requestBody: updateData,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          event: {
            id: response.data.id,
            summary: response.data.summary,
          },
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Calendar update event error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleNotionSearch(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getNotionClient();
    const searchParams: { query?: string; filter?: { property: 'object'; value: 'page' | 'database' } } = {};
    if (args.query) {
      searchParams.query = args.query as string;
    }
    if (args.filter === 'page' || args.filter === 'database') {
      searchParams.filter = { property: 'object', value: args.filter };
    }
    const response = await client.search(searchParams as Parameters<typeof client.search>[0]);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          results: response.results.map(result => {
            const base = { id: result.id, object: result.object };
            if ('properties' in result) {
              return { ...base, properties: result.properties };
            }
            if ('title' in result) {
              return { ...base, title: result.title };
            }
            return base;
          }),
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Notion search error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleNotionCreatePage(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getNotionClient();
    const parentType = args.parent_type as string;
    const parentId = args.parent_id as string;
    const parent = parentType === 'database_id'
      ? { database_id: parentId }
      : { page_id: parentId };
    const children = args.content ? [{
      object: 'block' as const,
      type: 'paragraph' as const,
      paragraph: {
        rich_text: [{
          type: 'text' as const,
          text: { content: args.content as string },
        }],
      },
    }] : [];
    const response = await client.pages.create({
      parent,
      properties: {
        title: {
          title: [{
            text: { content: args.title as string },
          }],
        },
      },
      children,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          page: {
            id: response.id,
            url: 'url' in response ? response.url : null,
          },
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Notion create page error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleNotionGetPage(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getNotionClient();
    const response = await client.pages.retrieve({
      page_id: args.page_id as string,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          page: response,
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Notion get page error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleNotionUpdatePage(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getNotionClient();
    const response = await client.pages.update({
      page_id: args.page_id as string,
      properties: args.properties as Parameters<typeof client.pages.update>[0]['properties'],
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          page: { id: response.id },
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Notion update page error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleNotionQueryDatabase(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getNotionClient();
    const queryParams: { database_id: string; filter?: unknown; sorts?: unknown } = {
      database_id: args.database_id as string,
    };
    if (args.filter) {
      queryParams.filter = args.filter;
    }
    if (args.sorts) {
      queryParams.sorts = args.sorts;
    }
    const response = await (client as unknown as { databases: { query: (params: unknown) => Promise<{ results: unknown[] }> } }).databases.query(queryParams);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          results: response.results,
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('Notion query database error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleGithubListRepos(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getGithubClient();
    const response = await client.repos.listForAuthenticatedUser({
      type: (args.type as 'all' | 'owner' | 'public' | 'private' | 'member') || 'all',
      sort: (args.sort as 'created' | 'updated' | 'pushed' | 'full_name') || 'updated',
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          repos: response.data.map(repo => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            private: repo.private,
            html_url: repo.html_url,
            description: repo.description,
          })),
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('GitHub list repos error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleGithubGetRepo(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getGithubClient();
    const response = await client.repos.get({
      owner: args.owner as string,
      repo: args.repo as string,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          repo: response.data,
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('GitHub get repo error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleGithubListIssues(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getGithubClient();
    const response = await client.issues.listForRepo({
      owner: args.owner as string,
      repo: args.repo as string,
      state: (args.state as 'open' | 'closed' | 'all') || 'open',
      labels: args.labels as string | undefined,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          issues: response.data.map(issue => ({
            id: issue.id,
            number: issue.number,
            title: issue.title,
            state: issue.state,
            html_url: issue.html_url,
            labels: issue.labels,
          })),
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('GitHub list issues error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleGithubCreateIssue(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getGithubClient();
    const response = await client.issues.create({
      owner: args.owner as string,
      repo: args.repo as string,
      title: args.title as string,
      body: args.body as string | undefined,
      labels: args.labels as string[] | undefined,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          issue: {
            id: response.data.id,
            number: response.data.number,
            html_url: response.data.html_url,
          },
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('GitHub create issue error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleGithubGetFile(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getGithubClient();
    const response = await client.repos.getContent({
      owner: args.owner as string,
      repo: args.repo as string,
      path: args.path as string,
      ref: args.ref as string | undefined,
    });
    const data = response.data as { content?: string; encoding?: string; sha?: string };
    let content = data.content;
    if (data.encoding === 'base64' && content) {
      content = Buffer.from(content, 'base64').toString('utf-8');
    }
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          file: {
            content,
            sha: data.sha,
          },
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('GitHub get file error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

async function handleGithubCreateFile(args: Record<string, unknown>): Promise<ToolResponse> {
  try {
    const client = await getGithubClient();
    const content = Buffer.from(args.content as string).toString('base64');
    const response = await client.repos.createOrUpdateFileContents({
      owner: args.owner as string,
      repo: args.repo as string,
      path: args.path as string,
      message: args.message as string,
      content,
      branch: args.branch as string | undefined,
      sha: args.sha as string | undefined,
    });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          commit: {
            sha: response.data.commit.sha,
            html_url: response.data.commit.html_url,
          },
        }, null, 2),
      }],
    };
  } catch (error) {
    logger.error('GitHub create file error:', error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ success: false, error: String(error) }, null, 2),
      }],
    };
  }
}

// TODO: Add request/response logging for all connector operations
// TODO: Implement unified error handling across all connectors
// TODO: Add performance monitoring for connector operations
// TODO: Implement connection pooling and reuse
// TODO: Add bulk operations batching for efficiency
export async function handleConnectorTool(name: string, args: Record<string, unknown>): Promise<ToolResponse | null> {
  // TODO: Add input validation before routing to handlers
  // TODO: Add metrics collection for tool usage
  // TODO: Implement tool execution timeout
  switch (name) {
    case 'linear_create_issue':
      return handleLinearCreateIssue(args);
    case 'linear_list_issues':
      return handleLinearListIssues(args);
    case 'linear_update_issue':
      return handleLinearUpdateIssue(args);
    case 'linear_list_teams':
      return handleLinearListTeams();
    case 'linear_add_comment':
      return handleLinearAddComment(args);
    case 'sheets_create_spreadsheet':
      return handleSheetsCreateSpreadsheet(args);
    case 'sheets_read_data':
      return handleSheetsReadData(args);
    case 'sheets_write_data':
      return handleSheetsWriteData(args);
    case 'sheets_append_data':
      return handleSheetsAppendData(args);
    case 'drive_list_files':
      return handleDriveListFiles(args);
    case 'drive_create_folder':
      return handleDriveCreateFolder(args);
    case 'drive_upload_file':
      return handleDriveUploadFile(args);
    case 'drive_download_file':
      return handleDriveDownloadFile(args);
    case 'docs_create_document':
      return handleDocsCreateDocument(args);
    case 'docs_get_document':
      return handleDocsGetDocument(args);
    case 'docs_insert_text':
      return handleDocsInsertText(args);
    case 'gmail_send_email':
      return handleGmailSendEmail(args);
    case 'gmail_list_messages':
      return handleGmailListMessages(args);
    case 'gmail_get_message':
      return handleGmailGetMessage(args);
    case 'calendar_create_event':
      return handleCalendarCreateEvent(args);
    case 'calendar_list_events':
      return handleCalendarListEvents(args);
    case 'calendar_update_event':
      return handleCalendarUpdateEvent(args);
    case 'notion_search':
      return handleNotionSearch(args);
    case 'notion_create_page':
      return handleNotionCreatePage(args);
    case 'notion_get_page':
      return handleNotionGetPage(args);
    case 'notion_update_page':
      return handleNotionUpdatePage(args);
    case 'notion_query_database':
      return handleNotionQueryDatabase(args);
    case 'github_list_repos':
      return handleGithubListRepos(args);
    case 'github_get_repo':
      return handleGithubGetRepo(args);
    case 'github_list_issues':
      return handleGithubListIssues(args);
    case 'github_create_issue':
      return handleGithubCreateIssue(args);
    case 'github_get_file':
      return handleGithubGetFile(args);
    case 'github_create_file':
      return handleGithubCreateFile(args);
    default:
      return null;
  }
}
