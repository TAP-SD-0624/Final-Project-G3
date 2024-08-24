import { DataTypes, Model } from 'sequelize';
import UserRole from '../enums/userRoles';
import sequelize from '../database';

class User extends Model {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  dateOfBirth!: Date;
  mobileNumber?: string;
  password!: string;
  role!: UserRole;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Invalid email format',
        },
      },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'Mobile number should only contain numbers',
        },
        len: {
          args: [10, 15],
          msg: 'Mobile number should be between 10 and 15 digits long',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      defaultValue: 'user',
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    updatedAt: false,
    timestamps: true,
  },
);

export default User;
