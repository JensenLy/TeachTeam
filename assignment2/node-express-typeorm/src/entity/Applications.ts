import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";

import { Comment } from "./Comment";
import { Courses } from "./Courses";
import { CandidateProfile } from "./CandidateProfile";

@Entity()
@Unique(["user", "job"]) // Ensure a user can only apply to a job once
export class Applications {
  @PrimaryGeneratedColumn()
  applicationId: number;

  @Column({default: "pending"})
  status: string;
  // user foregin key
  
  @CreateDateColumn()
  appliedAt: Date;

  @OneToOne(() => CandidateProfile, candidate => candidate.application)
  @JoinColumn({ name: "candidateId" })
  candidate: CandidateProfile;

  @OneToOne(() => Courses, Courses => Courses.applications)
  @JoinColumn({ name: "courseId" })
  Courses: Courses;

  @OneToMany(() => Comment, comment => comment.application)
  @JoinColumn({ name: "commentsId" })
  comments: Comment[];
}
