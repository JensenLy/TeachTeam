import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Applications } from "./entity/Applications";
import { Courses } from "./entity/Courses";
import { Comment } from "./entity/Comment";
import { CandidateProfile } from "./entity/CandidateProfile";
import { LecturerProfile } from "./entity/LecturerProfile";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  username: "S3977367",
  password: "S3977367",
  database: "S3977367",
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true,
  logging: true,
  entities: [User, Applications, Comment, Courses, CandidateProfile, LecturerProfile],
  migrations: [],
  subscribers: [],
});
