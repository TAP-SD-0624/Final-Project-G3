import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';

class Product extends Model {
  id!: string;
  name!: string;
  brief!: string;
  description!: string;
  stock!: number;
  rating!: number;
  isLimitedEdition!: boolean;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    brief: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    isLimitedEdition: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.stock < 10;
      },
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    updatedAt: false,
    timestamps: true,
  },
);

export default Product;
