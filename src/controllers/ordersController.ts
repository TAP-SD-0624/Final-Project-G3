import errorHandler from '../utils/errorHandler';
import { Request, Response, NextFunction } from 'express';

const createOrder = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {

  },
);

export { createOrder };
