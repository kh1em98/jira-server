import { invalidEmailInputTest } from './../../../shared/test/InvalidInput';
import { Connection } from 'typeorm';
import faker from 'faker';

import { testConnectionDB } from '../../../test-utils/testConn';
import { gCall } from '../../../test-utils/gCall';
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
			email
		}
	}
`;

describe('Register', () => {
	invalidEmailInputTest({
		source: registerMutation,
		otherFieldsInput: {
			fullName: faker.name.firstName(),
			password: faker.internet.password(),
		},
	});

	it('create user', async () => {
		const fakerUser = {
			fullName: faker.name.firstName(),
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
					fullName: fakerUser.fullName,
					email: fakerUser.email,
				},
			},
		});

		const dbUser = await User.findOne({ where: { email: fakerUser.email } });

		expect(dbUser).toBeDefined();
		expect(dbUser?.verified).toBeFalsy();
	});
});
