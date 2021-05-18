import 'dotenv/config';

import { DB_HOST, DB_PORT } from './../../src/config/vars';
import { createConnection } from 'typeorm';
import { DB_PASSWORD, DB_TEST_NAME, DB_USERNAME } from '../../src/config/vars';

export const testConnectionDB = async (needDrop = false) => {
  console.log({ DB_PASSWORD, DB_TEST_NAME, DB_USERNAME });

  return await createConnection({
    name: 'default',
    type: 'postgres',
    host: DB_HOST || '127.0.0.1',
    port: DB_PORT ? parseInt(DB_PORT, 10) : 5432,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_TEST_NAME,
    synchronize: needDrop,
    dropSchema: needDrop,
    entities: ['./src/entity/*.*'],
  });
};
