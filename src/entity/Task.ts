// import { Field, ObjectType } from 'type-graphql';
// import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
// import { User } from './User';

// @ObjectType()
// @Entity()
// export class Task extends BaseEntity {
// 	@Field()
// 	@PrimaryGeneratedColumn()
// 	id: number;

// 	@Field()
// 	@Column()
// 	title: string;

// 	@Field()
// 	@Column({
// 		default: false,
// 	})
// 	completed: boolean;

// 	@Field()
// 	@Column({
// 		nullable: true,
// 	})
// 	description: string;

// 	@Field()
// 	@Column()
// 	creatorId: number;

// 	@Field()
// 	@ManyToOne(() => User, (user) => user.tasksCreated)
// 	creator: User;
// }
