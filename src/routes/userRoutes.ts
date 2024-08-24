import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  changeUserRole,
  updateUserPassword,
} from '../controllers/usersController';
import { methodNotAllowed } from '../controllers/suspicionController';
import {
  userIdValidation,
  updateUserValidation,
  updateUserRoleValidation,
  updateUserPasswordValidation,
} from '../validators/userFieldsValidation';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';

const userRouter = Router();

userRouter.route('/')
  .get(
    authMiddleware,
    adminMiddleware,
    getAllUsers,
  );

userRouter.route('/:id')
  .get(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: userIdValidation }),
    getUserById,
  )
  .put(
    authMiddleware,
    validateJoiRequest({ paramsSchema: userIdValidation }),
    validateJoiRequest({ bodySchema: updateUserValidation }),
    updateUserById,
  )
  .delete(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: userIdValidation }),
    deleteUserById,
  );

userRouter.route('/:id/reviews')
  .get(
    authMiddleware,
    validateJoiRequest({ paramsSchema: userIdValidation }),
    getUserReviews,
  );

userRouter.route('/:id/role')
  .put(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: userIdValidation }), // Validate user ID
    validateJoiRequest({ bodySchema: updateUserRoleValidation }), // Validate role
    changeUserRole,
  );

userRouter.route('/:id/password')
  .put(
    authMiddleware,
    validateJoiRequest({ bodySchema: updateUserPasswordValidation }),
    updateUserPassword,
  );

userRouter.route('*').all(methodNotAllowed);

export default userRouter;
