import{
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
    OneToMany,
} from "typeorm";

import { User } from "./User";
import { Applications } from "./Applications";

@Entity()
export class CandidateProfile {
    @PrimaryGeneratedColumn()
    id: number;

    // @OneToOne(() => User, user => user.candidateProfile)
    // @JoinColumn({ name: "userId" })
    // user: User;

    @OneToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @OneToMany(() => Applications, application => application.candidate)
    @JoinColumn({ name: "applicationId" })
    application: Applications[];
}