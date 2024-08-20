import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Address extends Model {
  id!: string;
  city!: string;
  street!: string;
  buildingNumber!: number;
}

Address.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    street: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    buildingNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    updatedAt: false,
    timestamps: true,
  },
);

export default Address;
