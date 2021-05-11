import { Mutation, Resolver, Ctx, UseMiddleware } from 'type-graphql';

import { isAuth } from '../../../middlewares/isAuth.middleware';
import { MyContext } from '../../../types/MyContext';

@Resolver()
export default class LogoutResolver {
	@UseMiddleware(isAuth)
	@Mutation(() => Boolean)
	async logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
		return new Promise((resolve, reject) => {
			req.session.destroy((error) => {
				if (error) {
					reject(false);
				}

				res.clearCookie('sid');

				resolve(true);
			});
		});
	}
}
