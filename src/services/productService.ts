import { FindOptions, Includeable } from 'sequelize';
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

const checkProductStock = async(
  checkOptions: { product?: Product, id?: string },
  quantity: number,
) => {
  const { product, id } = checkOptions;
  let stock = 0;
  if (product) {
    ({ stock } = product);
  }
  if (id){
    const product = await oneProductService({
      where: {
        id,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stock = product?.stock as any;
  }

  if (quantity > stock) {
    return false;
  }
  return true;
};

const productResponseFormatter = (
  product: Product,
  category: string,
  brand: string,
): object => {
  const responseObject: { [key: string]: string | number | boolean | undefined } = {};
  responseObject.name = product.name;
  responseObject.brief = product.brief;
  responseObject.description = product.description;
  responseObject.price = product.price;
  responseObject.stock = product.stock;
  responseObject.discountRate = product.discountRate;
  responseObject.rating = product.rating;
  responseObject.category = category;
  responseObject.brand = brand;
  responseObject.newPrice =
    product.discountRate < 1 ? product.price * (1 - product.discountRate) : undefined;
  responseObject.isLimitedEdition = product.isLimitedEdition;
  return responseObject;
};

export { oneProductService, productsService, productResponseFormatter, checkProductStock };
