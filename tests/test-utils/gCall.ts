import { graphql, GraphQLSchema } from 'graphql';
import { SessionData } from 'src/types/SessionData';
import { createSchema } from 'src/utils/createSchema';

interface Options {
  source: string;
  variableValues?: any;
  sessionData?: SessionData;
}

let schema: GraphQLSchema;

export const gCall = async ({
  source,
  variableValues,
  sessionData,
}: Options) => {
  if (!schema) {
    schema = await createSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          ...sessionData,
          destroy: jest.fn((cb) => cb(null)),
        },
      },
      res: {
        clearCookie: jest.fn(),
      },
    },
  });
};
