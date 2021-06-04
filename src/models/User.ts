import bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { Role, User } from '../entity/User';
import { EmailExistedError } from '../resolvers/user/register/Register.resolver';

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function isAdmin(user: User): boolean {
  return user.role === Role.Admin;
}

export const generateUserModel = (currentUser: User) => ({
  getAll: async () => {
    const allUsers = await User.find({});

    if (isAdmin(currentUser)) {
      return allUsers;
    } else {
      return allUsers.map((user) => {
        return omit(user, ['password']);
      });
    }
  },
  getById: async (id: number) => {
    if (id === currentUser.id) {
      return currentUser;
    }

    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (isAdmin(currentUser)) {
      return user;
    }

    return omit(user, ['password']);
  },

  getByEmail: async (email: string) => {
    if (currentUser.email === email) {
      return currentUser;
    }

    if (currentUser.role === Role.Admin) {
      return await User.findOne({
        where: {
          email,
        },
      });
    }

    return null;
  },
  create: async ({ firstName, lastName, email, password }: RegisterInput) => {
    const isEmailExisted = await User.findOne({ where: { email } });

    if (isEmailExisted) {
      return new EmailExistedError(`${email} has already been registered`);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    }).save();

    return user;
  },
  deleteById: async (id: number) => {
    if (!isAdmin) return false;

    await User.delete(id);
    return true;
  },
});
