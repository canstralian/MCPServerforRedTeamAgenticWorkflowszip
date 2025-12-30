import { google } from 'googleapis';
import { LinearClient } from '@linear/sdk';
import { Client } from '@notionhq/client';
import { Octokit } from '@octokit/rest';
const connectionCache = new Map();
// Configuration constants
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000; // 1 minute buffer before expiry
function getXReplitToken() {
    const token = process.env.REPL_IDENTITY
        ? 'repl ' + process.env.REPL_IDENTITY
        : process.env.WEB_REPL_RENEWAL
            ? 'depl ' + process.env.WEB_REPL_RENEWAL
            : null;
    if (!token) {
        throw new Error('X_REPLIT_TOKEN not found for repl/depl');
    }
    return token;
}
async function refreshAndFetchConnection(connectorName) {
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    if (!hostname) {
        throw new Error('REPLIT_CONNECTORS_HOSTNAME environment variable is not set');
    }
    const xReplitToken = getXReplitToken();
    const refreshResponse = await fetch(`https://${hostname}/api/v2/connection/refresh`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X_REPLIT_TOKEN': xReplitToken
        },
        body: JSON.stringify({ connector_name: connectorName })
    });
    if (!refreshResponse.ok) {
        throw new Error(`Failed to refresh ${connectorName} token: ${refreshResponse.status}`);
    }
    const fetchResponse = await fetch(`https://${hostname}/api/v2/connection?include_secrets=true&connector_names=${connectorName}`, {
        headers: {
            'Accept': 'application/json',
            'X_REPLIT_TOKEN': xReplitToken
        }
    });
    if (!fetchResponse.ok) {
        throw new Error(`Failed to fetch ${connectorName} after refresh: ${fetchResponse.status}`);
    }
    const data = await fetchResponse.json();
    const settings = data.items?.[0];
    if (!settings) {
        throw new Error(`${connectorName} not found after refresh`);
    }
    return settings;
}
const OAUTH_CONNECTORS = new Set([
    'google-mail',
    'google-calendar',
    'google-drive',
    'google-sheet',
    'google-docs',
]);
function getTokenExpiryInfo(settings) {
    const settingsObj = settings.settings;
    const expiresAt = settingsObj?.expires_at;
    if (!expiresAt) {
        return { hasExpiry: false, isExpiring: false };
    }
    const expiryTime = new Date(expiresAt).getTime();
    return { hasExpiry: true, isExpiring: expiryTime <= Date.now() + TOKEN_EXPIRY_BUFFER_MS };
}
function shouldRefreshToken(connectorName, settings) {
    if (!OAUTH_CONNECTORS.has(connectorName)) {
        return false;
    }
    const expiryInfo = getTokenExpiryInfo(settings);
    return expiryInfo.hasExpiry && expiryInfo.isExpiring;
}
async function fetchConnectionSettings(connectorName, forceRefresh = false) {
    const cached = connectionCache.get(connectorName);
    const now = Date.now();
    if (!forceRefresh && cached) {
        const cacheAge = now - cached.fetchedAt;
        if (OAUTH_CONNECTORS.has(connectorName)) {
            if (!shouldRefreshToken(connectorName, cached.settings)) {
                return cached.settings;
            }
        }
        else {
            if (cacheAge < CACHE_TTL_MS) {
                return cached.settings;
            }
        }
    }
    if (cached && shouldRefreshToken(connectorName, cached.settings)) {
        try {
            const refreshedSettings = await refreshAndFetchConnection(connectorName);
            connectionCache.set(connectorName, { settings: refreshedSettings, fetchedAt: now });
            return refreshedSettings;
        }
        catch (error) {
            connectionCache.delete(connectorName);
            throw new Error(`Token refresh failed for ${connectorName}. Please reconnect the integration. Error: ${String(error)}`);
        }
    }
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    if (!hostname) {
        throw new Error('REPLIT_CONNECTORS_HOSTNAME environment variable is not set');
    }
    const xReplitToken = getXReplitToken();
    const response = await fetch(`https://${hostname}/api/v2/connection?include_secrets=true&connector_names=${connectorName}`, {
        headers: {
            'Accept': 'application/json',
            'X_REPLIT_TOKEN': xReplitToken
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${connectorName} connection: ${response.status}`);
    }
    const data = await response.json();
    const settings = data.items?.[0];
    if (!settings) {
        throw new Error(`${connectorName} not connected. Please connect it in the Replit integrations panel.`);
    }
    if (shouldRefreshToken(connectorName, settings)) {
        try {
            const refreshedSettings = await refreshAndFetchConnection(connectorName);
            connectionCache.set(connectorName, { settings: refreshedSettings, fetchedAt: now });
            return refreshedSettings;
        }
        catch (error) {
            throw new Error(`Token expired for ${connectorName}. Please reconnect the integration. Error: ${String(error)}`);
        }
    }
    connectionCache.set(connectorName, { settings, fetchedAt: now });
    return settings;
}
function getAccessTokenFromSettings(settings) {
    const settingsObj = settings.settings;
    let accessToken = settingsObj?.access_token;
    if (!accessToken) {
        const oauth = settingsObj?.oauth;
        const credentials = oauth?.credentials;
        accessToken = credentials?.access_token;
    }
    if (!accessToken) {
        throw new Error('Access token not found in connection settings');
    }
    return accessToken;
}
export async function getGmailClient() {
    const settings = await fetchConnectionSettings('google-mail');
    const accessToken = getAccessTokenFromSettings(settings);
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return google.gmail({ version: 'v1', auth: oauth2Client });
}
export async function getCalendarClient() {
    const settings = await fetchConnectionSettings('google-calendar');
    const accessToken = getAccessTokenFromSettings(settings);
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return google.calendar({ version: 'v3', auth: oauth2Client });
}
export async function getDriveClient() {
    const settings = await fetchConnectionSettings('google-drive');
    const accessToken = getAccessTokenFromSettings(settings);
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return google.drive({ version: 'v3', auth: oauth2Client });
}
export async function getSheetsClient() {
    const settings = await fetchConnectionSettings('google-sheet');
    const accessToken = getAccessTokenFromSettings(settings);
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return google.sheets({ version: 'v4', auth: oauth2Client });
}
export async function getDocsClient() {
    const settings = await fetchConnectionSettings('google-docs');
    const accessToken = getAccessTokenFromSettings(settings);
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return google.docs({ version: 'v1', auth: oauth2Client });
}
export async function getLinearClient() {
    const settings = await fetchConnectionSettings('linear');
    const accessToken = getAccessTokenFromSettings(settings);
    return new LinearClient({ accessToken });
}
export async function getNotionClient() {
    const settings = await fetchConnectionSettings('notion');
    const accessToken = getAccessTokenFromSettings(settings);
    return new Client({ auth: accessToken });
}
export async function getGithubClient() {
    const settings = await fetchConnectionSettings('github');
    const accessToken = getAccessTokenFromSettings(settings);
    return new Octokit({ auth: accessToken });
}
export function clearConnectionCache(connectorName) {
    if (connectorName) {
        connectionCache.delete(connectorName);
    }
    else {
        connectionCache.clear();
    }
}
//# sourceMappingURL=index.js.map