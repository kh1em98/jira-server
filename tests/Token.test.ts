import { JwtMaker } from '../src/token/JwtMaker';
const SECRET_KEY = 'sPzHyQyunIhsNfC9ULkKIfFBpqmh92F4';
const BAD_KEY = '123456';

describe('token', () => {
  test('throw error if secret key is short', () => {
    try {
      const jwtMaker = new JwtMaker(BAD_KEY);
    } catch (error) {
      expect(error.message).toEqual('Secret key is invalid');
    }
  });
});
