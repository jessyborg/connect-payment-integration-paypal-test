import { describe, test, expect, afterEach, jest, afterAll, beforeAll, beforeEach } from '@jest/globals';
import {
  ConfigResponse,
  OperationService,
  OperationServiceOptions,
  ModifyPayment,
} from '../src/services/types/operation.type';
import { DefaultOperationService } from '../src/services/operation.service';
import { PaypalOperationProcessor } from '../src/services/processors/paypal-operation.processor';
import { paymentSDK } from '../src/payment-sdk';
import { DefaultPaymentService } from '@commercetools/connect-payments-sdk/dist/commercetools/services/ct-payment.service';
import { mockGetPaymentResult, mockUpdatePaymentResult } from './utils/mock-payment-data';
import * as Config from '../src/config/config';
import { setupServer } from 'msw/node';
import { PaypalBasePath, PaypalUrls } from '../src/services/types/paypal-api.type';
import { paypalAuthenticationResponse, paypalCaptureOrderOkResponse } from './utils/mock-paypal-response-data';
import { mockPaypalRequest } from './utils/paypal-request.mock';

interface FlexibleConfig {
  [key: string]: string | number | undefined; // Adjust the type according to your config values
}

function setupMockConfig(keysAndValues: Record<string, string>) {
  const mockConfig: FlexibleConfig = {};
  Object.keys(keysAndValues).forEach((key) => {
    mockConfig[key] = keysAndValues[key];
  });

  jest.spyOn(Config, 'getConfig').mockReturnValue(mockConfig as any);
}

describe('operation.service', () => {
  const mockServer = setupServer();
  const opts: OperationServiceOptions = {
    operationProcessor: new PaypalOperationProcessor(),
    ctCartService: paymentSDK.ctCartService,
    ctPaymentService: paymentSDK.ctPaymentService,
  };

  beforeAll(() => {
    mockServer.listen({
      onUnhandledRequest: 'bypass',
    });
  });

  beforeEach(() => {
    jest.setTimeout(10000);
    jest.resetAllMocks();
  });

  afterAll(() => {
    mockServer.close();
  });

  afterEach(() => {
    // jest.restoreAllMocks();
    mockServer.resetHandlers();
  });

  test('getConfig', async () => {
    // Setup mock config for a system using `clientKey`
    setupMockConfig({ paypalClientId: '', paypalEnvironment: 'test' });

    const opService: OperationService = new DefaultOperationService(opts);
    const result: ConfigResponse = await opService.getConfig();

    // Assertions can remain the same or be adapted based on the abstracted access
    expect(result?.clientId).toStrictEqual('');
    expect(result?.environment).toStrictEqual('test');
  });

  test('getSupportedPaymentComponents', async () => {
    const opService: OperationService = new DefaultOperationService(opts);
    const result = await opService.getSupportedPaymentComponents();
    expect(result?.components).toHaveLength(1);
    expect(result?.components[0]?.type).toStrictEqual('paypal');
  });

  test('modifyPayment', async () => {
    // Given
    const orderId = mockUpdatePaymentResult.interfaceId as string;
    const url = PaypalUrls.ORDERS_CAPTURE.replace(/{resourceId}/g, orderId);
    mockServer.use(
      mockPaypalRequest(PaypalBasePath.TEST, `${PaypalUrls.AUTHENTICATION}`, 200, paypalAuthenticationResponse),
      mockPaypalRequest(PaypalBasePath.TEST, url, 201, paypalCaptureOrderOkResponse),
    );

    const opService: OperationService = new DefaultOperationService(opts);
    const modifyPaymentOpts: ModifyPayment = {
      paymentId: 'dummy-paymentId',
      data: {
        actions: [
          {
            action: 'capturePayment',
            amount: {
              centAmount: 3000,
              currencyCode: 'EUR',
            },
          },
        ],
      },
    };

    jest.spyOn(DefaultPaymentService.prototype, 'getPayment').mockResolvedValue(mockGetPaymentResult);
    jest.spyOn(DefaultPaymentService.prototype, 'updatePayment').mockResolvedValue(mockUpdatePaymentResult);

    const result = await opService.modifyPayment(modifyPaymentOpts);
    expect(result?.outcome).toStrictEqual('approved');
  });
});