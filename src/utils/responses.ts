/**
 * Standardized error response utility
 */
export function createErrorResponse(message: string): { content: Array<{ type: string; text: string }> } {
  return { content: [{ type: 'text', text: `Error: ${message}` }] };
}

/**
 * Standardized success response utility
 */
export function createSuccessResponse(data: unknown): { content: Array<{ type: string; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

/**
 * Standardized validation error response
 */
export function createValidationErrorResponse(error: string): { content: Array<{ type: string; text: string }> } {
  return { content: [{ type: 'text', text: `Validation error: ${error}` }] };
}

/**
 * Standardized not found error response
 */
export function createNotFoundResponse(entityType: string, id?: string): { content: Array<{ type: string; text: string }> } {
  const message = id 
    ? `${entityType} with ID '${id}' not found`
    : `${entityType} not found`;
  return { content: [{ type: 'text', text: `Error: ${message}` }] };
}
