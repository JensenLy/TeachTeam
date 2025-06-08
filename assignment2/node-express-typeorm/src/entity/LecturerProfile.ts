import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    OneToMany,
} from "typeorm";

import { User } from "./User";
import { Comment } from "./Comment";
import { Courses } from "./Courses";

@Entity()
export class LecturerProfile {
    @PrimaryGeneratedColumn()
    lecturerId: number;

    @Column({nullable: true})
    coursesAssigned: string;

    @OneToOne(() => User, user => user.lecturerProfile)
    @JoinColumn({ name: "userId" })
    user: User;

    @OneToMany(() => Comment, comment => comment.lecturer)
    @JoinColumn({ name: "commentId" })
    comments: Comment[];

    @OneToMany(() => Courses, course => course.lecturers)
    @JoinColumn({ name: "courseId" })
    courses: Courses[];
}