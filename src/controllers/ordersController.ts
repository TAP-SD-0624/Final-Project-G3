import { Transaction } from 'sequelize';
import sequelize from '../database';
import { createAddressService } from '../services/addressService';
import { createOrderItemService } from '../services/orderItemService';
import { createOrderService, calculateDiscount } from '../services/orderService';
import {
  checkProductStock,
  oneProductService,
  updateProductService,
} from '../services/productService';
import APIError from '../utils/APIError';
import errorHandler from '../utils/errorHandler';
import { Request, Response, NextFunction } from 'express';
import User from '../db-files/models/User';
import Order from '../db-files/models/Order';
import OrderItem from '../db-files/models/OrderItem';
import Address from '../db-files/models/Address';
import Product from '../db-files/models/Product';

const createOrder = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const transaction: Transaction = await sequelize.transaction();
    const { address, itemsList, orderOwner, phoneNumber, cardNumber } = req.body;
    const { street, city, pin, state } = address;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).user.id;
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
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
    let totalDiscount = 0;
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
      if (!product) {
        await transaction.rollback();
        return next(new APIError('Product not found.', 404));
      }
      // check if stock available isn't enough
      if (! await checkProductStock({ product }, item.quantity)) {
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
      const orderItem = await createOrderItemService(
        orderInstance.id,
        item.id,
        item.quantity,
        product.price,
        { transaction },
      );
      if (!orderItem) {
        await transaction.rollback();
        return next(new APIError('Something went wrong.', 500));
      }
      const priceAfterDiscount = calculateDiscount(orderItem.totalPrice, product.discountRate);
      totalDiscount += orderItem.totalPrice - priceAfterDiscount;
      finalPrice += priceAfterDiscount;
    }
    const finalPriceRounded: number = parseInt(finalPrice.toFixed(2));
    // check if the user's balance is enough to buy what they want
    if (finalPriceRounded > user.balance) {
      await transaction.rollback();
      return next(new APIError('Insufficient balance to complete the purchase.', 402));
    }
    user.balance -= finalPrice;
    await user.save({ transaction });
    orderInstance.totalAmount = finalPrice;
    orderInstance.totalDiscount = totalDiscount;
    await orderInstance.save({ transaction });
    // if everything went well, commit the transaction
    await transaction.commit();
    res.status(201).json({
      status: 'success',
      data: 'Order created successfully',
    });
  },
);
const getAllOrders = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).user.id;

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(new APIError('User doesn\'t exist', 500));
    }

    const orders = await Order.findAll({
      where: { userId },
      attributes: ['id', 'createdAt', 'totalDiscount', 'totalAmount', 'orderStatus'],
    });

    if (orders.length === 0) {
      res.status(200).send({
        message: 'No orders found',
      });
    } else {
      res.status(200).json({
        status: 'success',
        orders,
      });
    }
  },
);
const getOrderData = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderId = req.params.id;

    const order = await Order.findOne(
      {
        where: { id: orderId },
        attributes: [
          [sequelize.literal('totalAmount + totalDiscount'), 'subtotal'],
          'totalDiscount',
          [sequelize.literal('0'), 'deliveryFees'],
          ['totalAmount', 'grandtotal'],
          'phoneNumber',
          [sequelize.literal(`'Credit Card'`), 'paymentDetails'],
        ],
        include: [
          {
            model: Address,
            as: 'Address',
            attributes: ['state', 'city', 'street', 'pin'],
          },
          {
            model: OrderItem,
            as: 'OrderItems',
            attributes: ['quantity', 'unitPrice', 'totalPrice'],
            include: [
              {
                model: Product,
                as: 'Product',
                attributes: ['id', 'name', 'brief'],
              },
            ]
          },
        ]
      }

    );
    if (!order) {
      return next(new APIError('Order doesn\'t exist', 500));
    }
    const orderItems = await OrderItem.findAll(
      {
        where: { orderId: orderId },
        attributes: ['productId', 'unitPrice', 'quantity', 'totalPrice'],
        include: [
          {
            model: Product,
            as: 'Product',
            attributes: ['name', 'brief'],
          },]
      }
    );
    if (!orderItems) {
      return next(new APIError('No order items for this order!!', 500));
    }
    const address = await Address.findOne({
      where: { orderId: orderId }
    });
    if (!address) {
      return next(new APIError('No address for this order!!', 500));
    }
    res.status(200).json({
      status: 'success',
      order: order,
    });

  },
);

export { createOrder, getAllOrders, getOrderData };
