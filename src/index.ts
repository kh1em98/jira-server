import { BaseRedisCache } from 'apollo-server-cache-redis';
import { ApolloServer, SchemaDirectiveVisitor } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { COOKIE_NAME } from './config/constant';
import { PORT, __prod__ } from './config/vars';
import OnlyAdminDirective from './directives/onlyAdmin';
import { User } from './entity/User';
import { generateBoardModel } from './models/Board';
import { generateTaskModel } from './models/Task';
import { generateUserModel } from './models/User';
import { redis } from './redis';
import { createSchema } from './utils/createSchema';
import { createUserLoader } from './utils/createUserLoader';
import { getCookieProp, logTimeRequest } from './utils/helper';

declare module 'express-session' {
  export interface SessionData {
    userId: number;
    user: User;
  }
}

const RedisStore = connectRedis(session);
const connectDbWithRetry = () => {
  createConnection()
    .then(async (conn) => {
      await conn.runMigrations();
      console.log('Connected to DB...');
    })
    .catch((error) => {
      if (error) {
        console.error(error);
        setTimeout(connectDbWithRetry, 5000);
      }
    });
};

const main = async () => {
  connectDbWithRetry();
  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    schemaDirectives: {
      onlyAdmin: OnlyAdminDirective,
    },

    context: async ({ req, res, connection }: any) => {
      if (connection) {
        console.log('connection context : ', connection.context);
        return connection.context;
      } else {
        const currentUser = await User.findOne({
          where: {
            id: req.session?.userId,
          },
        });

        return {
          req,
          res,
          currentUser,
          userLoader: createUserLoader(),
          models: {
            User: generateUserModel(currentUser),
            Task: generateTaskModel(currentUser),
            Board: generateBoardModel(currentUser),
          },
        };
      }
    },

    // Trong trường hợp server có nhiều instance, cần có shared cache để instance này có thể lấy cache của instance kia
    cache: new BaseRedisCache({
      client: redis,
    }),
    // Ko muon hien thi error va debug cho End-User
    tracing: !__prod__,
    debug: !__prod__,
    // plugins: [
    //   responseCachePlugin({
    //     sessionId: (requestContext) => {
    //       return requestContext?.request?.http?.headers.get('cookie') || null;
    //     },
    //   }),
    // ],
    uploads: false,
    subscriptions: {
      path: '/subscriptions',
      onConnect: async (cnxnParams, webSocket, cnxnContext) => {
        const cookieFromRequest = (webSocket as any).upgradeReq.headers.cookie;

        const sid = getCookieProp(cookieFromRequest, 'sid');
        try {
          let result = await redis.get(`sess:${sid}`);
          result = JSON.parse(result as any);

          return {
            currentUserId: (result as any).userId,
          };
        } catch (error) {
          return {};
        }
      },
    },
    // introspection: true,
  });

  SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
    onlyAdmin: OnlyAdminDirective,
  });

  const app: Application = express();

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
      name: COOKIE_NAME,
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 2, // 2 day
      },
    }),
  );

  app.use('/graphql', logTimeRequest);

  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 2000000000, maxFiles: 10 }),
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.use((req: Request, res: Response) => {
    res.status(404).send('Not found');
  });

  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(PORT, async () => {
    console.log(`server started on http://localhost:${PORT}/graphql`);
  });
};

main();
