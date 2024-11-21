import {apiRoot} from "../clients/commercetools/apiClient";
import {CartResourceIdentifier} from "@commercetools/platform-sdk";
import {Cart} from "@commercetools/connect-payments-sdk";

export class OrderService {
  public async createOrderFromCart(cart: Cart){
    return (await apiRoot.orders().post(
      {
        body: {
          version: cart.version,
          cart: {id: cart.id} as CartResourceIdentifier,
          paymentState: 'Paid',
          shipmentState: 'Pending',
          orderState: 'Confirmed'
        }
      }
    ).execute()).body;
  }
}