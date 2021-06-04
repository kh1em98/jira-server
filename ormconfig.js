const dotenv = require('dotenv');
dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

module.exports = {
  name: 'default',
  type: 'postgres',
  host: DB_HOST || '127.0.0.1',
  port: DB_PORT ? parseInt(DB_PORT, 10) : 5432,
  username: DB_USERNAME || 'khiem',
  password: DB_PASSWORD || 'khiem',
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/database/migrations/**/*.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};
