import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import Brand from '../models/Brand';
import APIError from '../utils/APIError';

const createNewBrand = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const brandName = req.body.name;
    if(!brandName){
        return next(new APIError('please include the brand name', 400));
    }
    await Brand.create({
        name:brandName
      });
      res.status(201).json({
        message: 'Brand added successfully',
      });
  }
);

export { createNewBrand };
