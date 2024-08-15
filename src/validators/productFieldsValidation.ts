import Joi from 'joi';

const createProductValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Name should be a type of text.',
      'string.empty': 'Name cannot be empty.',
      'string.max': 'Name should have a maximum length of {#limit}.',
      'any.required': 'Name is a required field.',
    }),

  brief: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Brief should be a type of text.',
      'string.empty': 'Brief cannot be empty.',
      'string.max': 'Brief should have a maximum length of {#limit}.',
      'any.required': 'Brief is a required field.',
    }),

  description: Joi.string()
    .max(1000)
    .required()
    .messages({
      'string.base': 'Description should be a type of text.',
      'string.empty': 'Description cannot be empty.',
      'string.max': 'Description should have a maximum length of {#limit}.',
      'any.required': 'Description is a required field.',
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Stock should be a number.',
      'number.integer': 'Stock should be an integer.',
      'number.min': 'Stock should be a non-negative number.',
      'any.required': 'Stock is a required field.',
    }),

  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be greater than or equal to 0',
    'any.required': 'Price is required',
  }),
  discountRate: Joi.number().min(0).max(100).optional().messages({
    'number.base': 'Discount rate must be a number',
    'number.min': 'Discount rate cannot be less than 0',
    'number.max': 'Discount rate cannot be greater than 100',
  }),

  categoryName: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Category name should be a type of text.',
      'string.empty': 'Category name cannot be empty.',
      'string.max': 'Category name should have a maximum length of {#limit}.',
      'any.required': 'Category name is a required field.',
    }),

  brandName: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Brand name should be a type of text.',
      'string.empty': 'Brand name cannot be empty.',
      'string.max': 'Brand name should have a maximum length of {#limit}.',
      'any.required': 'Brand name is a required field.',
    }),
});

const productIdValidation = Joi.object({
  id: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.base': 'ID should be a type of string.',
      'string.guid': 'ID must be a valid UUID.',
      'any.required': 'ID is a required field.',
    }),
});

const updateProductValidation = Joi.object({
  name: Joi.string().min(3).max(255).optional().messages({
    'string.base': 'Product name must be a string',
    'string.empty': 'Product name cannot be empty',
  }),
  brief: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Brief can have a maximum of 500 characters',
  }),
  description: Joi.string().min(10).optional().messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description cannot be empty',
  }),
  stock: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock must be a number',
    'number.min': 'Stock cannot be negative',
  }),
  price: Joi.number().min(0).optional().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be greater than or equal to 0',
  }),
  discountRate: Joi.number().min(0).max(100).optional().messages({
    'number.base': 'Discount rate must be a number',
    'number.min': 'Discount rate cannot be less than 0',
    'number.max': 'Discount rate cannot be greater than 100',
  }),
  categoryName: Joi.string().optional().messages({
    'string.base': 'Category name must be a string',
    'string.empty': 'Category name cannot be empty',
  }),
  brandName: Joi.string().optional().messages({
    'string.base': 'Brand name must be a string',
    'string.empty': 'Brand name cannot be empty',
  }),
}).min(1).messages({
  'object.min': 'At least one field is required.',
});

export { createProductValidation, productIdValidation, updateProductValidation };
