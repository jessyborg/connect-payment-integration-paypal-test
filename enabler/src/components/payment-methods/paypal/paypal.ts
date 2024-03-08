import { ComponentOptions } from '../../../payment-enabler/payment-enabler';
import { BaseComponent, BaseOptions } from '../../base';

export class Paypal extends BaseComponent {
  protected sessionId: string;
  protected processorUrl: string;
  protected paymentConfig: any;

  constructor(baseOptions: BaseOptions, componentOptions: ComponentOptions) {
    super(baseOptions, componentOptions);
    this.processorUrl = baseOptions.processorUrl;
    this.sessionId = baseOptions.sessionId;
    this.paymentConfig = baseOptions.paymentPayload;
  }

  protected _create() {
    return this.sdk.Buttons({
      createOrder: async (): Promise<string> => {
        try {
          const response = await fetch(this.processorUrl + '/checkout/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 'X-Session-Id': this.sessionId
            },
            body: JSON.stringify(this.paymentConfig)
          })
          const data = await response.json()
          if (data.id) {
            return data.id
          }

          const errorDetail = data?.errors[0]?.details?.[0]
          const errorMessage = errorDetail
            ? `${errorDetail.issue} ${errorDetail.description} (${data.debug_id})`
            : JSON.stringify(data);

          throw new Error(errorMessage);
        } catch (err) {
          console.error(err)
        }
      }
    })
  }

  mount(selector: string) {
    this.component.render(selector)
  }

  async submit() {}

  getState() {
    return {};
  }
}
