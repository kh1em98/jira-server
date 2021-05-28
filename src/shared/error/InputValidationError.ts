import { Field, ObjectType } from 'type-graphql';
import { Error } from './Error';

@ObjectType({ implements: Error })
export class InputValidationError {
  constructor(_message: string, _field) {
    this.message = _message;
    this.fields = _field;
  }

  @Field()
  message: string;

  @Field(() => [String])
  fields: string[];
}
