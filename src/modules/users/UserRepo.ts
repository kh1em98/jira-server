import { RegisterInput } from './../../resolvers/user/register/RegisterInput';
import { User } from './../../entity/User';

export interface IUserRepo {
  getAllUsers(): Promise<User[]>;
  getUserByEmail(email: string): Promise<User>;
  getUserById(id: number): Promise<User>;
  createUser(input: RegisterInput): Promise<void>;
  saveUser(user: User): Promise<User>;
  deleteUserById(id: number): Promise<boolean>;
}
