import {apiRoot} from "../clients/commercetools/apiClient";

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
}