import Redis from 'ioredis';
import { REDIS_PORT, REDIS_HOST } from './config/vars';

const redisPort = REDIS_PORT || '6379';
const redisHost = REDIS_HOST || '127.0.0.1';

export const redis = new Redis({
  port: parseInt(redisPort, 10),
  host: redisHost,
});
