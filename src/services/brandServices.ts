import Brand from "../models/Brand";

const checkIfBrandExists = async(name: string): Promise<boolean> => {
  const existingBrand = await Brand.findOne({ where: { name } });
  return existingBrand !== null;
};

export default checkIfBrandExists;