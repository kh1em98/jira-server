import bcrypt from 'bcrypt';
import { Role, User } from '../entity/User';
import { EmailExistedError } from '../resolvers/user/register/Register.resolver';
import { InputValidationError } from '../shared/error/InputValidationError';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import {
  CredentialsError,
  LoginInput,
} from '../resolvers/user/login/Login.resolver';
import { sendEmail, createConfirmationUrl, TokenPrefix } from '../utils/mail';

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
    const { error } = registerSchema.validate({
      email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      throw new InputValidationError(error.message, error?.details[0].path);
    }

    const isEmailExisted = await User.findOne({ where: { email } });

    if (isEmailExisted) {
      throw new EmailExistedError(`${email} has already been registered`);
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
  login: async ({ email, password }: LoginInput) => {
    const { error } = loginSchema.validate({
      email,
      password,
    });

    if (error) {
      throw new InputValidationError(error.message, error?.details[0].path);
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new CredentialsError('Wrong email', 'email');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new CredentialsError('Wrong password', 'password');
    }

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
