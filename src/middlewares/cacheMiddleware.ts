// src/middleware/cacheMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import redis from '../redisClient'; // Import the Redis client
import errorHandler from '../utils/errorHandler'; // Import the errorHandler

// Define the cache middleware with error handling
const cacheMiddleware = (cacheKey: string, duration: number) => 
  errorHandler(

    async(req: Request, res: Response, next: NextFunction): Promise<void> => {
      
      // Try to get the cached data
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        // If cached data exists, return it
          res.status(200).json(JSON.parse(cachedData));
      }

      // Override the `res.json` function to cache the response
      const originalJson = res.json.bind(res);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res.json = (body: any) => {
        redis.set(cacheKey, JSON.stringify(body), 'EX', duration);
        return originalJson(body);
      };

  });
};

export default cacheMiddleware;
