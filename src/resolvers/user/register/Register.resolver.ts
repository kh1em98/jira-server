import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';

import bcrypt from 'bcrypt';
import { sendEmail, createConfirmationUrl } from '../../../utils/mail';
import { User } from '../../../entity/User';
import { RegisterInput } from './RegisterInput';

@Resolver()
export default class RegisterResolver {
	@Query(() => User)
	async getAllUser(): Promise<User[] | []> {
		const users = await User.find({});
		return users;
	}

	@Mutation(() => User)
	async register(
		@Arg('input') { fullName, username, email, password }: RegisterInput
	): Promise<User | String> {
		const hashPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			fullName,
			username,
			email,
			password: hashPassword,
		}).save();

		await sendEmail(user.email, await createConfirmationUrl(user.id));

		return user;
	}
}
