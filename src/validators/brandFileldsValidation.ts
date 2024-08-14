import Joi from 'joi';

const createBrandValidation = Joi.object({
  name: Joi.string()
    .required()
    .min(3)
    .max(20)
    .messages({
      'any.required': 'brand name is required',
      'string.min': 'Brand name must be at least 3 characters long',
      'string.max': 'Brand name must be less than or equal to 20 characters long',
    }),
});
const brandIdValidation = Joi.object({
  id: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.guid': 'ID must be a valid UUID.',
      'any.required': 'Brand ID is required',
      'string.base': 'Brand ID must be a string',
    }),
});
const updateBrandValidation = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Brand name is required',
      'string.base': 'Brand name must be a string',
    }),
});
export { createBrandValidation, brandIdValidation, updateBrandValidation };
