import express,{ Router } from 'express';
import { methodNotAllowed } from '../controllers/suspicionController';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import {
  createProductValidation,
  getProductValidation } from '../validators/productFieldsValidation';
import {
  createProduct,
  getProduct,
  getAllProducts } from '../controllers/productsController';

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
    validateJoiRequest({ paramsSchema: getProductValidation }),
    getProduct,
  )
  .post()
  .put()
  .delete();

productsRouter.route('*').all(methodNotAllowed);

export default productsRouter;
