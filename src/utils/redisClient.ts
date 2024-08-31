import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379', // Adjust the URL as needed
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

const connectRedis = async() => {
  await redisClient.connect();
};

const disconnectRedis = async() => {
  await redisClient.quit();
};

export { redisClient, connectRedis, disconnectRedis };
