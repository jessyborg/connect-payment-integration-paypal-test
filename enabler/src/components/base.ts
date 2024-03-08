import { PayPalButtonsComponent, PayPalNamespace } from '@paypal/paypal-js'
import { ComponentOptions, PaymentComponent, PaymentMethod, PaymentResult } from '../payment-enabler/payment-enabler';

export type ElementOptions = {
  paymentMethod: PaymentMethod;
};

export type BaseOptions = {
  sdk: PayPalNamespace,
  processorUrl: string,
  sessionId: string,
  paymentPayload?: { 
    intent: string;
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: string;
          user_action: string;
        }
      }
    }
  };
}

/**
 * Base Web Component
 */
export abstract class BaseComponent implements PaymentComponent {
  protected paymentMethod: PaymentMethod;
  protected sdk: PayPalNamespace;
  protected showPayButton: boolean;
  protected onComplete: (result: PaymentResult) => void;
  protected onError: (error?: any) => void;
  protected component: PayPalButtonsComponent

  constructor(paymentMethod: PaymentMethod, baseOptions: BaseOptions, componentOptions: ComponentOptions) {
    this.paymentMethod = paymentMethod;
    this.sdk = baseOptions.sdk;
    this.component = this._create()
  }

  protected _create(): PayPalButtonsComponent {
    return this.sdk.Buttons({})
  }

  abstract submit(): void;

  abstract mount(selector: string): void ;

  showValidation?(): void;
  isValid?(): boolean;
  getState?(): {
    card?: {
      endDigits?: string;
      brand?: string;
      expiryDate? : string;
    }
  };
}
