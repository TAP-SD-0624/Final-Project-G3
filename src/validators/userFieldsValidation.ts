import Joi from 'joi';

// Validation schema for user ID
const userIdValidation = Joi.object({
  id: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.base': 'ID should be a type of string.',
      'string.guid': 'ID must be a valid UUID.',
      'any.required': 'ID is a required field.',
    }),
});

// Validation schema for updating a user
const updateUserValidation = Joi.object({
  firstName: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.base': 'First Name should be a type of text.',
      'string.max': 'First Name should have a maximum length of {#limit}.',
    }),

  lastName: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.base': 'Last Name should be a type of text.',
      'string.max': 'Last Name should have a maximum length of {#limit}.',
    }),

  dateOfBirth: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': 'Date of Birth should be a valid date.',
    }),
}).min(1).messages({
  'object.min': 'At least one field is required for update.',
});

const updateUserRoleValidation = Joi.object({
  role: Joi.string()
    .valid('user', 'admin')
    .required()
    .messages({
      'string.base': 'Role should be a type of text.',
      'any.only': 'Role must be one of [user, admin].',
      'any.required': 'Role is a required field.',
    }),
});

export { userIdValidation, updateUserValidation , updateUserRoleValidation };
