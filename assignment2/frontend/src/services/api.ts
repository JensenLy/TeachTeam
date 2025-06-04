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

export const courseApi = {
  getAllCourses: async () => {
    const response = await api.get("/courses");
    return response.data;
  },
};
