import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import { createConnection } from 'typeorm';
import session from 'express-session';
declare module 'express-session' {
  export interface SessionData {
    userId: number;
    user: User;
  }
}

import connectRedis from 'connect-redis';
import cors from 'cors';

import { redis } from './redis';
import { User } from './entity/User';
import { createSchema } from './utils/createSchema';

const main = async () => {
  await createConnection();

  console.log('Hay lam dit me may');

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
  });

  const app: Application = express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    }),
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
        maxAge: 1000 * 60 * 60 * 24 * 2,
      },
    }),
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, async () => {
    console.log('server started on http://localhost:4000/graphql');
  });
};

main();
