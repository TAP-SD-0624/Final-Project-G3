import { DataTypes, Model } from 'sequelize';
import UserRole from '../../enums/userRoles';
import sequelize from '../../database';

class User extends Model {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  mobileNumber?: string;
  password!: string;
  role!: UserRole;
  balance!: number;
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
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidPhoneNumber(value : string) {
          if (!/^\+\d{10,15}$/.test(value)) {
            throw new Error(
              `Phone number must start with a "+" sign and be followed by 10 to 15 digits.
               Ensure the number is in the correct international format.`);
          }
        },
        len: {
          args: [12, 16], // 1 + 11 digits = 12, 1 + 15 digits = 16
          msg: 'Mobile number should be between 12 and 16 characters long (including "+").',
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
    balance: {
      type: DataTypes.FLOAT(10, 2),
      defaultValue: 20000,
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
