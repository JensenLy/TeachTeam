interface LecturerProfile {
  lecturerId: number;
  coursesAssigned: string;
}

export type LecturerData = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lecturerProfile?: LecturerProfile;
}