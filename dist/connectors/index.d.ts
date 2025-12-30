import { LinearClient } from '@linear/sdk';
import { Client } from '@notionhq/client';
export declare function getGmailClient(): Promise<import("googleapis").gmail_v1.Gmail>;
export declare function getCalendarClient(): Promise<import("googleapis").calendar_v3.Calendar>;
export declare function getDriveClient(): Promise<import("googleapis").drive_v3.Drive>;
export declare function getSheetsClient(): Promise<import("googleapis").sheets_v4.Sheets>;
export declare function getDocsClient(): Promise<import("googleapis").docs_v1.Docs>;
export declare function getLinearClient(): Promise<LinearClient>;
export declare function getNotionClient(): Promise<Client>;
export declare function getGithubClient(): Promise<import("@octokit/core").Octokit & import("@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types").RestEndpointMethods & import("@octokit/plugin-rest-endpoint-methods").Api & {
    paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
}>;
export declare function clearConnectionCache(connectorName?: string): void;
//# sourceMappingURL=index.d.ts.map