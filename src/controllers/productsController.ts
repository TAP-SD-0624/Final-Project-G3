import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import errorHandler from '../utils/errorHandler';
import { checkIfProductExists } from '../services/productService';
import   checkIfBrandExists   from '../services/brandService';
import  checkIfCategoryExists  from '../services/categoryService';
import APIError from '../utils/APIError';

const createNewProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, brief, description, stock, categoryName, brandName } = req.body;

    // Validate product existence
    const productExists = await checkIfProductExists({ name });
    const category = await checkIfCategoryExists({ name: categoryName });
    const brand = await checkIfBrandExists({ name: brandName });

    if (productExists) {
      return next(new APIError('Product name already exists', 400));
    } else if (!category) {
      return next(new APIError('Category does not exist.', 400));
    } else if (!brand) {
      return next(new APIError('Brand does not exist.', 400));
    }

    // Create the new product
    const product = await Product.create({
      name,
      brief,
      description,
      stock,
      categoryId: category.id,
      brandId: brand.id,
    });

    // Construct the response product object
    const responseProduct = {
      isLimitedEdition: product.isLimitedEdition,
      id: product.id,
      name: product.name,
      brief: product.brief,
      description: product.description,
      stock: product.stock,
      rating: product.rating,
      brandName: brand.name,
      categoryName: category.name,
    };

    res.status(201).json({ status: 'success', product: responseProduct });
  });

export { createNewProduct };
