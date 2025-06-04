import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn
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
    courseCode: string;

    @Column()
    type: string; 

    @Column()
    location: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Applications, application => application.courses)
    @JoinColumn({ name: "applicationsId" })
    applications: Applications[];

    @OneToMany(() => LecturerProfile, lecturer => lecturer.coursesAssigned)
    @JoinColumn({ name: "lecturerId" })
    lecturers: LecturerProfile[];
}