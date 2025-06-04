import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { Applications } from "./Applications";
import { Comment } from "./Comment";
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

  @OneToMany(() => Applications, application => application.user)
  applications: Applications[];
  // lecturer can comment on applications
  // nullable: true means that a user can exist without comments
  @OneToMany(() => Comment, comment => comment.lecturer, { nullable: true })
  comment: Comment[];
}
