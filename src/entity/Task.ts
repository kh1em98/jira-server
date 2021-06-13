import { Field, ObjectType } from 'type-graphql';
import { User } from './User';
import { Board } from './Board';
import { Comment } from './Comment';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  RelationId,
  OneToMany,
} from 'typeorm';

@ObjectType()
@Entity()
export class Task extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.tasks)
  creator: User;

  @ManyToOne(() => Board, (board) => board.tasks)
  board: Board;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
