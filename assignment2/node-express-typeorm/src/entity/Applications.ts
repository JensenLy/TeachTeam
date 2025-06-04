import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  OneToMany,
  JoinColumn,
  OneToOne,
} from "typeorm";

import { Comment } from "./Comment";
import { Courses } from "./Courses";
import { CandidateProfile } from "./CandidateProfile";

@Entity()
@Unique(["candidate", "courses"]) // Ensure a user can only apply to a job once
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

  @OneToOne(() => Courses, courses => courses.applications)
  @JoinColumn({ name: "courseId" })
  courses: Courses;

  @OneToMany(() => Comment, comment => comment.application)
  @JoinColumn({ name: "commentsId" })
  comments: Comment[];
}
