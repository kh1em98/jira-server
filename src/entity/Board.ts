import { Field, ObjectType } from 'type-graphql';
import { User } from './User';
import { Task } from './Task';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@ObjectType()
@Entity()
export class Board extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field(() => [Task], { nullable: true })
  @OneToMany(() => Task, (task) => task.board)
  tasks: Task[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.boards)
  creator: User;

  @Field()
  @Column()
  creatorId: number;

  @Field(() => [User])
  @ManyToMany(() => User)
  @JoinTable()
  assigners: User[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
