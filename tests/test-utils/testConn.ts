import { DB_HOST, DB_PORT } from './../../src/config/vars';
import { createConnection } from 'typeorm';
import { DB_NAME, DB_PASSWORD, DB_TEST_NAME } from '../../src/config/vars';

export const testConnectionDB = async (needDrop = false) => {
  return await createConnection({
    name: 'default',
    type: 'postgres',
    host: DB_HOST || '127.0.0.1',
    port: DB_PORT ? parseInt(DB_PORT, 10) : 5432,
    username: DB_NAME,
    password: DB_PASSWORD,
    database: DB_TEST_NAME,
    synchronize: needDrop,
    dropSchema: needDrop,
    entities: ['./src/entity/*.*'],
  });
};
