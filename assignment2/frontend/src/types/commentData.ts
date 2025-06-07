import { User } from "./users"

interface Lecturer {
  lecturerId: number;
  coursesAssigned: string;
  user: User;
}

interface Application {
  applicationId: number;
  chosenBy: string;
  count: number;
  role: string;
  availability: string;
  skills: string;
  academic: string;
  prevRoles: string;
  appliedAt: string;
}

export type CommentData = {
  id: number;
  content: string;
  createdAt: string;
  application: Application;
  lecturer: Lecturer;
}