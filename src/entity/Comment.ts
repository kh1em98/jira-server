import { Task } from './Task';
import { Field, ObjectType } from 'type-graphql';
import { User } from './User';
import { Board } from './Board';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  RelationId,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  content: string;

  @Field(() => User)
  @ManyToOne(() => User)
  creator: User;

  @Field(() => Task)
  @ManyToOne(() => Task, (task) => task.comments)
  task: Task;

  @OneToOne((type) => Comment)
  @JoinColumn()
  replyTo: Comment;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
