import { Arg, Mutation, Resolver, Field, InputType, Ctx } from 'type-graphql';
import bcrypt from 'bcrypt';

import { User } from '../../../entity/User';
import { MyContext } from '../../../types/MyContext';
import { createConfirmationUrl, sendEmail } from '../../../utils/mail';
import { IsEmail } from 'class-validator';

@InputType()
export class LoginInput {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	password: string;
}

@Resolver()
export default class LoginResolver {
	@Mutation(() => User, { nullable: true })
	async login(
		@Arg('input') { email, password }: LoginInput,
		@Ctx() ctx: MyContext
	): Promise<User | null> {
		const user = await User.findOne({
			where: { email },
		});
		if (!user) return null;

		const match = await bcrypt.compare(password, user.password);

		if (!match) return null;

		ctx.req.session.userId = user.id;

		if (!user.verified) {
			sendEmail(user.email, await createConfirmationUrl(user.id));
		}

		return user;
	}
}
