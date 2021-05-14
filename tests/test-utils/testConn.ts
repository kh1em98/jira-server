import { createConnection } from 'typeorm';

export const testConnectionDB = async (needDrop = false) => {
  return await createConnection({
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'typegraphql-example-test',
    synchronize: needDrop,
    dropSchema: needDrop,
    entities: ['./src/entity/*.*'],
  });
};
