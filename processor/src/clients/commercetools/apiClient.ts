import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/ts-client';
import 'dotenv/config';
import {ConcurrentModificationMiddlewareOptions, LoggerMiddlewareOptions} from "@commercetools/ts-client/dist/declarations/src/types/types";

// --- Configuration ---
const projectKey: string = process.env.CTP_PROJECT_KEY as string;
const clientId: string = process.env.CTP_CLIENT_ID as string;
const clientSecret: string = process.env.CTP_CLIENT_SECRET as string;
const authUrl: string = process.env.CTP_AUTH_URL as string;
const apiUrl: string = process.env.CTP_API_URL as string;
const scopes = [`manage_customers:${projectKey}`];

// --- Middleware Functions ---

// Function for custom header middleware
function createCustomHeaderMiddleware() {
  return (next : any) => (request: any) => {
    return next({
      ...request,
      headers: {
        ...request.headers,
        'accept-language': 'en-AU',
      },
    });
  };
}

// Function for custom logger middleware
const customLoggerMiddleware = {
  logLevel: 'debug',
  httpMethods: ['POST', 'GET'],
  maskSensitiveData: true,
  logger: (method: any, ...args: any[]) => {
    console.log(`[CUSTOM LOGGER] ${method}`, ...args);
  },
} as LoggerMiddlewareOptions;

// Auth Middleware Options
const authMiddlewareOptions = {
  host: authUrl,
  projectKey: projectKey,
  credentials: { clientId, clientSecret },
  scopes: scopes,
  httpClient: fetch,
} as any;

// Http Middleware Options
const httpMiddlewareOptions = {
  host: apiUrl,
  includeResponseHeaders: true,
  maskSensitiveHeaderData: false,
  includeOriginalRequest: true,
  includeRequestInErrorResponse: true,
  enableRetry: true,
  retryConfig: {
    maxRetries: 3,
    retryDelay: 200,
    backoff: false,
    retryCodes: [500, 503],
  },
  httpClient: fetch,
} as any;

// Correlation ID Middleware Options
const correlationIdMiddlewareOptions = {
  generate: () => crypto.randomUUID(),
};

// Concurrent Modification Middleware Options
const concurrentModificationMiddlewareOptions = {
  concurrentModificationHandlerFn: (version: any, request: any) => {
    console.log(`Concurrent modification error, retry with version ${version}`);
    let body = request.body as any;
    body.version = version;
    return JSON.stringify(body);
  },
} as any;

// --- Client Creation ---
const client = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withLoggerMiddleware(customLoggerMiddleware)
  .withCorrelationIdMiddleware(correlationIdMiddlewareOptions)
  .withMiddleware(createCustomHeaderMiddleware())
  .withHttpMiddleware(httpMiddlewareOptions)
  .withConcurrentModificationMiddleware(concurrentModificationMiddlewareOptions)
  .build();

// --- API Root Creation ---
const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
  projectKey,
} as any);

export { apiRoot, client };