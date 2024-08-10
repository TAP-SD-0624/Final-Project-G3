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

export { createCategory };
