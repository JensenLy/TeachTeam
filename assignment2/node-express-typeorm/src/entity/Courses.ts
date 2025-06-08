import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    JoinColumn,
    ManyToMany
} from "typeorm";

import { Applications } from "./Applications";
import { LecturerProfile } from "./LecturerProfile";

@Entity()
export class Courses {
    @PrimaryGeneratedColumn()
    courseId: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    requirement: string;

    @Column()
    courseCode: string;

    @Column()
    type: string; 

    @Column()
    location: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Applications, application => application.courses)
    // @JoinColumn({ name: "applicationsId" })
    applications: Applications[];

    @OneToMany(() => LecturerProfile, lecturer => lecturer.coursesAssigned)
    @JoinColumn({ name: "lecturerId" })
    lecturers: LecturerProfile[];
}