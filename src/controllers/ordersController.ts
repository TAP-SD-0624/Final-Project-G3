import { createAddressService } from '../services/addressService';
import { createOrderService } from '../services/orderService';
import { checkProductStock, oneProductService } from '../services/productService';
import APIError from '../utils/APIError';
import errorHandler from '../utils/errorHandler';
import { Request, Response, NextFunction } from 'express';

const createOrder = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { address, itemsList, orderOwner, phoneNumber, cardNumber } = req.body;
    const userId = (req as any).user.id;
    const { street, city, pin, state } = address;
    // this loop iterates through the itemsList to check if the requested products exist and to check the stock availability for each one of them
    for (let i = 0; i < itemsList.length; i++) { 
      let item = itemsList[i];
      let product = await oneProductService(item.id);
      if(! product){
        return next(new APIError('Product not found.', 404));
      }
      if(! await checkProductStock({ product }, item.quantity)){
        return next(new APIError(`Not enough stock for product: ${product.name}.`, 400));
      }

    }
    const newAddress = await createAddressService(state, city, street, pin);
    const newOrder = await createOrderService(userId, orderOwner, phoneNumber, cardNumber);
  },
);

export { createOrder };
