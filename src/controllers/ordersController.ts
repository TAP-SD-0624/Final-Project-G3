import OrderItem from '../db-files/models/OrderItem';
import { createAddressService } from '../services/addressService';
import { createOrderItemService } from '../services/orderItemService';
import { createOrderService } from '../services/orderService';
import { checkProductStock, oneProductService } from '../services/productService';
import APIError from '../utils/APIError';
import errorHandler from '../utils/errorHandler';
import { Request, Response, NextFunction } from 'express';

const createOrder = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { address, itemsList, orderOwner, phoneNumber, cardNumber } = req.body;
    const { street, city, pin, state } = address;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).user.id;
    const orderItemsPromises: Promise<OrderItem | null>[] = [];
    const orderInstance = await createOrderService(
      userId,
      orderOwner,
      phoneNumber,
      cardNumber);
    const addressInstance = await createAddressService(state, city, street, pin, orderInstance.id);
    // this loop iterates through the itemsList to check if the requested products exist
    //and to check the stock availability for each one of them
    for (let i = 0; i < itemsList.length; i++) {
      const item = itemsList[i];
      const product = await oneProductService({
        where: {
          id: item.id,
        },
      });
      // check if product doesn't exist
      if (! product){
        addressInstance.destroy();
        await addressInstance.save();
        orderInstance.destroy();
        await orderInstance.save();
        return next(new APIError('Product not found.', 404));
      }
      // check if stock available isn't enough
      if (! await checkProductStock({ product }, item.quantity)){
        addressInstance.destroy();
        await addressInstance.save();
        orderInstance.destroy();
        await orderInstance.save();
        return next(new APIError(`Not enough stock for product: ${product.name}.`, 400));
      }
      orderItemsPromises.push(
        createOrderItemService(
          orderInstance.id,
          item.id,
          item.quantity,
          product.price,
        ),
      );
    }
    // if everything went well, execute the creation of order items asynchorously
    const orderItems = await Promise.all(orderItemsPromises);
    res.status(201).json({
      status: 'success',
      data: orderItems,
    });
  },
);

export { createOrder };
