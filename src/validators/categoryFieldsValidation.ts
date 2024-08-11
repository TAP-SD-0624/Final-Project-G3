import Joi from 'joi';

const categoryValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(15)
    .required()
    .messages({
      'string.base': 'Name should be a type of text.',
      'string.empty': 'Name cannot be empty.',
      'string.max': 'Name should have a maximum length of {#limit}.',
      'any.required': 'Name is a required field.',
    }),

  description: Joi.string()
    .max(150)
    .required()
    .messages({
      'string.base': 'Description should be a type of text.',
      'string.empty': 'Description cannot be empty.',
      'string.max': 'Description should have a maximum length of {#limit}.',
      'any.required': 'Description is a required field.',
    }),
});

const categoryIdValidation = Joi.object({
  id: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.base': 'ID should be a type of string.',
      'string.guid': 'ID must be a valid UUID.',
      'any.required': 'ID is a required field.',
    }),
});

export  { categoryValidation , categoryIdValidation };
