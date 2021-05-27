import { Field, ObjectType } from 'type-graphql';
import { IError } from './Error';

@ObjectType({ implements: IError })
export class InputValidationError {
  @Field()
  message: string;
}
