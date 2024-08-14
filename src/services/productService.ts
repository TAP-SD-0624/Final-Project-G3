import Product from '../models/Product';

const getProductService = async(
  options: { id?: string },
): Promise<Product | null> => {
  const { id } = options;
  const query: { [key: string]: string } = {};
  if (id){
    query.id = id;
  }
  const product = await Product.findOne({
    where: query,
  });
  return product;
};

export { getProductService };
