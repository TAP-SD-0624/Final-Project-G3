import Joi from 'joi';

// Validation schema for user ID
const wishlistIdValidation = Joi.object({
  id: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.base': 'ID should be a type of string.',
      'string.guid': 'ID must be a valid UUID.',
      'any.required': 'ID is a required field.',
    }),
});

const wishListProductIdValidation = Joi.object({
  id: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.guid': 'ID must be a valid UUID.',
      'any.required': 'product ID is required',
      'string.base': 'product ID must be a string',
    }),
});

export { wishlistIdValidation , wishListProductIdValidation };
