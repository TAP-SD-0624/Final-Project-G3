import express,{ Router } from 'express';
import { methodNotAllowed } from '../controllers/suspicionController';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import {
  createProductValidation,
  getProductsQueryValidation,
  productIdValidation,
  updateProductValidation } from '../validators/productFieldsValidation';
import {
  createProduct,
  getProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
  getNewArrivals,
  getHandpickedCollections,
  getLimitedEditionProducts,
  getDiscountedProducts,
  getPopularProducts,
  getRelatedProducts,
  getSearchedProducts } from '../controllers/productsController';

const productsRouter: Router = express.Router();

productsRouter.route('/')
  .get(
    authMiddleware,
    validateJoiRequest({ querySchema: getProductsQueryValidation }),
    getAllProducts,
  )
  .post(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ bodySchema: createProductValidation }),
    createProduct);

productsRouter.route('/newArrivals')
  .get(
    authMiddleware,
    getNewArrivals,
  );

productsRouter.route('/handpickedCollections')
  .get(
    authMiddleware,
    getHandpickedCollections,
  );

productsRouter.route('/limitedEdition')
  .get(
    authMiddleware,
    getLimitedEditionProducts,
  );

productsRouter.route('/discountedProducts')
  .get(
    authMiddleware,
    getDiscountedProducts,
  );

productsRouter.route('/popularProducts')
  .get(
    authMiddleware,
    getPopularProducts,
  );

productsRouter.route('/relatedProducts/:productName')
  .get(
    authMiddleware,
    getRelatedProducts,
  );

productsRouter.route('/search')
  .get(
    authMiddleware,
    getSearchedProducts,
  );

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
