import makeUser from '../../entities/user/index';

export default function makeAddUser({ usersDb, hash }) {
  return async function addUser(userInfo) {
    const user = makeUser(userInfo);

    const exists = await usersDb.findByEmail({ email: user.getEmail() });

    if (exists) {
      return exists;
    }

    return usersDb.insert({
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      password: await hash(user.getPassword()),
      email: user.getEmail(),
    });
  };
}
