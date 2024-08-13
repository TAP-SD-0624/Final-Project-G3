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

brandRouter.route('/')
  .get(
    authMiddleware,
    getAllBrands,
  )
  .post(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ bodySchema: addBrandValidation }),
    createNewBrand,
  );

brandRouter.route('/:id')
  .get(
    authMiddleware,
    validateJoiRequest({ paramsSchema: getBrandValidator }),
    getBrandById,
  )
  .put(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: getBrandValidator }),
    validateJoiRequest({ bodySchema: updateBrandValidator }),
    updateBrandById,
  )
  .delete(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: getBrandValidator }),
    deleteBrandById,
  );

brandRouter.route('*').all(methodNotAllowed);
export default brandRouter;
