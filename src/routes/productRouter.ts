import { Router } from 'express';
import {
  createNewProduct,
  // getAllProducts,
  // getProductById,
  // deleteProductById,
  // updateProductById,
} from '../controllers/productsController';
import { methodNotAllowed } from '../controllers/suspicionController';
import { createProductValidation,
  // productIdValidation,
  // updateProductValidation
} from '../validators/productFieldsValidation';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';

const productRouter = Router();

productRouter.route('/')
  // .get(
  //   authMiddleware,
  //   getAllProducts,
  // )
  .post(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ bodySchema: createProductValidation }),
    createNewProduct,
  );

// productRouter.route('/:id')
//   .get(
//     authMiddleware,
//     validateJoiRequest({ paramsSchema: productIdValidation }),
//     getProductById,
//   )
//   .put(
//     authMiddleware,
//     adminMiddleware,
//     validateJoiRequest({ paramsSchema: productIdValidation }),
//     validateJoiRequest({ bodySchema: updateProductValidation }),
//     updateProductById,
//   )
//   .delete(
//     authMiddleware,
//     adminMiddleware,
//     validateJoiRequest({ paramsSchema: productIdValidation }),
//     deleteProductById,
//   );

productRouter.route('*').all(methodNotAllowed);

export default productRouter;
