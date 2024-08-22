import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import authRouter from './routes/authRoutes';
import categoryRouter from './routes/categoryRoutes';
import brandRouter from './routes/brandRoutes';
import productsRouter from './routes/productRoutes';
import reviewsRouter from './routes/reviewRoutes';
import errorController from './controllers/errorController';
import rateLimit from 'express-rate-limit';
import {
  endpointNotImplemented,
  tooManyRequests,
} from './controllers/suspicionController';
import cookieParser from 'cookie-parser';
import { setupSwagger } from './api-documentation/swagger';

const app: Express = express();

// to log any http request to the server
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // For parsing cookies

// limit the number of requests sent to the server to under 500 requests per minute.
app.use(
  rateLimit({
    windowMs: 1000 * 60, // time in ms
    limit: 500,
    handler: tooManyRequests,
  }),
);

// Setup Swagger
setupSwagger(app);

// authentication routes
app.use('/api/auth', authRouter);
// brands routes
app.use('/api/brands', brandRouter);
// categories routes
app.use('/api/categories', categoryRouter);
// products routes
app.use('/api/products', productsRouter);
// reviews routes
app.use('/api/reviews', reviewsRouter);

// whenever a user sends a request to an unimplemented endpoint,
// they will get a 404 status code response
app.route('*').all(endpointNotImplemented);

// pass errors to the global error controller
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorController(err, req, res, next);
});

export default app;
