import Category from '../models/Category';
import APIError from '../utils/APIError';

const checkIfCategoryExists = async(name: string): Promise<Category | null> => {
  const category = await Category.findOne({ where: { name } });
  if (category) {
    throw new APIError('Category name already exists', 400);
  }
  return category;
};

export default checkIfCategoryExists ;
