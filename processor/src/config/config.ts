export const config = {
  // Required by Payment SDK
  projectKey: process.env.CTP_PROJECT_KEY,
  clientId: process.env.CTP_CLIENT_ID,
  clientSecret: process.env.CTP_CLIENT_SECRET,
  jwksUrl: process.env.CTP_JWKS_URL,
  jwtIssuer: process.env.CTP_JWT_ISSUER,
  authUrl: process.env.CTP_AUTH_URL,
  apiUrl: process.env.CTP_API_URL,
  sessionUrl: process.env.CTP_SESSION_URL,
  healthCheckTimeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '5000'),

  // Required by logger
  loggerLevel: process.env.LOGGER_LEVEL || 'info',

  // Update with specific payment providers config
  paypalClientId: process.env.PAYPAL_CLIENT_ID,
  paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  paypalEnvironment: process.env.PAYPAL_ENVIRONMENT || 'test',
  paypalWebhookId: process.env.PAYPAL_WEBHOOK_ID,

  // TODO review these configurations
  // supportedUIElements: convertStringCommaSeparatedValuesToArray(process.env.SUPPORTED_UI_ELEMENTS),
  // enableStoreDetails: process.env.ENABLE_STORE_DETAILS === 'true' ? true : false,
  // sellerReturnUrl: process.env.SELLER_RETURN_URL || ''
};

export const getConfig = () => {
  return config;
};
