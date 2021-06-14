import bcrypt from 'bcrypt';
import { User } from '../../entity/User';
import { RegisterInput } from 'src/resolvers/user/register/RegisterInput';
import { IUserRepo } from './UserRepo';

export class TypeormUserRepo implements IUserRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async getAllUsers(): Promise<User[]> {
    const UserModel = this.models.user;

    return await UserModel.find({});
  }

  async getUserByEmail(email: string): Promise<User> {
    const UserModel = this.models.user;

    return await UserModel.findOne({
      where: {
        email,
      },
    });
  }

  async getUserById(id: number): Promise<User> {
    const UserModel = this.models.user;

    return await UserModel.findOne({
      where: {
        id,
      },
    });
  }

  async createUser({
    email,
    firstName,
    lastName,
    password,
  }: RegisterInput): Promise<void> {
    const UserModel = this.models.user;
    const exists = await this.getUserByEmail(email);

    if (!exists) {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        firstName,
        lastName,
        email,
        password: hashPassword,
      }).save();

      return user;
    }
  }

  async saveUser(user: User) {
    return await user.save();
  }

  async deleteUserById(id: number): Promise<boolean> {
    const UserModel = this.models.user;

    return await UserModel.delete(id);
  }
}
