import { InterfaceType, Field, ID, Int } from 'type-graphql';

@InterfaceType()
export abstract class IError {
  @Field()
  message: string;
}
