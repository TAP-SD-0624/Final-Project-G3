// import { Request, Response, NextFunction } from 'express';
// import Product from '../models/Product';
// import errorHandler from '../utils/errorHandler';
// import APIError from '../utils/APIError';
// import {
//   createProductResponse,
//   checkIfProductExists,
//   calculateAverageRating,
//   isProductInAnyOrderItems } from '../services/productService';
// import   checkIfBrandExists   from '../services/brandService';
// import  {checkIfCategoryExists}  from '../services/categoryService';

// const createNewProduct = errorHandler(
//   async(req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const { name, brief, description, stock, price,
//       discountRate, categoryName, brandName } = req.body;

//     // Validate product existence
//     const productExists = await checkIfProductExists({ name });
//     const category = await checkIfCategoryExists({ name: categoryName });
//     const brand = await checkIfBrandExists({ name: brandName });

//     if (productExists) {
//       return next(new APIError('Product name already exists', 400));
//     } else if (!category) {
//       return next(new APIError('Category does not exist.', 400));
//     } else if (!brand) {
//       return next(new APIError('Brand does not exist.', 400));
//     }

//     // Create the new product
//     const createdProduct = await Product.create({
//       name,
//       brief,
//       description,
//       stock,
//       price,
//       discountRate,
//       categoryId: category.id,
//       brandId: brand.id,
//     });

//     // Use service function to create the new product
//     const averageRating = await calculateAverageRating(createdProduct.id);

//     const responseProduct = createProductResponse({
//       product: createdProduct,
//       averageRating,
//       categoryName: category.name,
//       brandName: brand.name,
//     });

//     res.status(201).json({ status: 'success', product: responseProduct });
//   },
// );
// const updateProductById = errorHandler(
//   async(req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const { id } = req.params;
//     const { name, brief, description, stock, price,
//       discountRate, categoryName, brandName } = req.body;

//     // Check if the product exists
//     const product = await checkIfProductExists({ id });
//     if (!product) {
//       return next(new APIError('Product not found.', 404));
//     }

//     // Check if new product name exists
//     if (name && await checkIfProductExists({ name })) {
//       return next(new APIError('Product name already exists', 400));
//     }

//     // Check if new category and brand exist
//     const category = categoryName ? await checkIfCategoryExists({ name: categoryName }) : null;
//     const brand = brandName ? await checkIfBrandExists({ name: brandName }) : null;

//     if (categoryName && !category) {
//       return next(new APIError('Category does not exist.', 400));
//     }

//     if (brandName && !brand) {
//       return next(new APIError('Brand does not exist.', 400));
//     }

//     // Check if product is related to any order items and if price/discountRate can be updated
//     const isInOrderItems = await isProductInAnyOrderItems(id);
//     if (isInOrderItems && (price !== undefined || discountRate !== undefined)) {
//       return next(new APIError(`Product is associated with some user orders.
//          Price and discountRate cannot be changed.`, 400));
//     }

//     // Prepare update data
//     const updateData: Partial<Product> = {
//       ...(name && { name }),
//       ...(brief && { brief }),
//       ...(description && { description }),
//       ...(stock !== undefined && { stock }),
//       ...(price !== undefined && { price }),
//       ...(discountRate !== undefined && { discountRate }),
//       ...(category && { categoryId: category.id }),
//       ...(brand && { brandId: brand.id }),
//     };

//     const updatedProduct = await product.update(updateData);
//     const averageRating = await calculateAverageRating(product.id);

//     // Construct the response
//   const responseProduct = createProductResponse({
//       product: updatedProduct,
//       averageRating,
//       brandName:brandName? brandName:
//       categoryName:categoryName?categoryName:await getCategoryNameById(category.id);
//     });

//     res.status(200).json({ status: 'success', product: responseProduct });
//   });

// export { createNewProduct , updateProductById };
