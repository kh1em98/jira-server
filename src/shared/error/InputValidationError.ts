import { Field, ObjectType } from 'type-graphql';
import { Error } from './Error';

@ObjectType({ implements: Error })
export class InputValidationError {
  @Field()
  message: string;

  @Field()
  field: string;
}
