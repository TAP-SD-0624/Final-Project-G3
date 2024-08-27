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
import {
  countProductImages,
  createProductImageService,
  deleteProductImagesService,
  productImageService } from '../services/productImageService';
import { deleteFromFirebase, uploadToFireBase } from '../utils/firebaseOperations';
import ProductImage from '../db-files/models/ProductImage';

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
        {
          model: ProductImage,
          attributes: ['path'],
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
    await deleteProductImagesService(id); // to delete product's images from Firebase
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

const addImageToProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!req.file){
      return next(new APIError('No image provided', 400));
    }
    const product = await oneProductService({ where: { id } });
    if (!product){
      return next(new APIError('Product not found', 404));
    }
    const imagesCount = await countProductImages(id);
    if (imagesCount >= 5){
      return next(new APIError('A product should not have more than 5 images', 400));
    }
    const productImage = await createProductImageService(id);
    if (!productImage){
      return next(new APIError('Something wrong happened creating a new image record', 500));
    }
    const downloadURL = await uploadToFireBase(req, 'products');
    if (!downloadURL){
      return next(new APIError('Product image uploading failed', 500));
    }
    productImage.path = downloadURL;
    await productImage.save();
    res.status(201).json({
      status: 'success',
      productImage,
    });
  },
);

const deleteProductImage = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id, productImageId } = req.params;
    const product = await oneProductService({ where: { id } });
    if (!product){
      return next(new APIError('Product not found', 404));
    }
    const productImage = await productImageService(productImageId, id);
    if (!productImage){
      return next(new APIError('Product image with that ID does not exist', 404));
    }
    await deleteFromFirebase(productImage.path);
    await productImage.destroy();
    res.sendStatus(204);
  },
);

export {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  addImageToProduct,
  deleteProductImage,
};
