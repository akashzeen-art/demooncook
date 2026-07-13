/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/** CM MTN unsub — GET .../prod/CMMTN/unsub?cp=1&pid=9&msisdn=<msisdn> */
export interface UnsubApiResponse {
  response:     string;
  errorMessage: string;
}
