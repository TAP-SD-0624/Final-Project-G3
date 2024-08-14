import { Router } from 'express';
import {
  createNewCategory,
  getAllCategories,
  getCategoryById,
  deleteCategoryById,
  updateCategoryById,
} from '../controllers/categoriesController';
import { methodNotAllowed } from '../controllers/suspicionController';
import { createCategoryValidation
  , categoryIdValidation
  , updateCategoryValidation } from '../validators/categoryFieldsValidation';
import validateJoiRequest from '../middlewares/validateJoiRequest';

import authMiddleware  from '../middlewares/authMiddleware';

import adminMiddleware from '../middlewares/adminMiddleware';

const categoryRouter = Router();

categoryRouter.route('/')
  .get(
    authMiddleware,
    getAllCategories,
  )
  .post(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ bodySchema: createCategoryValidation }),
    createNewCategory,
  );

categoryRouter.route('/:id')
  .get(
    authMiddleware,
    validateJoiRequest({ paramsSchema: categoryIdValidation }),
    getCategoryById,
  )
  .put(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: categoryIdValidation }),
    validateJoiRequest({ bodySchema: updateCategoryValidation }),
    updateCategoryById,
  )
  .delete(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: categoryIdValidation }),
    deleteCategoryById,
  );

categoryRouter.route('*').all(methodNotAllowed);

export default categoryRouter;