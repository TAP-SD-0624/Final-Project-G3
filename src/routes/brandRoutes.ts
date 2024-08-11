import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { createNewBrand } from '../controllers/brandsController';

const brandRouter = Router();

brandRouter.route('/createBrand').post(authMiddleware,adminMiddleware, createNewBrand);

export default brandRouter;
