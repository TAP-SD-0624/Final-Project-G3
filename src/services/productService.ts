import Product from '../models/Product';
import Review from '../models/Review';

const checkIfProductExists = async(
  options: { name?: string, id?: string },
): Promise<boolean> => {
  const { name, id } = options;
  const query: { [key: string]: string } = {};

  if (name) {
    query.name = name;
  }

  if (id) {
    query.id = id;
  }

  const product = await Product.findOne({ where: query });
  return product !== null;
};

// Function to calculate the average rating
const calculateAverageRating = async(productId: string): Promise<number> => {
  // Count the number of reviews for the given product
  const reviewCount = await Review.count({
    where: { productId },
  });

  // Check if there are no reviews
  if (reviewCount === 0) {
    return 0;
  };

  // Fetch all reviews for the given product
  const reviews = await Review.findAll({
    attributes: ['rating'], // Only select the rating field to optimize performance
    where: { productId },
  });

  // Calculate the average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

  // Return the calculated average rating
  return averageRating;
};

export { checkIfProductExists,calculateAverageRating };
