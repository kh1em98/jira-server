import { Connection } from 'typeorm';
import faker from 'faker';

import { User } from '../../../entity/User';
import { gCall } from '../../../test-utils/gCall';
import { testConnectionDB } from '../../../test-utils/testConn';
import { redis } from '../../../redis';

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
    username
  }
}
`;

describe('Me', () => {
	it('get user', async () => {
		const user = await User.create({
			fullName: faker.name.firstName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			username: faker.internet.userName(),
		}).save();

		const response = await gCall({
			source: meQuery,
			userId: user.id,
		});

		expect(response).toMatchObject({
			data: {
				me: {
					id: user.id,
					fullName: user.fullName,
					email: user.email,
					username: user.username,
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
