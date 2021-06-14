import makeUser from '../../entities/user/index';

export default function makeLogin({ usersDb, hash }) {
  return async function login(credentials) {
    const { email, password } = credentials;
    const exists = await usersDb.findByEmail(email);

    if (!exists) {
      throw new Error('Wrong Email');
    }

    return usersDb.insert({
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      password: await hash(user.getPassword()),
      email: user.getEmail(),
    });
  };
}
