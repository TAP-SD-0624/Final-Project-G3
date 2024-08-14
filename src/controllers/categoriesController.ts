import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import errorHandler from '../utils/errorHandler';
import   checkIfCategoryExists   from '../services/categoryService';
import APIError from '../utils/APIError';

const createNewCategory = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, description } = req.body;

    // Check if the category already exists
    const categoryExists = await checkIfCategoryExists(name);

    if (categoryExists) {
      return next(new APIError('Category name already exists', 400));
    }

    // Create the new category
    const category = await Category.create({ name, description });

    res.status(201).json({ status: 'success',category });
  },
);

const getAllCategories = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.findAll();
    res.status(200).json({
      status: 'success',
      categories: categories.length > 0 ? categories : 'No categories found.',
    });
  },
);

const getCategoryById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return next(new APIError('Category not found.', 404));
    }

    res.status(200).json({
      status: 'success',
      category });
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
    res.status(202).json({
      status: 'success',
    });
  },
);

const updateCategoryById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return next(new APIError('Category not found.', 404));
    }

    // Check if the updated name already exists, if name is provided
    if (name && name !== category.name) {
      const categoryExists = await checkIfCategoryExists(name);
      if (categoryExists) {
        return next(new APIError('Category name already exists', 400));
      }
    }

    // Update category with only the provided fields
    const updatedFields = { ...(name && { name }), ...(description && { description }) };
    await category.update(updatedFields);

    await category.save();
    res.status(200).json({
      status: 'success',
      category });
  },
);

export {
  createNewCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
