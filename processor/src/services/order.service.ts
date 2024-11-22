import {apiRoot} from "../clients/commercetools/apiClient";
import {CartResourceIdentifier} from "@commercetools/platform-sdk";
import {Cart} from "@commercetools/connect-payments-sdk";
import {randomUUID} from "crypto";

export class OrderService {
  public async createOrderFromCart(cart: Cart){
    return (await apiRoot.orders().post(
      {
        body: {
          version: cart.version,
          cart: {id: cart.id} as CartResourceIdentifier,
          paymentState: 'Paid',
          shipmentState: 'Pending',
          orderState: 'Confirmed',
          orderNumber: randomUUID()
        }
      }
    ).execute()).body;
  }
}