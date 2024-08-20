import User from '../models/User';
import APIError from '../utils/APIError';

const checkIfEmailExists = async(email: string): Promise<boolean> => {
  const existingUser = await User.findOne({ where: { email } });
  return existingUser !== null;
};

const checkIfUserExists = async(email: string): Promise<User> => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new APIError('User not found', 404);
  }
  return user;
};

export { checkIfEmailExists, checkIfUserExists };
