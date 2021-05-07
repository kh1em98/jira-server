import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../../entity/User';
import bcrypt from 'bcrypt';

@Resolver(User)
export default class RegisterResolver {
	@Query(() => String)
	async helloWorld() {
		return 'Hello World!';
	}

	@Query(() => User)
	async getAllUser(): Promise<User[] | []> {
		const users = await User.find();
		return users;
	}

	@Mutation(() => User)
	async register(
		@Arg('fullName') fullName: string,
		@Arg('username') username: string,
		@Arg('email') email: string,
		@Arg('password') password: string
	): Promise<User | String> {
		const hashPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			fullName,
			username,
			email,
			password: hashPassword,
		}).save();

		return user;
	}
}
