import { NextFunction, Request, Response } from 'express';
import APIError from '../utils/APIError';

const errorController = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof APIError) {
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: err.message,
      stack: err.stack,
    });
  }
};

export default errorController;
