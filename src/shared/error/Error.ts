import { InterfaceType, Field, ID, Int } from 'type-graphql';

@InterfaceType()
export abstract class Error {
  @Field()
  message: string;
}
