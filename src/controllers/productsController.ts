import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import { checkIfBrandExists } from '../services/brandService';
import APIError from '../utils/APIError';
import Product from '../db-files/models/Product';
import checkIfCategoryExists from '../services/categoryService';
import Category from '../db-files/models/Category';
import Brand from '../db-files/models/Brand';
import { Op } from 'sequelize';
import { addMonths, startOfMonth, endOfMonth } from 'date-fns';
import {
  productsService,
  oneProductService,
  productResponseFormatter } from '../services/productService';

const createProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { name, brief, description, price, brandName,
      categoryName, discountRate , stock } = req.body;
    const category = await checkIfCategoryExists({ name: categoryName });
    const brand = await checkIfBrandExists({ name: brandName });

    if (!category) {
      return next(new APIError('Category does not exist.', 400));
    }
    if (!brand) {
      return next(new APIError('Brand does not exist.', 400));
    }
    const newProduct = await Product.create({
      name,
      brief,
      description,
      price,
      discountRate,
      stock,
      brandId: brand.id,
      categoryId: category.id,
    });
    const product = productResponseFormatter(newProduct, categoryName, brandName);
    res.status(201).json({
      status: 'success',
      product,
    });
  },
);

const getProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await oneProductService({
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
    const products = await productsService(
      {
        attributes: {
          exclude: ['brandId', 'categoryId'],
        },
      },
      req.query,
    );
    res.status(200).json({
      status: 'success',
      numberOfRecords: products.length,
      products: products.length > 0 ? products : 'No products found.',
    });
  },
);

const deleteProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await oneProductService({ where: { id } });
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
    const { categoryName, brandName } = req.body;
    const brand = await checkIfBrandExists({ name: brandName });
    if (!brand){
      return next(new APIError('Brand not found', 404));
    }
    const category = await checkIfCategoryExists({ name: categoryName });
    if (!category){
      return next(new APIError('Category not found', 404));
    }
    const product = await oneProductService({ where: { id } });
    if (!product){
      return next(new APIError('Product not found', 404));
    }
    product.update({ ...req.body, brandId: brand.id, categoryId: category.id });
    await product.save();
    res.status(200).json({
      status: 'success',
      product,
    });
  },
);

const getNewArrivals = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const currentDate = new Date();
    const threeMonthsAgo = addMonths(currentDate, -3);
    const startDate = startOfMonth(threeMonthsAgo);
    const endDate = endOfMonth(threeMonthsAgo);

    const options = {
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['createdAt', 'DESC']],
    };
    const newArrivals = await productsService(options);
    res.json(newArrivals);
  },
);

export {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getNewArrivals,
};
