import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  OneToMany,
  ManyToOne
} from "typeorm";

import { User } from "./User";
import { Comment } from "./Comment";
import { Job } from "./Jobs";

@Entity()
@Unique(["user", "job"]) // Ensure a user can only apply to a job once
export class Applications {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: "pending"})
  status: string;
  // user foregin key
  
  @CreateDateColumn()
  appliedAt: Date;

  @ManyToOne(() => User, user => user.applications)
  user: User;
  // job foreign key
  @ManyToOne(() => Job, job => job.applications)
  job: Job;

  @OneToMany(() => Comment, comment => comment.application)
  comments: Comment[];
}
