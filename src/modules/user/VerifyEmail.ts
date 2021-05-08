import { Arg, Mutation, Resolver } from 'type-graphql';

import { User } from '../../entity/User';
import { redis } from '../../redis';

@Resolver()
export default class VerifyResolver {
	@Mutation(() => Boolean)
	async verify(@Arg('token') token: string): Promise<boolean> {
		const userId = await redis.get(token);

		if (!userId) {
			return false;
		}

		const user = await User.findOne(parseInt(userId, 10));
		console.log('user : ', user);

		if (!user) {
			return false;
		}

		await User.update({ id: parseInt(userId, 10) }, { verified: true });
		await redis.del(token);

		return true;
	}
}
