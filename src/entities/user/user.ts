export default function buildMakeUser({ constant }) {
  return function makeUser({
    id = '',
    firstName = '',
    lastName = '',
    email = '',
    isFacebookAccount = false,
    password = '',
    image = constant.DEFAULT_AVATAR,
    emailVerified = false,
    role = constant.Role.User,
    createdAt = Date.now(),
  } = {}) {
    if (!firstName || !lastName) {
      throw new Error('Must have both first name and last name');
    }

    if (!email) {
      throw new Error('must have email');
    }

    if (!password && isFacebookAccount) {
      throw new Error('must have password');
    }

    return Object.freeze({
      getId: () => id,
      getFirstName: () => firstName,
      getLastName: () => lastName,
      getCreatedAt: () => createdAt,
      getPassword: () => password,
      getEmail: () => email,
      getImage: () => image,
      getEmailVerified: () => emailVerified,
      getRole: () => role,
    });
  };
}
