import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';
import { OrderStatus } from '../enums/orderStatus';

class Order extends Model {
  id!: string;
  totalAmount!: number;
  orderStatus!: OrderStatus;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    totalAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      defaultValue: OrderStatus.Completed,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    updatedAt: false,
    timestamps: true,
  },
);

export default Order;
