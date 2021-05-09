import { Connection } from 'typeorm';
import { testConnectionDB } from '../../../test-utils/testConn';

let conn: Connection;

beforeAll(async () => {
	conn = await testConnectionDB();
});

afterAll(() => {
	conn.close();
});

describe('Register', () => {
	it('create user', () => {});
});
