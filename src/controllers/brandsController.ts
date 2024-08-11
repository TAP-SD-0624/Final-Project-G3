import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import Brand from '../models/Brand';
import APIError from '../utils/APIError';
import checkIfBrandExists from '../services/brandService';
import { Identifier } from 'sequelize';

const createNewBrand = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
  async (req: Request, res: Response, next: NextFunction) => {
    const brands = await Brand.findAll({
      attributes: ['id', 'name'],
    });
    res.status(201).json({
      brands,
    });
  },
);

const getBrandById = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const brandId = req.params.id;
    const brand = await Brand.findOne({
      where: { id: brandId },
      attributes: ['id', 'name']
    }); 
    res.status(201).json(brand);
  },
);

export { createNewBrand, getAllBrands, getBrandById };
