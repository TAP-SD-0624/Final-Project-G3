import Order from '../models/Order';

const createOrderService = async(
  userId: string,
  orderOwner: string,
  phoneNumber: string,
  cardNumber: string) => {
  const order = await Order.create({
    userId,
    orderOwner,
    phoneNumber,
    cardNumber });
  return order;
};

export { createOrderService };
