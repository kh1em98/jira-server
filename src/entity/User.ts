import { Field, ObjectType, Root, UseMiddleware } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { IsAccountVerified } from '../modules/user/register/isVerified';
import { isAuth, isVerified } from '../modules/middlewares/isAuth';

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	fullName: string;

	@Field()
	@Column()
	email: string;

	@Column({
		default: false,
	})
	isFacebookAccount: boolean;

	@Field()
	@Column()
	@UseMiddleware(isAuth, isVerified)
	username: string;

	@Column()
	password: string;

	@Field()
	@Column({
		default: 'https://d1c556z6rl45hi.cloudfront.net/khiem.png',
	})
	@IsAccountVerified()
	image: string;

	@Field({ nullable: true })
	nickName(@Root() user: User): string {
		return `${user.fullName}${Math.floor(Math.random() * 100)}`;
	}

	@Column({
		default: 0,
	})
	timesForceLogout: number;

	@Field()
	@Column({
		default: false,
	})
	verified: boolean;
}
