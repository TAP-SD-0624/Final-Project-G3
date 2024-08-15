import { FindOptions, Includeable, Op } from 'sequelize';
import Product from '../models/Product';
import { productQueryInterface } from '../utils/interfaces/productQueryOptionsInterface';
import Brand from '../models/Brand';
import Category from '../models/Category';

const oneProductService = async(
  options?: FindOptions,
): Promise<Product | null> => {
  const product = await Product.findOne(options);
  return product;
};

const productsService = async(
  options: FindOptions = {},
  query?: productQueryInterface,
): Promise<Product[]> => {
  const include: Includeable[] = [];
  const brandInclude: Includeable = {
    model: Brand,
    attributes: ['name', 'id'],
  };
  const categoryInclude: Includeable = {
    model: Category,
    attributes: ['name', 'id'],
  };
  if (query?.category) {
    categoryInclude.where = {
      name: query.category,
    };
  }
  if (query?.brand) {
    brandInclude.where = {
      name: query.brand,
    };
  }
  include.push(categoryInclude, brandInclude);
  options.include = include;
  const products = await Product.findAll(options);
  return products;
};

export { oneProductService, productsService };

/*
options?.include?[0].where = {
      name: {
        [Op.iLike] : `%${query.category}%`,
      },
    }

*/
