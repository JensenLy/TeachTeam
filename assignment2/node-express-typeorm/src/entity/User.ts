import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  OneToOne,
  JoinColumn,
} from "typeorm";

import argon2 from "argon2";
import { LecturerProfile } from "./LecturerProfile";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @Column({
    type: "enum",
    enum: ["candidate", "lecturer"],
    default: "candidate",
  })
  role: "candidate" | "lecturer";

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => LecturerProfile, (lecturerProfile) => lecturerProfile.user, { nullable: true })
  @JoinColumn({ name: "lecturerId" })
  lecturerProfile: LecturerProfile;

  // @OneToOne(() => CandidateProfile, (candidateProfile) => candidateProfile.user, { nullable: true })
  // @JoinColumn({ name: "candidateId" })
  // candidateProfile: CandidateProfile;
}
