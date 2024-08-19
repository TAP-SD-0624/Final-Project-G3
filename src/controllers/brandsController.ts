import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import Brand from '../models/Brand';
import APIError from '../utils/APIError';
import checkIfBrandExists from '../services/brandService';

const createNewBrand = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const brandName = req.body.name;
    if (await checkIfBrandExists({ name: brandName }) !== null) {
      return next(new APIError('Brand already exist', 400));
    }
    const brand = await Brand.create({
      name: brandName,
    });
    res.status(201).json({
      message: 'Brand added successfully',
      brand,
    });
  },
);

const getAllBrands = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const brands = await Brand.findAll({
      attributes: ['id', 'name'],
    });
    if (brands.length === 0) {
      res.status(200).send({
        message: 'No brands found',
      });
    } else {
      res.status(200).json({
        status: 'success',
        brands,
      });
    }
  },
);

const getBrandById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const brandId = req.params.id;
    const brand = await Brand.findOne({
      where: { id: brandId },
      attributes: ['id', 'name'],
    });
    if (!brand) {
      return next(new APIError('Brand doesn\'t exist', 404));
    }
    res.status(200).json({
      status: 'success',
      brand,
    });
  },
);
const updateBrandById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const { id } = req.params;
    const brand: Brand | null = await checkIfBrandExists({ id });
    if (brand === null) {
      return next(new APIError('Brand doesn\'t exist', 400));
    }
    brand.name = name;
    await brand.save();
    res.status(200).json({
      status: 'success',
      brand,
    });
  },
);

const deleteBrandById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const brandId = req.params.id;
    const brand: Brand | null = await checkIfBrandExists({ id: brandId });
    if (brand === null) {
      return next(new APIError('Brand doesn\'t exist', 400));
    }
    await Brand.destroy({
      where: { id: brandId },
    });
    res.sendStatus(204);
  },
);
export { createNewBrand, getAllBrands, getBrandById, updateBrandById, deleteBrandById };
