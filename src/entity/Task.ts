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
  JoinTable,
  ManyToMany,
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
  user: User;

  @Field()
  @Column()
  userId: number;

  @Field()
  @ManyToOne(() => Board, (board) => board.tasks)
  board: Board;

  @Field(() => [User])
  @ManyToMany(() => User)
  @JoinTable()
  assigners: Promise<User[]>;

  @Field()
  @RelationId((task: Task) => task.board)
  boardId: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
