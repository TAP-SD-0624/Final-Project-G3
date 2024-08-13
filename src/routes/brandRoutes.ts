import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import {
  createNewBrand,
  deleteBrandById,
  getAllBrands,
  getBrandById,
  updateBrandById,
} from '../controllers/brandsController';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import {
  addBrandValidation, brandIdValidation, updateBrandValidation,
} from '../validators/brandFilesValidation';
import { methodNotAllowed } from '../controllers/suspicionController';

const brandRouter = Router();

brandRouter.route('/').post(
  authMiddleware,
  adminMiddleware,
  validateJoiRequest({ bodySchema: addBrandValidation }),
  createNewBrand,
);
brandRouter.route('/').get(
  authMiddleware,
  getAllBrands,
);
brandRouter.route('/:id').get(
  authMiddleware,
  validateJoiRequest({ paramsSchema: brandIdValidation }),
  getBrandById,
);
brandRouter.route('/').put(
  authMiddleware,
  adminMiddleware,
  validateJoiRequest({ bodySchema: updateBrandValidation , paramsSchema: brandIdValidation }),
  updateBrandById,
);
brandRouter.route('/:id').delete(
  authMiddleware,
  adminMiddleware,
  validateJoiRequest({ paramsSchema: brandIdValidation }),
  deleteBrandById,
);

brandRouter.route('*').all(methodNotAllowed);
export default brandRouter;
