import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import APIError from '../utils/APIError';

const validateJoiRequest = (options: {
  bodySchema?: Joi.ObjectSchema, paramsSchema?: Joi.ObjectSchema
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { bodySchema, paramsSchema } = options;

    // Validate request body if bodySchema is provided
    if (bodySchema && req.body) {
      const { error } = bodySchema.validate(req.body, { abortEarly: false });
      if (error) {
        const errors: string = error.details.map((err) => err.message).join(', ');
        return next(new APIError(errors, 400));
      }
    }

    // Validate request params if paramsSchema is provided
    if (paramsSchema && req.params) {
      const { error } = paramsSchema.validate(req.params, { abortEarly: false });
      if (error) {
        const errors: string = error.details.map((err) => err.message).join(', ');
        return next(new APIError(errors, 400));
      }
    }

    next();
  };
};
export default validateJoiRequest;
