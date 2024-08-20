import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';

class WishList extends Model {
  id!: string;
}

WishList.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'WishList',
    tableName: 'wishLists',
    updatedAt: false,
    timestamps: true,
  },
);

export default WishList;
