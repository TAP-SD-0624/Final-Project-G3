import User from '../models/User';

const checkIfEmailExists = async(email: string): Promise<boolean> => {
  const existingUser = await User.findOne({ where: { email } });
  return existingUser !== null;
};

const checkIfUserExists = async(email: string): Promise<User | null> => {
  const user = await User.findOne({ where: { email } });
  return user;
};

export { checkIfEmailExists, checkIfUserExists };
