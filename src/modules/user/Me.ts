import { Resolver, Ctx, Query, UseMiddleware } from 'type-graphql';

import { User } from '../../entity/User';
import { MyContext } from '../../types/MyContext';
import { isAuth } from '../middlewares/isAuth';

@Resolver()
export default class MeResolver {
	@UseMiddleware(isAuth)
	@Query(() => User, { nullable: true })
	async me(@Ctx() ctx: MyContext): Promise<User | null> {
		const userId = ctx.req.session.userId;

		if (!userId) {
			return null;
		}

		const user = await User.findOne(userId);
		if (!user) return null;

		return user;
	}
}
