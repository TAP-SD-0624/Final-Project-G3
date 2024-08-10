import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import APIError from '../utils/APIError';

const validateJoiRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction):void =>  {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors: string = error.details.map((err) => err.message).join(', ');
      return next(new APIError(errors, 400));
    }
    next();
  };
};

export default validateJoiRequest;
