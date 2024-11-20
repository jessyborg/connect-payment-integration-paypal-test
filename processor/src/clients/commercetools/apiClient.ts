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
//Don't import all scopes it's for testing purpose here
const scopes = [
  `view_messages:${projectKey}`,
  `manage_quote_requests:${projectKey}`,
  `view_project_settings:${projectKey}`,
  `create_anonymous_token:${projectKey}`,
  `manage_extensions:${projectKey}`,
  `view_tax_categories:${projectKey}`,
  `manage_payments:${projectKey}`,
  `view_product_selections:${projectKey}`,
  `manage_api_clients:${projectKey}`,
  `manage_approval_rules:${projectKey}`,
  `view_standalone_prices:${projectKey}`,
  `manage_order_edits:${projectKey}`,
  `manage_cart_discounts:${projectKey}`,
  `view_quote_requests:${projectKey}`,
  `manage_connectors:${projectKey}`,
  `manage_standalone_prices:${projectKey}`,
  `manage_my_shopping_lists:${projectKey}`,
  `manage_product_selections:${projectKey}`,
  `manage_import_containers:${projectKey}`,
  `manage_shipping_methods:${projectKey}`,
  `view_api_clients:${projectKey}`,
  `manage_associate_roles:${projectKey}`,
  `manage_tax_categories:${projectKey}`,
  `manage_orders:${projectKey}`,
  `manage_my_payments:${projectKey}`,
  `manage_attribute_groups:${projectKey}`,
  `view_stores:${projectKey}`,
  `view_states:${projectKey}`,
  `manage_sessions:${projectKey}`,
  `manage_staged_quotes:${projectKey}`,
  `manage_states:${projectKey}`,
  `view_quotes:${projectKey}`,
  `manage_customer_groups:${projectKey}`,
  `view_types:${projectKey}`,
  `view_shopping_lists:${projectKey}`,
  `manage_discount_codes:${projectKey}`,
  `manage_types:${projectKey}`,
  `manage_products:${projectKey}`,
  `manage_checkout_transactions:${projectKey}`,
  `manage_quotes:${projectKey}`,
  `introspect_oauth_tokens:${projectKey}`,
  `manage_checkout_payment_intents:${projectKey}`,
  `view_orders:${projectKey}`,
  `manage_approval_flows:${projectKey}`,
  `manage_subscriptions:${projectKey}`,
  `manage_project_settings:${projectKey}`,
  `manage_customers:${projectKey}`,
  `manage_categories:${projectKey}`,
  `manage_connectors_deployments:${projectKey}`,
  `manage_shopping_lists:${projectKey}`,
  `manage_stores:${projectKey}`,
  `view_payments:${projectKey}`,
  `view_shipping_methods:${projectKey}`,
  `view_products:${projectKey}`,
  `view_staged_quotes:${projectKey}`
];



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