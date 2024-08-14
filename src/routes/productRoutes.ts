import express,{ Router } from 'express';
import { methodNotAllowed } from '../controllers/suspicionController';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import {
  createProductValidation,
  productIdValidation,
  updateProductValidation } from '../validators/productFieldsValidation';
import {
  createProduct,
  getProduct,
  deleteProduct,
  getAllProducts,
  updateProduct } from '../controllers/productsController';

const productsRouter: Router = express.Router();

productsRouter.route('/')
  .get(
    authMiddleware,
    getAllProducts,
  )
  .post(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ bodySchema: createProductValidation }),
    createProduct);

productsRouter.route('/:id')
  .get(
    authMiddleware,
    validateJoiRequest({ paramsSchema: productIdValidation }),
    getProduct,
  )
  .put(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: productIdValidation }),
    validateJoiRequest({ bodySchema: updateProductValidation }),
    updateProduct,
  )
  .delete(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: productIdValidation }),
    deleteProduct,
  );

productsRouter.route('*').all(methodNotAllowed);

export default productsRouter;
