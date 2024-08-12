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
    if (brands.length <= 0) {
      res.status(200).send({
        message: 'No brands found',
      });
    } else {
      res.status(200).json({
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
    if (!brand){
      return next(new APIError('Brand doesn\'t exist', 404));
    }
    res.status(201).json(brand);
  },
);
const updateBrandById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id, name } = req.body;
    const brand = await Brand.findOne({
      where: { id },
    });
    if (!brand) {
      return next(new APIError('Brand not found', 404));
    }
    await Brand.update(
      { name },
      {
        where: { id },
        returning: true,
      },
    );
    const updatedBrand = await Brand.findOne({
      where: { id },
      attributes: ['id', 'name'],
    });
    res.status(200).json({
      message: 'Brand updated successfully',
      brand: updatedBrand,
    });
  },
);

const deleteBrandById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const brandId = req.params.id;
    const brand = await Brand.findOne({
      where: { id: brandId },
    });
    if (!brand) {
      return next(new APIError('Brand not found', 404));
    }
    await Brand.destroy({
      where: { id: brandId },
    });
    res.status(200).json({
      message: 'Brand deleted successfully',
    });
  },
);
export { createNewBrand, getAllBrands, getBrandById, updateBrandById, deleteBrandById };
