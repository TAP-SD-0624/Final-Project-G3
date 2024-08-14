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
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.base': 'Name should be a type of text.',
      'string.max': 'Name should have a maximum length of {#limit}.',
    }),

  brief: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.base': 'Brief should be a type of text.',
      'string.max': 'Brief should have a maximum length of {#limit}.',
    }),

  description: Joi.string()
    .max(1000)
    .messages({
      'string.base': 'Description should be a type of text.',
      'string.max': 'Description should have a maximum length of {#limit}.',
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Stock should be a number.',
      'number.integer': 'Stock should be an integer.',
      'number.min': 'Stock should be a non-negative number.',
    }),
}).min(1).messages({
  'object.min': 'At least one field is required.',
});

export { createProductValidation, productIdValidation, updateProductValidation };
