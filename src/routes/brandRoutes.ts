import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { createNewBrand, getAllBrands } from '../controllers/brandsController';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import { addBrandValidation } from '../validators/brandFilesValidation';
import { methodNotAllowed } from '../controllers/suspicionController';

const brandRouter = Router();

brandRouter.route('/createBrand').post(
  authMiddleware,
  adminMiddleware,
  validateJoiRequest(addBrandValidation),
  createNewBrand,
);
brandRouter.route('/getAllBrands').get(
  authMiddleware,
  getAllBrands,
);

brandRouter.route('*').all(methodNotAllowed);
export default brandRouter;
