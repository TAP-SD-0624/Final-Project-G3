import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import checkIfBrandExists from '../services/brandService';
import APIError from '../utils/APIError';
import Product from '../models/Product';
import checkIfCategoryExists from '../services/categoryService';
import Category from '../models/Category';
import Brand from '../models/Brand';

const createProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { name, brief, description, price, brandId, categoryId } = req.body;
    if ((await checkIfBrandExists({ id: brandId })) === null){
      return next(new APIError('Brand does not exist.', 400));
    }
    if ((await checkIfCategoryExists({ id: categoryId })) === null) {
      return next(new APIError('Category does not exist', 400));
    }
    const newProduct = await Product.create({
      name,
      brief,
      description,
      price,
      brandId,
      categoryId,
    });
    res.status(201).json({
      status: 'success',
      product: newProduct,
    });
  },
);

const getProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['brandId', 'categoryId'],
      },
      include: [
        {
          model: Category,
          attributes: ['name', 'id'],
        },
        {
          model: Brand,
          attributes: ['name', 'id'],
        },
      ],
    });
    if (!product){
      return next(new APIError('Product not found', 404));
    }
    res.status(200).json({
      status: 'success',
      product,
    });
  },
);

export {
  createProduct,
  getProduct,
};
