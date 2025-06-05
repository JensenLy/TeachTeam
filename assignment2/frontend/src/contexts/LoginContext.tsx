import React, { createContext, useContext, useEffect, useState } from "react";

export interface LoginContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  firstNameLoggedIn: string;
  setFirstNameLoggedIn: React.Dispatch<React.SetStateAction<string>>;
  lastNameLoggedIn: string;
  setLastNameLoggedIn: React.Dispatch<React.SetStateAction<string>>;
  emailLoggedIn: string;
  setEmailLoggedIn: React.Dispatch<React.SetStateAction<string>>;
  userRole: string;
  setUserRole: React.Dispatch<React.SetStateAction<string>>;
}


export const LoginContext = createContext<LoginContextType | null>(null);

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstNameLoggedIn, setFirstNameLoggedIn] = useState("");
  const [lastNameLoggedIn, setLastNameLoggedIn] = useState("");
  const [emailLoggedIn, setEmailLoggedIn] = useState("");
  const [userRole, setUserRole] = useState("");

   useEffect(() => {
    const storedLogIn = localStorage.getItem("isLoggedIn");
    const storedFirstName = localStorage.getItem("firstNameLoggedIn") || "";
    const storedLastName = localStorage.getItem("lastNameLoggedIn") || "";
    const storedEmail = localStorage.getItem("emailLoggedIn") || "";
    const storedUserRole = localStorage.getItem("userRole") || "";

    if (storedLogIn === "true") {
      setIsLoggedIn(true);
      setFirstNameLoggedIn(storedFirstName);
      setLastNameLoggedIn(storedLastName);
      setEmailLoggedIn(storedEmail);
      setUserRole(storedUserRole);
    }
  }, []);

  useEffect(() => {
    // Sync to localStorage whenever state changes
      localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
      localStorage.setItem("firstNameLoggedIn", firstNameLoggedIn);
      localStorage.setItem("lastNameLoggedIn", lastNameLoggedIn);
      localStorage.setItem("emailLoggedIn", emailLoggedIn);
      localStorage.setItem("userRole", userRole);

  }, [isLoggedIn, firstNameLoggedIn, lastNameLoggedIn, emailLoggedIn, userRole]);

  return(
  <LoginContext.Provider
  value={{
    isLoggedIn,
    setIsLoggedIn,
    firstNameLoggedIn,
    setFirstNameLoggedIn,
    lastNameLoggedIn,
    setLastNameLoggedIn,
    emailLoggedIn,
    setEmailLoggedIn,
    userRole,
    setUserRole,
  }}
>
  {children}
</LoginContext.Provider>
  );
}

export function useLoginContext() {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLoginContext must be used within a LoginProvider");
  }
  return context;
}
