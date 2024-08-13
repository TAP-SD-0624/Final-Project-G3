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
  addBrandValidation,
  getBrandValidator,
  updateBrandValidator,
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
  validateJoiRequest({ paramsSchema: getBrandValidator }),
  getBrandById,
);
brandRouter.route('/').put(
  authMiddleware,
  adminMiddleware,
  validateJoiRequest({ bodySchema: updateBrandValidator }),
  updateBrandById,
);
brandRouter.route('/:id').delete(
  authMiddleware,
  adminMiddleware,
  validateJoiRequest({ paramsSchema: getBrandValidator }),
  deleteBrandById,
);

brandRouter.route('*').all(methodNotAllowed);
export default brandRouter;
