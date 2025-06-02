import React from "react";
import Link from "next/link";
import Image from "next/image";

interface SuccessScreenPros{
    applyMoreJobs: () => void;
}

export default function SuccessScreen({applyMoreJobs} : SuccessScreenPros){
    return(
        <>
        <div className="flex flex-col justify-center items-center min-h-screen">
                            <div className="flex flex-col justify-center items-center border-2 p-4 m-2 rounded-lg border-blue-600 bg-white shadow-xl
                            shadow-gray-500/50 ">
                            <Image src={"/transparentBlueLogo.png"} width={500} height={100} alt="logo"></Image>
                            <h1 className="text-xl text-gray-600 w-full text-center">Congrats! Your application have been sent!</h1>
                            <p className="text-lg text-gray-600  rounded-2xl text-center">In the meantime, apply for more jobs 
                            <Link className="text-xl text-blue-600" href="/tutor" onClick={applyMoreJobs}> here</Link></p>
                            </div>
                        </div>
        </>
    );
}