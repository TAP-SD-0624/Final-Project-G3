import { Transaction } from 'sequelize';
import sequelize from '../database';
import { createAddressService } from '../services/addressService';
import { createOrderItemService } from '../services/orderItemService';
import { createOrderService } from '../services/orderService';
import {
  checkProductStock,
  oneProductService,
  updateProductService } from '../services/productService';
import APIError from '../utils/APIError';
import errorHandler from '../utils/errorHandler';
import { Request, Response, NextFunction } from 'express';
import User from '../db-files/models/User';

const createOrder = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    const { address, itemsList, orderOwner, phoneNumber, cardNumber } = req.body;
    const { street, city, pin, state } = address;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).user.id;
    const user = await User.findOne({ where: { id: userId } });
    if (!user){
      return next(new APIError('Forced to make this if-condition :)', 500));
    }
    // create the order as a part of the transaction
    const orderInstance = await createOrderService(
      userId,
      orderOwner,
      phoneNumber,
      cardNumber,
      { transaction });
    // create the address of the order as a part of the transaction
    await createAddressService(state,
      city,
      street,
      pin,
      orderInstance.id,
      { transaction });
    let finalPrice = 0;
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
        await transaction.rollback();
        return next(new APIError('Product not found.', 404));
      }
      // check if stock available isn't enough
      if (! await checkProductStock({ product }, item.quantity)){
        await transaction.rollback();
        return next(new APIError(`Not enough stock for product: ${product.name}.`, 400));
      }
      // update stock for this product
      await updateProductService(
        product,
        {
          stock: product.stock - item.quantity,
        },
        transaction,
      );
      const orderItem =  await createOrderItemService(
        orderInstance.id,
        item.id,
        item.quantity,
        product.price,
        { transaction },
      );
      if (!orderItem){
        await transaction.rollback();
        return next(new APIError('Something went wrong.', 500));
      }
      finalPrice += orderItem.totalPrice;
    }
    const finalPriceRounded: number = parseInt(finalPrice.toFixed(2));
    // check if the user's balance is enough to buy what they want
    if (finalPriceRounded > user.balance){
      await transaction.rollback();
      return next(new APIError('Insufficient balance to complete the purchase.', 402));
    }
    user.balance -= finalPrice;
    await user.save({ transaction });
    orderInstance.totalAmount = finalPrice;
    await orderInstance.save({ transaction });
    // if everything went well, commit the transaction
    await transaction.commit();
    res.status(201).json({
      status: 'success',
      data: 'Order created successfully',
    });
  },
);

export { createOrder };
