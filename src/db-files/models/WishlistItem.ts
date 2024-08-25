import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database';

class WishListItem extends Model {
  id!: string;
}

WishListItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'WishListItem',
    tableName: 'wishListItems',
    updatedAt: false,
    timestamps: true,
  },
);

export default WishListItem;
