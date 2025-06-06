import axios from "axios";
import { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api", 
});

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  courseId: number
  title: string,
  description: string,
  courseCode: string,
  type: string,
  location: string,
  createdAt: string, 
  requirement: string,
}

export interface Application {
  candidateId: number,
  courseId: number,
  availability: string,
  skills: string,
  academic: string,
  prevRoles: string,
  role: "Tutor" | "Lab Assistance"
}

export const userApi = {
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getUserByEmail: async (email:string) => {
    const response = await api.get(`/users/${email}`);
    return response.data;
  },

  createUser: async (user: Partial<User>) => {
    const response = await api.post("/users", user);
    return response.data;
  },

  updateUser: async (id: number, user: Partial<User>) => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  verifyPassword: async (email: string, password: string) => {
    try {
    const response = await api.post("/users/verify", { email, password });
    return response.data;
    } catch (error) {
          if(axios.isAxiosError(error) && error.response?.status === 401) { 
            return false;
          }
      } 
        throw new Error("An unexpected error occurred");
    },
  };

export const candidateApi = {
  getAllCandidate: async () => {
    const response = await api.get("/candidate");
    return response.data;
  },

  getCandidateByUserID: async (user: User) => {
    const response = await api.get(`/candidate/${user.id}`);
    return response.data;
  },
};

export const courseApi = {
  getAllCourses: async () => {
    const response = await api.get("/courses");
    return response.data;
  },

  getCoursesByID: async (id:number) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
};

export const applicationApi = {
  getAllApps: async () => {
    const response = await api.get("/apps");
    return response.data;
  },

  createApp: async (application: Partial<Application>) => {
    const response = await api.post(`/apps`, application);
    return response.data;
  },

  hasApplied: async (candidateId: number, courseId: number): Promise<boolean> => {
    try{
      const response = await api.get(`/apps/check/${candidateId}/${courseId}`)
      return response.data.hasApplied;
    } catch (error){
      return false;
    }
  },

  updateCount: async (applicationId: number, count: number, chosenBy: string) => {
    const response = await api.put(`/applications/${applicationId}/count`, { count, chosenBy });
    return response.data;
  }
};


export const commentApi = {
  getAllComments: async () => {
    const response = await api.get("/comments");
    return response.data;
  },

  createComment: async (content:string, applicationId: number, lecturerId: number) => {
    const response = await api.post(`/comments`, { content, applicationId, lecturerId });
    return response.data;
  },

};
