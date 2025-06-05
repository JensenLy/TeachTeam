import React from "react";
import { useContext } from "react";
import { LoginContext } from "@/contexts/LoginContext";
import { LoginContextType } from "@/contexts/LoginContext";
import Link from "next/link";

export default function Footer() {
  const{isLoggedIn} = useContext(LoginContext) as LoginContextType;
  const{setIsLoggedIn} = useContext(LoginContext) as LoginContextType;

  return (
    <footer className="w-full mt-auto bg-blue-500 border-t-0 border-white flex items-center justify-center">
        <div className="flex justify-around w-full">
            <ul className="flex overflow-auto p-5 text-white">
                <li><Link href="/" className="hover:bg-sky-700 duration-100 rounded-md p-3">Home</Link></li>

                {isLoggedIn ? (
                    <li><Link className="hover:bg-sky-700 duration-75 rounded-md p-3" onClick={() => setIsLoggedIn(false)} href="/">Sign Out</Link></li>
                    ) : (
                    <>
                    <li><Link href="/signup" className="hover:bg-sky-700 duration-100 rounded-md p-3">Sign Up</Link></li>
                    <li><Link href="/signin" className="hover:bg-sky-700 duration-100 rounded-md p-3">Sign In</Link></li>
                    </>
                )}
            </ul>
        </div>
    </footer>
  );
}