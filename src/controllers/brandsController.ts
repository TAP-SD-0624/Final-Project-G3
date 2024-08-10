import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import Brand from '../models/Brand';

const createBrand = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    
  }
);

export { createBrand };
