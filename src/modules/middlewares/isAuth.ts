import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../../types/MyContext';
import { User } from '../../entity/User';

export const isAuth: MiddlewareFn<MyContext> = async ({ context: { req, res } }, next) => {
	if (!req.session.userId) {
		res.clearCookie('sid');
		throw new Error('Not authenticated');
	}
	return next();
};

export const isVerified: MiddlewareFn<MyContext> = async ({ context: { req } }, next) => {
	const userId = req.session.userId;

	const user = await User.findOne(userId);

	if (!user || !user.verified) {
		throw new Error('User is not verified');
	}

	req.session.user = user;

	return next();
};
