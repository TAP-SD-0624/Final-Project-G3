import Joi from "joi";

const addBrandValidation = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'brand name is required',
    }),
});
export {  addBrandValidation };
