export const HTTP_STATUS_CODE = {
  OK: 200,                        // Request successful
  CREATED: 201,                   // Resource created successfully
  ACCEPTED: 202,                  // Request accepted but not yet processed
  NO_CONTENT: 204,                // Request successful but no content to return
  BAD_REQUEST: 400,               // Client-side error
  UNAUTHORIZED: 401,              // Authentication required
  FORBIDDEN: 403,                 // No permission to access
  NOT_FOUND: 404,                 // Resource not found
  METHOD_NOT_ALLOWED: 405,        // HTTP method not allowed
  CONFLICT: 409,                  // Conflict with the current state of the resource
  GONE: 410,                      // Resource is no longer available
  UNPROCESSABLE_ENTITY: 422,      // Validation error or unprocessable request
  TOO_MANY_REQUESTS: 429,         // Too many requests (rate limiting)
  INTERNAL_SERVER_ERROR: 500,     // Server-side error
  NOT_IMPLEMENTED: 501,           // Server does not support the functionality
  BAD_GATEWAY: 502,               // Invalid response from an upstream server
  SERVICE_UNAVAILABLE: 503,       // Server is temporarily unavailable
  GATEWAY_TIMEOUT: 504,           // Upstream server failed to respond in time
};