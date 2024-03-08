export interface PaymentComponent {
  mount(selector: string): void;
  submit(): void;
  showValidation?(): void;
  isValid?(): boolean;
  getState?(): {
    card?: {
      endDigits?: string;
      brand?: string;
      expiryDate?: string;
    }
  };
}

export type EnablerOptions = {
  processorUrl: string;
  sessionId: string;
  config: {
    payment?: { 
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
  };
  onComplete?: (result: PaymentResult) => void;
  onError?: (error: any) => void;
};

export enum PaymentMethod {
  paypal = 'paypal'
};

export type PaymentResult = {
  isSuccess: true;
  paymentReference: string;
} | { isSuccess: false };

export type ComponentOptions = {
  config: {
    showPayButton?: boolean;
    intent: string;
    payment
  };
};

export interface PaymentEnabler {
  /** 
   * @throws {Error}
   */
  createComponent: (type: string, opts: ComponentOptions) => Promise<PaymentComponent | never>
}
