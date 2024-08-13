import Brand from '../models/Brand';

const checkIfBrandExists = async(
  options: { name?: string, id?: number },
): Promise<Brand|null> => {
  const { name, id } = options;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: { [key: string]: any } = {};

  if (name) {
    query.name = name;
  }

  if (id) {
    query.id = id;
  }

  const existingBrand = await Brand.findOne({ where: query });

  return existingBrand;
};

export default checkIfBrandExists;
