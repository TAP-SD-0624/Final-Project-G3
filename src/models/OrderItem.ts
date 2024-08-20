import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';
import Order from './Order';
import Product from './Product';

class OrderItem extends Model {
  id!: string;
  quantity!: number;
  price!: number;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.UUID,
      references: {
        model: Order,
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.UUID,
      references: {
        model: Product,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'orderItems',
    updatedAt: false,
    timestamps: true,
  },
);

export default OrderItem;
