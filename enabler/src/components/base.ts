import { PayPalButtonsComponent, PayPalNamespace } from "@paypal/paypal-js";
import {
  ComponentOptions,
  PaymentComponent,
  PaymentComponentBuilder,
  PaymentMethod,
  PaymentPayload,
  PaymentResult,
} from "../payment-enabler/payment-enabler";

export type ElementOptions = {
  paymentMethod: PaymentMethod;
};

export type BaseOptions = {
  sdk: PayPalNamespace;
  processorUrl: string;
  sessionId: string;
  onComplete?: (result: PaymentResult) => void;
  onError?: (error: any) => void;
};

/**
 * Base Web Component
 */
export abstract class PaypalBaseComponentBuilder
  implements PaymentComponentBuilder
{
  public componentHasSubmit = true;

  protected paymentMethod: PaymentMethod;
  protected paymentDraft: PaymentPayload;
  protected baseOptions: BaseOptions;

  constructor(paymentMethod: PaymentMethod, baseOptions: BaseOptions) {
    this.paymentMethod = paymentMethod;
    this.baseOptions = baseOptions;
  }

  build(config: ComponentOptions): PaymentComponent {
    const component = new DefaultPaypalComponent(
      this.paymentMethod,
      this.baseOptions,
      config
    );
    component.init();
    return component;
  }
}

export class DefaultPaypalComponent implements PaymentComponent {
  protected component: PayPalButtonsComponent;
  protected paymentMethod: PaymentMethod;
  protected baseOptions: BaseOptions;
  protected componentOptions: ComponentOptions;

  constructor(
    paymentMethod: PaymentMethod,
    baseOptions: BaseOptions,
    componentOptions: ComponentOptions
  ) {
    this.paymentMethod = paymentMethod;
    this.baseOptions = baseOptions;
    this.componentOptions = componentOptions;
  }

  init() {
    this.component = this.baseOptions.sdk.Buttons({});
  }

  submit(): void {
    return;
  }

  mount(selector: string): void {
    console.log(this.component.isEligible);
    this.component.render(selector);
  }
}
