import Product from '../models/Product';
import Review from '../models/Review';
import OrderItem from '../models/OrderItem';
import Category from '../models/Category';

// Function to check if a product exists by name or ID
const checkIfProductExists = async(
  options: { name?: string, id?: string },
): Promise<Product | null> => {
  const { name, id } = options;
  const query: { [key: string]: string } = {};

  if (name) {
    query.name = name;
  }

  if (id) {
    query.id = id;
  }

  return await Product.findOne({ where: query });
};

// Function to calculate the average rating
const calculateAverageRating = async(productId: string): Promise<number> => {
  const reviewCount = await Review.count({ where: { productId } });

  if (reviewCount === 0) {
    return 0;
  }

  const reviews = await Review.findAll({
    attributes: ['rating'],
    where: { productId },
  });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return reviewCount > 0 ? totalRating / reviewCount : 0;
};

// Check if product is related to any order items
const isProductInAnyOrderItems = async(productId: string): Promise<boolean> => {
  const orderItemCount = await OrderItem.count({ where: { productId } });
  return orderItemCount > 0;
};

// Utility function to create a product response object
const createProductResponse = ({
  product,
  averageRating,
  categoryName,
  brandName,
}: {
  product: Product;
  averageRating: number;
  categoryName: string;
  brandName: string;
}) => {
  return {
    isLimitedEdition: product.isLimitedEdition,
    id: product.id,
    name: product.name,
    brief: product.brief,
    description: product.description,
    stock: product.stock,
    price: product.price,
    discountRate: product.discountRate,
    rating: averageRating,
    brandName,
    categoryName,
  };
};

export {
  checkIfProductExists,
  calculateAverageRating,
  createProductResponse,
  isProductInAnyOrderItems };
