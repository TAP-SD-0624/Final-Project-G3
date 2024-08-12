import Category from '../models/Category';

const checkIfCategoryExists = async(name: string): Promise<boolean> => {
  const category = await Category.findOne({ where: { name } });
  return category !== null;
};

export default checkIfCategoryExists ;
