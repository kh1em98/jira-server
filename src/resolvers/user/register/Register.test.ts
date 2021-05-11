import { Connection } from 'typeorm';
import faker from 'faker';

import { testConnectionDB } from '../../../test-utils/testConn';
import { gCall } from '../../../utils/gCall';
import { redis } from '../../../redis';
import { User } from '../../../entity/User';

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
			fullName
			username
			email
		}
	}
`;

describe('Register', () => {
	it('create user', async () => {
		const fakerUser = {
			fullName: faker.name.firstName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			username: faker.internet.userName(),
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
					fullName: fakerUser.fullName,
					email: fakerUser.email,
					username: fakerUser.username,
				},
			},
		});

		const dbUser = await User.findOne({ where: { email: fakerUser.email } });

		expect(dbUser).toBeDefined();
		expect(dbUser?.verified).toBeFalsy();
	});
});
