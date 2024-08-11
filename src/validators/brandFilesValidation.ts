import Joi from 'joi';

const addBrandValidation = Joi.object({
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
const getBrandValidator = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': 'brand ID is required',
    }),
});
export { addBrandValidation, getBrandValidator };
