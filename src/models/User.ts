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

export function isAdmin(user: User | undefined): boolean {
  return user?.role === Role.Admin;
}

export const generateUserModel = (currentUser: User | undefined) => ({
  getAll: async () => {
    if (!currentUser) return [];
    const allUsers = await User.find({});
    return allUsers;
  },
  getById: async (id: number) => {
    console.log('current user : ', currentUser);
    if (id === currentUser?.id) {
      return currentUser;
    }

    if (isAdmin(currentUser)) {
      return await User.findOne({
        where: {
          id,
        },
      });
    }

    return null;
  },

  getByEmail: async (email: string) => {
    if (currentUser?.email === email) {
      return currentUser;
    }

    if (currentUser?.role === Role.Admin) {
      return await User.findOne({
        where: {
          email,
        },
      });
    }

    return null;
  },
  create: async ({ firstName, lastName, email, password }: RegisterInput) => {
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
    if (!currentUser || !isAdmin(currentUser)) return false;

    try {
      await User.delete(id);
      return true;
    } catch (error) {
      console.log('delete user error : ', error);
      return false;
    }
  },
});
