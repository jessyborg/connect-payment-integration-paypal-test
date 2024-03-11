import { BaseOptions } from '../components/base';
import { Paypal } from '../components/payment-methods/paypal/paypal';
import { loadScript, PayPalScriptOptions } from '@paypal/paypal-js'
import { ComponentOptions, EnablerOptions, PaymentEnabler } from './payment-enabler';

type PaypalEnablerOptions = EnablerOptions & {
  config: Omit<PayPalScriptOptions, 'clientId'>
}
export class PaypalPaymentEnabler implements PaymentEnabler {
  setupData: Promise<{ baseOptions: BaseOptions }>;

  constructor(options: PaypalEnablerOptions) {
    this.setupData = PaypalPaymentEnabler._Setup(options);
  }

  private static _Setup = async (options: PaypalEnablerOptions): Promise<{ baseOptions: BaseOptions }> => {
    const configResponse = await fetch(options.processorUrl + '/operations/config', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'X-Session-Id': options.sessionId },
    })

    const configJson = await configResponse.json();

    const paypalCheckout = await loadScript({
      clientId: configJson.clientId,
      ...(options.config.locale ? { locale: options.config.locale } : {}),
      ...(options.config.currency ? { currency: options.config.currency } : {})
    })

    return {
      baseOptions: {
        sdk: paypalCheckout,
        processorUrl: options.processorUrl,
        sessionId: options.sessionId,
      }
    }
  }

  async createComponent(type: string, componentOptions: ComponentOptions) {
    const { baseOptions } = await this.setupData;
    const supportedMethods = {
      paypal: Paypal
    }

    if (!Object.keys(supportedMethods).includes(type)) {
      throw new Error(`Component type not supported: ${type}. Supported types: ${Object.keys(supportedMethods).join(', ')}`);
    }
    return new supportedMethods[type](baseOptions, componentOptions);
  }
}
