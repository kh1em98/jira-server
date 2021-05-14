import { Connection } from 'typeorm';
import faker from 'faker';

import { redis } from './../src/redis';
import { User } from '../src/entity/User';
import { gCall } from './test-utils/gCall';
import { testConnectionDB } from './test-utils/testConn';

let conn: Connection;
beforeAll(async () => {
  conn = await testConnectionDB();

  if (redis.status === 'end') {
    await redis.connect();
  }
});
afterAll(async () => {
  await redis.disconnect();
  await conn.close();
});

const meQuery = `
 {
  me {
    id
    fullName
    email
  }
}
`;

describe('Me', () => {
  it('get current user', async () => {
    const user = await User.create({
      fullName: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }).save();

    const response = await gCall({
      source: meQuery,
      sessionData: {
        userId: user.id,
      },
    });

    expect(response).toMatchObject({
      data: {
        me: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      },
    });
  });

  it('return null', async () => {
    const response = await gCall({
      source: meQuery,
    });

    expect(response).toMatchObject({
      data: {
        me: null,
      },
    });
  });
});
