import { Request, Response, NextFunction } from 'express';
import errorHandler from '../utils/errorHandler';
import APIError from '../utils/APIError';
import User from '../models/User';
import {
  checkIfUserExists,
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
    const user = await checkIfUserExists({ id });

    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    // Get the authenticated user from the JWT token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authenticatedUser = (req as any).user;

    if (authenticatedUser.role !== 'admin'){
      if (authenticatedUser.id !== user.id){
        return next(new APIError('Unauthorized to update user profile.', 403));
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

    await user.destroy();
    res.status(204).json({ status: 'no content' });
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
