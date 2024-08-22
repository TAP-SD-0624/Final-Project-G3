import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Brand from '../models/Brand';
import Category from '../models/Category';
import User from '../models/User';
import Product from '../models/Product';
import errorHandler from '../utils/errorHandler';
import { checkIfUserReviewOnProductExists , getReviewService } from '../services/reviewService';
import { oneProductService } from '../services/productService';
import { checkIfOwnerUserOrAdmin } from '../services/authService';
import APIError from '../utils/APIError';

// Create a new review

const createNewReview = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { rating, comment, productId } = req.body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = (req as any);
    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    // Fetch product with necessary includes
    const product = await oneProductService({
      where: { id: productId },
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Brand,
          attributes: ['name'],
        },
      ],
    });

    if (!product) {
      return next(new APIError('Product not found', 404));
    }

    // Check if review already exists for the user
    const existingReview =
    await checkIfUserReviewOnProductExists({ productId: product.id, userId: user.id });
    if (existingReview) {
      return next(new APIError('You already added a review for this product.', 400));
    }

    // Create new review
    const review = await Review.create({
      rating,
      comment,
      productId: product.id,
      userId: user.id,
    });

    res.status(200).json({
      status: 'success',
      review,
    });
  });

// Get a review by its ID
const getReviewById = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const review = await getReviewService({
      where: {
        id,
      },
      attributes: {
        exclude: ['userId', 'productId'],
      },
      include: [
        {
          model: User,
          attributes: ['firstName'],
        },
        {
          model: Product,
          attributes: ['name'],
        },
      ],
    });

    if (!review) {
      return next(new APIError('Review not found', 404));
    }

    res.status(200).json({
      status: 'success',
      review,
    });
  },
);

const updateReviewById = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const review = await getReviewService({
      where: {
        id,
      },
    });
    if (!review) {
      return next(new APIError('Review not found', 404));
    }
    //   const { user } = (req as any);

    // if ( await checkIfOwnerUserOrAdmin(review.User.id ,user.id ,user.role )){
    //     return next(new APIError('Forbidden: Access Denied ', 403));
    //   }
    await review.update(req.body);

    await review.save();
    res.status(200).json({
      status: 'success',
      review,
    });
  });

const deleteReviewById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const review = await getReviewService({
      where: { id },
      include: [
        {
          model: User,
          attributes: ['id'],
        },
      ],
    });
    if (!review){
      return next(new APIError('Review not found', 404));
    }
    //   const { user } = (req as any);

    // if ( await checkIfOwnerUserOrAdmin(review.User.id ,user.id ,user.role )){
    //     return next(new APIError('Forbidden: Access Denied ', 403));
    //   }
    await review.destroy();
    res.status(200).json({ status: 'no content' });
  },
);

export {
  createNewReview,
  getReviewById,
  deleteReviewById,
  updateReviewById,
};
