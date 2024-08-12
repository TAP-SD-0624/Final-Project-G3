import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategoryById,
  updateCategory,
} from '../controllers/categoriesController';
import { methodNotAllowed } from '../controllers/suspicionController';
import { createCategoryValidation
  , categoryIdValidation
  , updateCategoryValidation } from '../validators/categoryFieldsValidation';
import validateJoiRequest from '../middlewares/validateJoiRequest';

import authMiddleware  from '../middlewares/authMiddleware';

import adminMiddleware from '../middlewares/adminMiddleware';

const categoryRouter = Router();

// -------------- Auth User Routes -----------------
categoryRouter.use(authMiddleware);

categoryRouter.route('/getAllCategories').get(getAllCategories);

categoryRouter.route('/:id')
  .get(validateJoiRequest({ paramsSchema: categoryIdValidation }),getCategoryById);

// -------------- Admin User Routes -----------------
categoryRouter.use(adminMiddleware);

categoryRouter.route('/createCategory')
  .post(validateJoiRequest({ bodySchema: createCategoryValidation }), createCategory);

categoryRouter.route('/:id')
  .put(validateJoiRequest({ bodySchema: updateCategoryValidation
    , paramsSchema: categoryIdValidation }),
  updateCategory);

categoryRouter.route('/:id')
  .delete(validateJoiRequest({ paramsSchema: categoryIdValidation }),deleteCategoryById);

categoryRouter.route('*').all(methodNotAllowed);

export default categoryRouter;
