import { Request, Response, NextFunction } from 'express';
import errorHandler from '../utils/errorHandler';
import APIError from '../utils/APIError';
import User from '../models/User';
import {
  checkIfUserExists,
  checkIfEmailExists,
  userResponseFormatter,
} from '../services/userService';

// create user only by sign up

// Get all users
const getAllUsers = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
      const users = await User.findAll();
      const formattedUsers = users.map(userResponseFormatter);
      res.status(200).json({
        status: 'success',
        users: formattedUsers.length > 0 ? formattedUsers : 'No users found.',
      });
  },
);

// Get a user by ID
const getUserById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await checkIfUserExists({ id });

    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    const formattedUser = userResponseFormatter(user);
    res.status(200).json({ status: 'success', user: formattedUser });
  },
);

// Update a user by ID
const updateUserById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { email } = req.body;

    // only admin or the actual user 
    const user = await checkIfUserExists({ id });

    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    // don't change email 
    if (email) {
      if (await checkIfEmailExists(email)) {
        return next(new APIError('Email already in use', 400));
      }
    }

    await user.update(req.body);
    await user.save();

    res.status(200).json({ status: 'success', user: userResponseFormatter(user) });
  },
);

// Delete a user by ID
const deleteUserById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await checkIfUserExists({ id });

    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    // reviews & wishlists & orders => delete ..
    await user.destroy();
    //status
    res.status(202).json({ status: 'success' });
  },
);

const changeUserRole = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { role } = req.body;

    // Check if the user exists
    const user = await checkIfUserExists({ id });
    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    // Update the user's role
    user.role = role;
    await user.save();

    // Send the updated user response
    const formattedUser = userResponseFormatter(user);
    res.status(200).json({ status: 'success', user: formattedUser });
  },
);

export {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  changeUserRole,
};
