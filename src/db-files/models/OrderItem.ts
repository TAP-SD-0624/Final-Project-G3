import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database';

class OrderItem extends Model {
  id!: string;
  quantity!: number;
  unitPrice!: number;
  totalPrice!: number;
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
    unitPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    // orderId: {
    //   type: DataTypes.UUID,
    //   references: {
    //     model: Order,
    //     key: 'id',
    //   },
    // },
    // productId: {
    //   type: DataTypes.UUID,
    //   references: {
    //     model: Product,
    //     key: 'id',
    //   },
    // },
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
