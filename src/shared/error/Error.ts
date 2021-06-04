import { Field, InterfaceType } from 'type-graphql';

@InterfaceType()
export abstract class Error {
  @Field()
  message: string;
}
