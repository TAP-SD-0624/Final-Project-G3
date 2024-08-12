import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import Brand from '../models/Brand';
import APIError from '../utils/APIError';
import checkIfBrandExists from '../services/brandService';

const createNewBrand = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const brandName = req.body.name;
    if (await checkIfBrandExists(brandName)) {
      return next(new APIError('Brand already exist', 400));
    }
    await Brand.create({
      name: brandName,
    });
    res.status(201).json({
      message: 'Brand added successfully',
    });
  },
);
const getAllBrands = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const brands = await Brand.findAll({
      attributes: ['id', 'name'],
    });
    if (brands.length <= 0){
      res.status(200).send({
        message: 'No brands found',
      });
    }
    res.status(200).json({
      brands,
    });
  },
);

export { createNewBrand, getAllBrands };
