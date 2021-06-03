import { Field, InputType } from 'type-graphql';
import { PasswordMixin } from '../../../shared/PasswordInput';

@InputType()
export class RegisterInput extends PasswordMixin(class {}) {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  // @IsEmail()
  // @IsEmailAlreadyExist()
  email: string;
}
