    import React from "react";
    import Image from "next/image";
    import Link from "next/link";
    import { useState } from "react"
    import { useRouter } from "next/router"
    import { useContext } from "react";
    import { LoginContext, LoginContextType } from "@/contexts/LoginContext";
    import { userApi } from "../services/api";
    import argon2 from "argon2";
    // a list of users which are 3 tutors and 3 lecturers

    export default function SignIn(){
    const[email, setEmail] = useState<string>("")
    const[password, setPassword] = useState<string>("")
    const[loginMessage, setLoginMessage] = useState<string>("")
    const{setIsLoggedIn, setFirstNameLoggedIn, setEmailLoggedIn, setLastNameLoggedIn, setUserRole} = useContext(LoginContext) as LoginContextType;
    const router = useRouter()
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password:"",
        role: "",
    });

    const handleFindUser = async (email:string) => {
        try {
            const data = await userApi.getUserByEmail(email);
            setUser(data);
            return data;
        } catch (err) {
            setUser({firstName: "", lastName: "", email: "", password:"", role: ""})
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        //find user 
        const foundUser = await handleFindUser(email)

        //min 8 characters, 1 capital letter, and 1 special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}":;'?/>.<,]).{8,}$/;

        //if password meets requirements 
        if(!passwordRegex.test(password)){
            setLoginMessage("Password must be at least 8 characters, contain 1 uppercase letter, and 1 special character ❌");
            return;
        }
        
        if(!foundUser || !foundUser.email){
            setLoginMessage("Email not found ❌");
            return;
        }
        
        const isValidPassword = await userApi.verifyPassword(email, password);

        if(isValidPassword){
            setIsLoggedIn(true)
            setFirstNameLoggedIn(user.firstName)
            setLastNameLoggedIn(user.lastName)
            setEmailLoggedIn(email)
            setUserRole(user.role)

            if(user.role === "candidate"){

                setLoginMessage(`Successfully logged ${user.firstName} as candidate! Redirecting...`)
                setTimeout(() => router.push("/tutor"), 2000)
            }
            else{
                setLoginMessage(`Successfully logged ${user.firstName} as Lecturer! Redirecting...`)
                setTimeout(() => router.push("/lecturer"), 2000)
            }
        }   
        else{
            setLoginMessage("Invalid password ❌")
        }
    }

    return(
        <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="flex  flex-col justify-center items-center border-solid border-2 border-blue-600 
        rounded-lg p-3 shadow-xl shadow-gray-500/50 p-2 n-2 bg-white">
            <Link href={"/"}><Image src={"/transparentBlueLogo.png"} alt="Logo" width={300} height={100}></Image></Link>
            <form className="flex flex-col justify-center items-center p-4 gap-4"onSubmit={handleSubmit}>
            
            <div className="flex m-2 flex-col justify-center items-left">
            <label className="text-lg text-left" 
            htmlFor="email">Email</label>
            <input type="email" className="text-xl border-solid border-2 border-blue-600 rounded-lg w-full mb-2" 
            id="email" name="email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => handleFindUser(e.target.value)}></input>

            <label className="text-lg" htmlFor="password">Password</label>
            <input type="password" className="text-xl border-solid border-2 border-blue-600 rounded-lg w-full" 
            id="password"
            onChange={(e) => setPassword(e.target.value)}></input>
            </div>

            <button className="text-{6vh} text-white p-1 hover:cursor-pointer bg-blue-600 hover:bg-blue-500 rounded-xl h-full w-65 text-lg" 
            type="submit">Sign in to account</button>
            </form>

            {loginMessage && (
                <p className={`text-lg text-center max-w-xs font-semibold ${loginMessage.includes("❌") ? "text-red-500" : "text-green-600"}`}>
                    {loginMessage}
                </p>
            )}

            <p className="m-1 text-gray-600">Don&apos;t have an account? <Link className="text-blue-600" href="/signup">Get Access</Link></p>
        </div>
    </div>
    );
    }