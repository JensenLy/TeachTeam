import { User } from "./users"

interface Candidate {
  id: number;
  user: User;
}

interface Course {
  courseId: number;
  title: string;
  description: string;
  requirement: string;
  courseCode: string;
  type: string;
  location: string;
  createdAt: string;
}

export type ApplicationData = {
  applicationId: number;
  chosenBy: string;
  count: number;
  role: "Tutor" | "Lab Assistance";
  availability: string;
  skills: string;
  academic: string;
  prevRoles: string;
  appliedAt: string;
  candidate: Candidate;
  courses: Course;
}

