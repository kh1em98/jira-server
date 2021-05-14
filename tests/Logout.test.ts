import { Connection } from 'typeorm';
import { redis } from '../src/redis';
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

const logoutMutation = `
  mutation {
    logout
  }
`;

describe('Log out', () => {
  it('return true if user already logged in', async () => {
    const response = await gCall({
      source: logoutMutation,
      sessionData: {
        userId: 1,
      },
    });

    expect(response).toMatchObject({
      data: {
        logout: true,
      },
    });
  });

  it('return authentication error if user not login but try to logout', async () => {
    try {
      await gCall({
        source: logoutMutation,
      });
    } catch (error) {
      expect(error).toEqual('Not authenticated');
    }
  });
});
