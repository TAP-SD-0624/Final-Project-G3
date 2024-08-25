import express, { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import { createOrderValidation } from '../validators/orderFieldsValidation';
import { createOrder, getAllOrders } from '../controllers/ordersController';
import { methodNotAllowed } from '../controllers/suspicionController';

const orderRouter: Router = express.Router();

orderRouter.route('/')
  .post(
    authMiddleware,
    validateJoiRequest({ bodySchema: createOrderValidation }),
    createOrder,
  ).get(
    authMiddleware,
    getAllOrders,
  );

orderRouter.route('*').all(methodNotAllowed);

export default orderRouter;
