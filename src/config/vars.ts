import 'dotenv/config';

export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_NAME = process.env.DB_NAME;
export const DB_TEST_NAME = process.env.DB_TEST_NAME;

export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const PORT = process.env.PORT;

export const DOCKER_DEV_REDIS_HOST = process.env.DOCKER_DEV_REDIS_HOST;
export const DOCKER_DEV_DB_HOST = process.env.DOCKER_DEV_DB_HOST;

export const __prod__ = process.env.NODE_ENV === 'production';
