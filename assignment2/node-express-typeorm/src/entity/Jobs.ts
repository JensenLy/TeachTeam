import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";

import { Applications } from "./Applications";

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    location: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Applications, application => application.job)
    applications: Applications[];
}