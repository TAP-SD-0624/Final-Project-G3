import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import Brand from '../db-files/models/Brand';
import APIError from '../utils/APIError';
import {
  checkIfBrandExists,
  createImageFileName,
  renameFile,
  removeFile,
  getTempName,
  updateImagePath,
} from '../services/brandService';
import isValidFileName from '../validators/fileNameValidator';
import path from 'path';

const createNewBrand = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const image = req.file as Express.Multer.File;
    const fileExtension = path.extname(image.originalname);
    const newBrandImagePath = createImageFileName(name, image);
    const tempName = getTempName(fileExtension);
    if (!isValidFileName(name)){
      removeFile(tempName);
      return next(new APIError('Invalid brand name', 400));
    }
    if (await checkIfBrandExists({ name }) !== null) {
      removeFile(tempName);
      return next(new APIError('Brand already exist', 400));
    }
    await Brand.create({
      name,
      imagePath: newBrandImagePath,
    });
    renameFile(tempName, newBrandImagePath);
    res.status(201).json({
      message: 'Brand added successfully',
    });
  },

);

const getAllBrands = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const brands = await Brand.findAll({
      attributes: ['id', 'name', 'imagePath'],
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
      attributes: ['id', 'name', 'imagePath'],
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
    const image = req.file as Express.Multer.File;
    const brand: Brand | null = await checkIfBrandExists({ id });
    if (name && !isValidFileName(name)){
      if (image){
        const fileExtension = path.extname(image.originalname);
        const tempName = getTempName(fileExtension);
        removeFile(tempName);
      }
      return next(new APIError('Invalid brand name', 400));
    }
    if (brand === null) {
      if (image){
        const fileExtension = path.extname(image.originalname);
        const tempName = getTempName(fileExtension);
        removeFile(tempName);
      }
      return next(new APIError('Brand doesn\'t exist', 400));
    }
    if (name) {
      brand.name = name;
      const newPath = updateImagePath(brand.imagePath,name);
      renameFile(brand.imagePath, newPath);
      brand.imagePath = newPath;
      await brand.save();
    }
    if (image) {
      const fileExtension = path.extname(image.originalname);
      const tempName = getTempName(fileExtension);
      const newBrandImagePath = createImageFileName(brand.name, image);

      removeFile(brand.imagePath);
      renameFile(tempName, newBrandImagePath);
      brand.imagePath = newBrandImagePath;
      await brand.save();
    }
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
    removeFile(brand.imagePath);
    await Brand.destroy({
      where: { id: brandId },
    });
    res.sendStatus(204);
  },
);
export { createNewBrand, getAllBrands, getBrandById, updateBrandById, deleteBrandById };
