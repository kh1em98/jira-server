import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsEmailAlreadyExist } from './isEmailAlreadyExist';
import { PasswordMixin } from '../../shared/PasswordInput';
import { OkMixin } from '../../shared/OkMixin';

@InputType()
export class RegisterInput extends OkMixin(PasswordMixin(class {})) {
	@Field()
	fullName: string;

	@Field()
	username: string;

	@Field()
	@IsEmail()
	@IsEmailAlreadyExist()
	email: string;
}
