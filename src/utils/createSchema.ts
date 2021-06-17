import { redisSub, redisPub } from './../redis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';

export const pubsubRedis = new RedisPubSub({
  publisher: redisPub,
  subscriber: redisSub,
});

export const createSchema = (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [__dirname + '/../resolvers/**/*.resolver.ts'],
    pubSub: pubsubRedis,
    // authChecker: ({ context: { req } }) => {
    //   if (!req.session.userId) {
    //     return false;
    //   }
    //   return true; // or false if access is denied
    // },
  });
};
