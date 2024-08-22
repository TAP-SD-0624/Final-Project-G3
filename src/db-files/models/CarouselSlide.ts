import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database';

class CarouselSlide extends Model {
  id!: string;
  slideOrder!: number;
  imageUrl!: string;
  title!: string;
  description!: string;
}

CarouselSlide.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slideOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'CarouselSlide',
    tableName: 'carouselSlides',
    updatedAt: false,
    timestamps: true,
  },
);

export default CarouselSlide;
