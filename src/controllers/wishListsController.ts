import { NextFunction, Request, Response } from 'express';
import Product from '../db-files/models/Product';
import WishList from '../db-files/models/Wishlist';
import WishListItem from '../db-files/models/WishlistItem';
import errorHandler from '../utils/errorHandler';
import { oneProductService } from '../services/productService';
import {  getWishlistByUserId } from '../services/wishlistService';

import APIError from '../utils/APIError';

const toggleProductToUserWishlist = errorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = (req as any);
    const { productId } = req.body;

    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    // Fetch product with necessary includes
    const product = await oneProductService({ where: { id: productId } });

    if (!product) {
      return next(new APIError('Product not found', 404));
    }

    // Find or create wishlist for the user
    let wishlist: WishList | null = await getWishlistByUserId(user.id);
    if (!wishlist) {
      wishlist = await WishList.create({ userId: user.id });
    }

    // Check if the product is already in the wishlist
    const isInWishlist = await WishListItem.findOne({
      where: {
        productId: product.id,
        wishListId: wishlist.id,
      },
    });

    if (isInWishlist) {
      // Remove product from wishlist
      await WishListItem.destroy({
        where: {
          productId: product.id,
          wishListId: wishlist.id,
        },
      });
      res.status(200).json({ status: 'success', message: 'Product removed from wishlist' });
    } else {
      // Add product to wishlist
      await WishListItem.create({
        productId: product.id,
        wishListId: wishlist.id,
      });
      res.status(200).json({ status: 'success', message: 'Product added to wishlist' });
    }
  },
);


const getUserWishList = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = (req as any);

    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    // Fetch the wishlist for the user
    const wishlist = await getWishlistByUserId(user.id);

    if (!wishlist) {
      return next(new APIError('Wishlist not found.', 404));
    }

    // Fetch wishlist items for the given wishlistId
    const wishListItems = await WishListItem.findAll({
      where: { wishListId: wishlist.id },
      attributes: ['productId'], // Only fetch productId to reduce overhead
    });

    if (!wishListItems.length) {
      return next(new APIError('wishlist Items not found', 404));
    }

    // Extract product IDs from the wishlist items
    const productIds = wishListItems.map((item) => item.productId);

    // Fetch products related to these product IDs
    const products = await Product.findAll({
      where: {
        id: productIds,
      },
    });

    res.status(200).json({ status: 'success', products });
  },

);

export { toggleProductToUserWishlist , getUserWishList };
