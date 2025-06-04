import e from "express";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";

import { Applications } from "./Applications";
import { User } from "./User";

@Entity()
export class Comment { 
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  // Foreign key to Applications
  @ManyToOne(() => Applications, application => application.comments, {nullable: false})
  application: Applications;

  // Foreign key to User
  // only lecturer can comment
  @ManyToOne(() => User, lecturer => lecturer.comment, {nullable: false})
  lecturer: User;
}