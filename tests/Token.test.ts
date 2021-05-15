import { JwtMaker } from '../src/token/JwtMaker';
const SECRET_KEY = 'sPzHyQyunIhsNfC9ULkKIfFBpqmh92F4';
const BAD_KEY = '123456';
const DURATION_MS = 60 * 60 * 1000;

let token: string;

describe('token', () => {
  test('throw error if secret key is short', () => {
    try {
      const jwtMaker = new JwtMaker(BAD_KEY);
    } catch (error) {
      expect(error.message).toEqual('Secret key is invalid');
    }
  });

  test('return token when call createToken', () => {
    const jwtMaker = new JwtMaker(SECRET_KEY);

    token = jwtMaker.createToken(1, DURATION_MS);

    expect(token).toBeDefined();
  });

  test('return user id when verify valid token', async () => {
    const jwtMaker = new JwtMaker(SECRET_KEY);

    const decoded = await jwtMaker.verifyToken(token);
    console.log('decoded : ', decoded);

    expect(decoded).not.toBeNull();
  });
});
