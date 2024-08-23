import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import User from '../models/User';
import Product from '../models/Product';
import errorHandler from '../utils/errorHandler';
import APIError from '../utils/APIError';

const getUserReviews = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const searchedUser = await User.findByPk(id);

    if (!searchedUser) {
      return next(new APIError('userN not found.', 404));
    }

    const { user } = (req as any);
    console.log( `${id  }  ------  ${  user.id}`);
    console.log( `${searchedUser.role  }  ------  ${  user.role}`);

    if (  id !== user.id || user.role !== 'admin'){
      return next(new APIError('no access', 404));
    }

    const reviews = await Review.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Product,
          attributes: ['name' , 'rating'],
        },
      ],
    });

    res.status(200).json({
      status: 'success',
      reviews: reviews.length > 0 ? reviews : 'User has no reviews yet.',
    });
  },
);

export { getUserReviews };
