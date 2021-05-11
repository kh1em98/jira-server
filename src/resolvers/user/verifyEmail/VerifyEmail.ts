import { Arg, Mutation, Resolver } from 'type-graphql';

import { User } from '../../../entity/User';
import { redis } from '../../../redis';

@Resolver()
export default class VerifyResolver {
	@Mutation(() => Boolean)
	async verify(@Arg('token') token: string): Promise<boolean> {
		const userId = await redis.get(token);

		if (!userId) {
			return false;
		}

		const user = await User.findOne(parseInt(userId, 10));

		if (!user) {
			return false;
		}

		user.verified = true;

		await User.update(user.id, user);

		await redis.del(token);

		return true;
	}
}
