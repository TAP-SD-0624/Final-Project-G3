import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import errorHandler from '../utils/errorHandler';
import checkIfCategoryExists from '../services/categoryService';

const createCategory = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    // Check if the category already exists
    await checkIfCategoryExists(name);

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
      res.status(404).json({ message: 'Category not found.' });
      return;
    }

    res.status(200).json(category);
  },
);

export { createCategory , getCategoryById , getAllCategories };
