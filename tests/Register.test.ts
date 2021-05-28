import { invalidEmailInputTest } from '../src/shared/test/InvalidInput';
import { Connection } from 'typeorm';
import faker from 'faker';

import { testConnectionDB } from './test-utils/testConn';
import { gCall } from './test-utils/gCall';
import { redis } from '../src/redis';
import { User } from '../src/entity/User';

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

const registerMutation = `
	mutation Register($input: RegisterInput!) {
		register(input: $input) {
			id
			firstName
      lastName
			email
		}
	}
`;

describe('Register', () => {
  invalidEmailInputTest({
    source: registerMutation,
    otherFieldsInput: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(),
    },
  });

  it('create user', async () => {
    const fakerUser = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: fakerUser,
      },
    });

    expect(response).toMatchObject({
      data: {
        register: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: fakerUser.email,
        },
      },
    });

    const dbUser = await User.findOne({ where: { email: fakerUser.email } });

    expect(dbUser).toBeDefined();
    expect(dbUser?.verified).toBeFalsy();
  });
});
