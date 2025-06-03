import { createContext } from "react";
export interface LoginContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  firstNameLogedIn: string;
  setFirstNameLogedIn: React.Dispatch<React.SetStateAction<string>>;
  lastNameLogedIn: string;
  setLastNameLogedIn: React.Dispatch<React.SetStateAction<string>>;
  emailLogedIn: string;
  setEmailLogedIn: React.Dispatch<React.SetStateAction<string>>;
  userRole: string;
  setUserRole: React.Dispatch<React.SetStateAction<string>>;
}

export const loginContext = createContext<LoginContextType | null>(null);