import { Resolver, Field, InputType, Ctx, Query } from 'type-graphql';

import { User } from '../../entity/User';
import { MyContext } from '../../types/MyContext';

@InputType()
export class LoginInput {
	@Field()
	emailOrUsername: string;

	@Field()
	password: string;
}

@Resolver()
export default class MeResolver {
	@Query(() => User, { nullable: true })
	async me(@Ctx() ctx: MyContext): Promise<User | null> {
		const userId = ctx.req.session.userId;

		const user = await User.findOne({ where: { id: userId } });
		if (!user) return null;

		return user;
	}
}
