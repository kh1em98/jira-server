import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';

export const createSchema = (): Promise<GraphQLSchema> => {
	return buildSchema({
		resolvers: [__dirname + '/../modules/*/*.ts'],
		authChecker: ({ context: { req } }) => {
			if (!req.session.userId) {
				return false;
			}
			return true; // or false if access is denied
		},
	});
};
