import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import session from 'express-session';
declare module 'express-session' {
	export interface SessionData {
		userId: number;
	}
}

import connectRedis from 'connect-redis';
import cors from 'cors';

import { redis } from './redis';
import RegisterResolver from './modules/user/register';
import LoginResolver from './modules/user/Login';
import MeResolver from './modules/user/Me';

const main = async () => {
	await createConnection();

	const schema = await buildSchema({
		resolvers: [RegisterResolver, LoginResolver, MeResolver],
	});

	const apolloServer = new ApolloServer({ schema, context: ({ req }: any) => ({ req }) });

	const app: Application = express();

	const RedisStore = connectRedis(session);

	app.use(
		cors({
			credentials: true,
			origin: 'http://localhost:3000',
		})
	);

	app.use(
		session({
			store: new RedisStore({
				client: redis as any,
			}),
			name: 'sid',
			secret: 'aslkdfjoiq12312',
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
			},
		})
	);

	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => {
		console.log('server started on http://localhost:4000/graphql');
	});
};

main();
