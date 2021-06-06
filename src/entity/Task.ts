import { Directive, Field, ObjectType } from 'type-graphql';
import { User } from './User';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
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

  @Field()
  @Column()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
