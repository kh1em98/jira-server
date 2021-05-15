import { createConnection } from 'typeorm';

export const testConnectionDB = async (needDrop = false) => {
  return await createConnection({
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'khiem',
    password: 'khiem',
    database: 'social_test',
    synchronize: needDrop,
    dropSchema: needDrop,
    entities: ['./src/entity/*.*'],
  });
};
