import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import {
  createNewBrand,
  deleteBrandById,
  getAllBrands,
  getBrandById,
} from '../controllers/brandsController';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import { addBrandValidation, getBrandValidator } from '../validators/brandFilesValidation';
import { methodNotAllowed } from '../controllers/suspicionController';

const brandRouter = Router();

brandRouter.route('/createBrand').post(
  authMiddleware,
  adminMiddleware,
  validateJoiRequest({ bodySchema: addBrandValidation }),
  createNewBrand,
);
brandRouter.route('/getAllBrands').get(
  authMiddleware,
  getAllBrands,
);
brandRouter.route('/:id').get(
  authMiddleware,
  validateJoiRequest({ paramsSchema: getBrandValidator }),
  getBrandById,
);
brandRouter.route('/:id').delete(
  authMiddleware,
  adminMiddleware,
  validateJoiRequest({ paramsSchema: getBrandValidator }),
  deleteBrandById,
);

brandRouter.route('*').all(methodNotAllowed);
export default brandRouter;
