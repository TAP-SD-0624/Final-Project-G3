import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import errorHandler from '../utils/errorHandler';
import checkIfCategoryExists from '../services/categoryService';
import APIError from '../utils/APIError';

const createCategory = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, description } = req.body;

    // Check if the category already exists
    const categoryExists = await checkIfCategoryExists(name);

    if (categoryExists) {
      return next(new APIError('Category name already exists', 400));
    }

    // Create the new category
    const category = await Category.create({ name, description });

    res.status(201).json(category);
  },
);

const getAllCategories = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  },
);

const getCategoryById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return next(new APIError('Category not found.', 404));
    }

    res.status(200).json(category);
  },
);


const deleteCategoryById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return next(new APIError('Category not found.', 404));
    }

    await category.destroy();
    res.status(200).json(category);
  },
);

const updateCategory = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return next(new APIError('Category not found.', 404));
    }

    category.name = name;
    category.description = description;
    await category.save();
    res.status(200).json(category);
  },
);

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategoryById,
};
