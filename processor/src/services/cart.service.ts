import {apiRoot} from "../clients/commercetools/apiClient";
import {Cart} from "@commercetools/connect-payments-sdk";

export class CartService {

  public async getCartByPaymentId(paymentId: string){
    const {body: cartPaged} = await apiRoot
      .carts()
      .get({
        queryArgs: {
          where: `paymentInfo(payments(id="${paymentId}"))`,
        },
      })
      .execute();

    if(cartPaged.count > 1){
      throw new Error('Too many results for the same payment');
    } else if(cartPaged.count == 0){
      throw new Error('No cart found for this payment.')
    }

    return cartPaged.results[0];
  }

  public async recalculate(cart: Cart){
    return (await apiRoot
      .carts()
      .withId({ID: cart.id})
      .post({
        version: cart.version,
        actions: [
          {
            action: "recalculate",
            updateProductData: true
          }
        ]
      } as any).execute()).body;
  }
}