import { Directive, Field, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './Task';
import { Board } from './Board';
import { Comment } from './Comment';

export enum Role {
  Admin = 'admin',
  User = 'user',
}

registerEnumType(Role, {
  name: 'Role', // this one is mandatory
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({
    default: false,
  })
  isFacebookAccount: boolean;

  @Field({ nullable: true })
  @Column()
  password: string;

  @Field()
  @Column({
    default: 'https://d1c556z6rl45hi.cloudfront.net/khiem.png',
  })
  image: string;

  @Field(() => [Task])
  @OneToMany(() => Task, (task) => task.creator)
  tasks: Task[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.creator)
  comments: Comment[];

  @Field(() => [Board])
  @OneToMany(() => Board, (board) => board.creator)
  boards: Board[];

  @Field()
  @Column({
    default: false,
  })
  emailVerified: boolean;

  @Field(() => Role)
  @Column({
    default: Role.User,
  })
  role: Role;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
