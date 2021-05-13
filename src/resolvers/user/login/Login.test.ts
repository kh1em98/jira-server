import { Connection } from 'typeorm';
import faker from 'faker';

import { testConnectionDB } from '../../../test-utils/testConn';
import { gCall } from '../../../test-utils/gCall';
import { redis } from '../../../redis';
import { User } from '../../../entity/User';
import { invalidEmailInputTest } from '../../../shared/test/InvalidInput';

let conn: Connection;
let testUser: User;

beforeAll(async () => {
	conn = await testConnectionDB();

	if (redis.status === 'end') {
		await redis.connect();
	}

	testUser = await User.create({
		fullName: faker.name.firstName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
	}).save();
});

afterAll(async () => {
	await redis.disconnect();
	await conn.close();
});

const loginMutation = `
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			id
		}
	}
`;

describe('Login', () => {
	invalidEmailInputTest({
		source: loginMutation,
		otherFieldsInput: {
			password: faker.internet.password(),
		},
	});

	test('enter not exist email', async () => {
		const notExistEmail = `abc${testUser.email}`;
		const response = await gCall({
			source: loginMutation,
			variableValues: {
				input: {
					email: notExistEmail,
					password: testUser.password,
				},
			},
		});

		expect(response).toMatchObject({
			data: {
				login: null,
			},
		});
	});

	test('enter wrong password', async () => {
		const wrongPassword = `${testUser.password}123`;
		const response = await gCall({
			source: loginMutation,
			variableValues: {
				input: {
					email: testUser.email,
					password: wrongPassword,
				},
			},
		});

		expect(response).toMatchObject({
			data: {
				login: null,
			},
		});
	});

	test('enter correct credentials', async () => {
		const response = await gCall({
			source: loginMutation,
			variableValues: {
				input: {
					email: testUser.email,
					password: testUser.password,
				},
			},
		});

		expect(response).toMatchObject({
			data: {
				login: {
					id: testUser.id,
				},
			},
		});
	});
});
