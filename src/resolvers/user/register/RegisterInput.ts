import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsEmailAlreadyExist } from './isEmailAlreadyExist';
import { PasswordMixin } from '../../../shared/PasswordInput';

@InputType()
export class RegisterInput extends PasswordMixin(class {}) {
	@Field()
	fullName: string;

	@Field()
	@IsEmail()
	@IsEmailAlreadyExist()
	email: string;
}
