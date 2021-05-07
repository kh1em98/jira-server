import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsEmailAlreadyExist } from './isEmailAlreadyExist';

@InputType()
export class RegisterInput {
	@Field()
	fullName: string;

	@Field()
	username: string;

	@Field()
	@IsEmail()
	@IsEmailAlreadyExist()
	email: string;

	@Field()
	password: string;
}
