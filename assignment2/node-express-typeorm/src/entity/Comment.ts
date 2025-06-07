import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Applications } from "./Applications";
import { User } from "./User";
import { LecturerProfile } from "./LecturerProfile";

@Entity()
export class Comment { 
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Applications, application => application.comments, {nullable: true})
  @JoinColumn({ name: "applicationId" })
  application: Applications;

  @ManyToOne(() => LecturerProfile, lecturer => lecturer.comments)
  @JoinColumn({ name: "lecturerId" })
  lecturer: User;
}