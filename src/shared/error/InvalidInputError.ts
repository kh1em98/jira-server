import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class InvalidInputError {
  @Field()
  message: string;
}
