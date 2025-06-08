import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Applications } from "./entity/Applications";
import { Courses } from "./entity/Courses";
import { Comment } from "./entity/Comment";
import { CandidateProfile } from "./entity/CandidateProfile";
import { LecturerProfile } from "./entity/LecturerProfile";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_DIALECT as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true,
  logging: true,
  entities: [User, Applications, Comment, Courses, CandidateProfile, LecturerProfile],
  migrations: [],
  subscribers: [],
});
