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

export interface PaymentComponentBuilder {
  componentHasSubmit: boolean;
  build(config: ComponentOptions): PaymentComponent;
}

export type EnablerOptions = {
  processorUrl: string;
  sessionId: string;
  currency?: string;
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

export type PaymentPayload = {
  intent: string;
  payment_source: {
    paypal: {
      experience_context: {
        payment_method_preference: string;
        user_action: string;
      }
    }
  }
}

export type ComponentOptions = {
  paymentDraft: PaymentPayload
};

export interface PaymentEnabler {
  /** 
   * @throws {Error}
   */
  createComponentBuilder: (type: string) => Promise<PaymentComponent | never>
}
