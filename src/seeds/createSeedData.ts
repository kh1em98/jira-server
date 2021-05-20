import { Task } from '../entity/Task';
import { createConnection, getConnection, getRepository } from 'typeorm';
import faker from 'faker';
import bcrypt from 'bcrypt';

import { User } from '../entity/User';
import {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
} from '../config/vars';

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const connectDb = async () => {
  return createConnection({
    name: 'default',
    type: 'postgres',
    host: DB_HOST || '127.0.0.1',
    port: DB_PORT ? parseInt(DB_PORT, 10) : 5432,
    username: DB_USERNAME || 'khiem',
    password: DB_PASSWORD || 'khiem',
    database: DB_NAME,
    synchronize: true,
    logging: true,
    dropSchema: true,
    entities: ['src/entity/*.*'],
  });
};

const createSeedUsers = async () => {
  const password = '123456';
  for (let i = 0; i < 10; i++) {
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName: faker.name.firstName() + ' ' + faker.name.lastName(),
      email: faker.internet.email(),
      password: hashPassword,
    }).save();
  }
};

const createSeedTasks = async () => {
  for (let i = 0; i < 100; i++) {
    const userId = getRandomArbitrary(1, 11);

    await Task.create({
      title: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      userId,
    }).save();
  }
};

const createSeedUser = async () => {
  try {
    await connectDb();
    await createSeedUsers();
    await createSeedTasks();
  } catch (error) {
    console.log('create seed user error : ', error);
  }
};

createSeedUser();
