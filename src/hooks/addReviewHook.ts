import Review from '../db-files/models/Review';
import Product from '../db-files/models/Product';
import { oneProductService } from '../services/productService';

const recalculateProductRatingHook = async(reviewId: string): Promise<void> => {
  const review = await Review.findByPk(reviewId, {
    include: [
      {
        model: Product,
        attributes: ['id'],
      },
    ],
  }) as Review & { productId: string };

  if (!review) {
    throw new Error('Review not found');
  }

  // Extract productId from the review
  const { productId } = review;

  // Fetch the product using the productId
  const product = await oneProductService({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // Get all reviews for the product
  const reviews = await Review.findAll({
    where: { productId: product.id },
  });

  // Calculate average rating
  const ratings = reviews.map((r) => r.rating);
  const averageRating = ratings.reduce((acc, current) => acc + current, 0) / ratings.length;

  // Update product rating
  product.rating = averageRating;
  await product.save();
};

export { recalculateProductRatingHook };
