import { Transaction } from 'sequelize';
import Order from '../db-files/models/Order';

const createOrderService = async (
  userId: string,
  orderOwner: string,
  phoneNumber: string,
  cardNumber: string,
  options: { transaction?: Transaction }) => {
  const order = await Order.create({
    userId,
    orderOwner,
    phoneNumber,
    cardNumber,
  },
    options,
  );
  return order;
};

const calculateDiscount = (brice: number, discount: number): number => {
  return brice - (discount * brice);
}

export { createOrderService, calculateDiscount };
