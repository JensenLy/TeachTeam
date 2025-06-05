import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useContext } from "react";
import { LoginContext } from "@/contexts/LoginContext";
import { LoginContextType } from "@/contexts/LoginContext";
import Profile from "../pages/profile";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, setIsLoggedIn, userRole } = useContext(LoginContext) as LoginContextType;
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    console.log(showProfileDropdown)

    return (
        <header className="flex-1 w-full text-white bg-blue-500 justify-center p-7">
            <div className="flex justify-between items-center">
                <div>
                    <Link href={"/"}><Image src="/transparentWhiteLogo.png" width={120} height={10} alt="Logo"></Image></Link>
                </div>
                <button className="lg:hidden text-white ml-auto" onClick={() => setIsOpen(!isOpen)}>
                    <span className="block w-6 h-0.5 bg-white mb-1"></span>
                    <span className="block w-6 h-0.5 bg-white mb-1"></span>
                    <span className="block w-6 h-0.5 bg-white"></span>
                </button>

                <nav className="hidden lg:flex">
                    <ul className="flex gap-4">
                        {isLoggedIn ? (
                            userRole === "lecturer" ? (
                                <>
                                    <li><Link className="hover:bg-sky-700 duration-75 rounded-md p-3" href="/lecturer">Lecturer Page</Link></li>
                                    <li><Link className="hover:bg-sky-700 duration-75 rounded-md p-3" onClick={() => setIsLoggedIn(false)} data-testid="lecturer-signOut"
                                        href="/">Sign Out</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link className="hover:bg-sky-700 duration-75 rounded-md p-3" href="/profile">Profile</Link></li>
                                    <li><Link className="hover:bg-sky-700 duration-75 rounded-md p-3" href="/tutor">Tutor Page</Link></li>
                                    <li><Link className="hover:bg-sky-700 duration-75 rounded-md p-3" onClick={() => setIsLoggedIn(false)} href="/">Sign Out</Link></li>
                                </>
                            )
                        ) : (
                            <>
                                <li><Link className="hover:bg-sky-700 duration-75 rounded-md p-3" href="/signup">Sign Up</Link></li>
                                <li><Link className="hover:bg-sky-700 duration-75 rounded-md p-3" href="/signin">Sign In</Link></li>
                            </>
                        )}
                    </ul>

                    
                </nav>
                {/* mobile header */}
                <nav className={`lg:hidden ${isOpen ? "block" : "hidden"} absolute top-20 right-0 bg-blue-500 w-full`}>
                    <ul className="flex flex-col items-center gap-4 p-4">
                        {isLoggedIn ? (
                            userRole === "lecturer" ? (
                                <>
                                    <li><Link className="hover:bg-sky-700 duration-75 rounded-md p-3" href="/lecturer">Lecturer Page</Link></li>
                                    <li><Link className="hover:bg-sky-700 duration-75 rounded-md p-3" onClick={() => setIsLoggedIn(false)} href="/">Sign Out</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link className="hover:bg-sky-700 duration-75 rounded-md p-3" href="/tutor">Tutor Page</Link></li>
                                    <li><Link className="hover:bg-sky-700 duration-75 rounded-md p-3" onClick={() => setIsLoggedIn(false)} href="/">Sign Out</Link></li>
                                </>
                            )
                        ) : (
                            <>
                                <li><Link className="hover:bg-sky-700 w-full text-center" href="/signup">Sign Up</Link></li>
                                <li><Link className="hover:bg-sky-700 w-full text-center" href="/signin">Sign In</Link></li>
                            </>
                        )}
                    </ul>
                    
                </nav>
                
            </div>
        </header>
    );
}