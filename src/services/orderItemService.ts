import OrderItem from '../models/OrderItem';;

const createOrderItemService = async(
  orderId: string,
  productId: string,
  quantity: number,
  unitPrice: number): Promise<OrderItem | null> => {
  const totalPrice = (quantity * unitPrice).toFixed(2);
  const orderItem = await OrderItem.create({
    productId,
    orderId,
    quantity,
    unitPrice,
    totalPrice: parseInt(totalPrice),
  });
  return orderItem;
};

export { createOrderItemService };
