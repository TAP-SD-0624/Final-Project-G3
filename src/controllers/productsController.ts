import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import checkIfBrandExists from '../services/brandService';
import APIError from '../utils/APIError';
import Product from '../models/Product';
import checkIfCategoryExists from '../services/categoryService';
import Category from '../models/Category';
import Brand from '../models/Brand';
import { getProductService } from '../services/productService';

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

const getAllProducts = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const products = await Product.findAll({
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
    res.status(200).json({
      status: 'success',
      products: products.length > 0 ? products : 'No products found.',
    });
  },
);

const deleteProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await getProductService({ id });
    if (!product){
      return next(new APIError('Product not found', 404));
    }
    await product.destroy();
    res.sendStatus(204);
  },
);

const updateProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { categoryId, brandId } = req.body;
    if (! await checkIfBrandExists({ id: brandId })){
      return next(new APIError('Brand not found', 404));
    }
    if (! await checkIfCategoryExists({ id: categoryId })){
      return next(new APIError('Category not found', 404));
    }
    const product = await getProductService({ id });
    if (!product){
      return next(new APIError('Product not found', 404));
    }
    product.update(req.body);
    await product.save();
    res.status(200).json({
      status: 'success',
      product,
    });
  },
);

export {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
};
