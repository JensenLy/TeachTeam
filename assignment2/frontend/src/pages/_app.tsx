import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { loginContext } from "../contexts/LoginContext"
import { useState } from "react"
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
const [firstNameLogedIn, setFirstNameLogedIn] = useState<string>("");
const [emailLogedIn, setEmailLogedIn] = useState<string>("");
const [lastNameLogedIn, setLastNameLogedIn] = useState<string>("");
const [userRole, setUserRole] = useState<string>("");

// runs of first render to retrieve local storage data
useEffect(() => {
  const storedLogIn = localStorage.getItem("isLoggedIn");
  const storedFirstName = localStorage.getItem("firstNameLogedIn") || "";
  const storedLastName = localStorage.getItem("lastNameLogedIn") || "";
  const storedEmail = localStorage.getItem("emailLogedIn") || "";
  const storedUserRole = localStorage.getItem("userRole") || "";
// if user was loged in set the state with user's data
  if (storedLogIn === "true") {
    setIsLoggedIn(true);
    setFirstNameLogedIn(storedFirstName);
    setLastNameLogedIn(storedLastName);
    setEmailLogedIn(storedEmail);
    setUserRole(storedUserRole);
  }
}, []);

// when log in changes, local storage is updated
useEffect(() => {
  localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  localStorage.setItem("firstNameLogedIn", firstNameLogedIn);
  localStorage.setItem("lastNameLogedIn", lastNameLogedIn);
  localStorage.setItem("emailLogedIn", emailLogedIn);
  localStorage.setItem("userRole", userRole);
}, [isLoggedIn, userRole, emailLogedIn, firstNameLogedIn, lastNameLogedIn])


  return( 
  <loginContext.Provider value={{isLoggedIn, setIsLoggedIn, setFirstNameLogedIn, firstNameLogedIn,
                                 setLastNameLogedIn, lastNameLogedIn, setEmailLogedIn, emailLogedIn
                                 ,userRole, setUserRole
  }}>
   <Component {...pageProps} />;
  </loginContext.Provider>
  );
}

