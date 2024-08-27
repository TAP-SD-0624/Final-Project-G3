import { Op } from 'sequelize';
import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import { checkIfBrandExists } from '../services/brandService';
import APIError from '../utils/APIError';
import Product from '../db-files/models/Product';
import checkIfCategoryExists from '../services/categoryService';
import Category from '../db-files/models/Category';
import Brand from '../db-files/models/Brand';
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
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    const filterOptions = {
      createdAt: {
        [Op.between]: [threeMonthsAgo, now],
      },
    };

    const newArrivals = await productsService({}, undefined, filterOptions);

    res.status(200).json({
      status: 'success',
      numberOfRecords: newArrivals.length,
      products: newArrivals.length > 0 ? newArrivals : 'No new arrivals found.',
    });
  },
);
// Fetch Handpicked Collections
const getHandpickedCollections = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const filterOptions = {
      rating: { [Op.gt]: 4.5 },
      price: { [Op.lt]: 100 },
    };

    const handpickedCollections = await productsService({}, undefined, filterOptions);

    res.status(200).json({
      status: 'success',
      numberOfRecords: handpickedCollections.length,
      products: handpickedCollections.length > 0 ?
        handpickedCollections : 'No handpicked collections found.',
    });
  },
);

// Fetch Limited Edition Products
const getLimitedEditionProducts = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const filterOptions = {
      stock: { [Op.lt]: 20 },
    };

    const limitedEditionProducts = await productsService({}, undefined, filterOptions);

    res.status(200).json({
      status: 'success',
      numberOfRecords: limitedEditionProducts.length,
      products: limitedEditionProducts.length > 0 ?
        limitedEditionProducts : 'No limited edition products found.',
    });
  },
);

const getDiscountedProducts = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const filterOptions = {
      discountRate: { [Op.gte]: 0.15 },
    };

    const discountedProducts = await productsService({}, undefined, filterOptions);

    res.status(200).json({
      status: 'success',
      numberOfRecords: discountedProducts.length,
      products: discountedProducts.length > 0 ?
        discountedProducts : 'No products with 15% off or more found.',
    });
  },
);

const getPopularProducts = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const filterOptions = {
      rating: { [Op.gte]: 4.5 },
    };

    const popularProducts = await productsService({}, undefined, filterOptions);

    res.status(200).json({
      status: 'success',
      numberOfRecords: popularProducts.length,
      products: popularProducts.length > 0 ? popularProducts : 'No popular products found.',
    });
  },
);

const getSearchedProducts = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { query } = req;
    const searchTerm = query.term as string;

    if (!searchTerm) {
      return next(new APIError('Search term is required.', 400));
    }

    const filterOptions = {
      name: {
        [Op.like]: `%${searchTerm}%`,
      },
    };

    const products = await productsService(
      {
        where: filterOptions,
      },
    );

    res.status(200).json({
      status: 'success',
      numberOfProducts: products.length,
      products: products.length > 0 ? products : 'No products found matching your search.',
    });
  },
);

// still under disscussion  ---------------------------------------------------
const getRelatedProducts = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { productName } = req.params;

    if (!productName) {
      return next(new APIError('Product name is required.', 404));
    }

    const filterOptions = {
      name: {
        [Op.iLike]: `%${productName}%`,
      },
    };

    const relatedProducts = await productsService({}, undefined, filterOptions);

    res.status(200).json({
      status: 'success',
      numberOfRecords: relatedProducts.length,
      products: relatedProducts.length > 0 ? relatedProducts : 'No related products found.',
    });
  },
);

export {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getNewArrivals,
  getHandpickedCollections,
  getLimitedEditionProducts,
  getDiscountedProducts,
  getPopularProducts,
  getRelatedProducts,
  getSearchedProducts,
};
