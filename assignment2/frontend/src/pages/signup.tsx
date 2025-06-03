import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { userApi } from "../services/api";

export default function SignUp(){

const[confirmPassword, setConfirmPassword] = useState<string>("")
const[userRole, setUserRole] = useState<string>("")
const[successfullySubmittedForm, setSuccessfullySubmittedForm] = useState<boolean>(false)
const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password:"",
    role: "",
  });

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (newUser.password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    handleCreateUser(e)
    
    // add new user to local storage
    // localStorage.setItem("UserData", JSON.stringify(userSignUpData))
    setSuccessfullySubmittedForm(true)

}

const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(newUser)
    try {
      console.log(newUser)
      await userApi.createUser(newUser);
    } catch (err) {
      console.log("Failed to add user");
      console.log(err);
    }

  };
  
// if user succesfully made a new account show success
if(successfullySubmittedForm){
  return(
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="flex flex-col justify-center items-center border-2 p-4 m-2 rounded-lg border-blue-600 bg-white shadow-xl
      shadow-gray-500/50 ">
      <Link href={"/"}><Image src={"/transparentBlueLogo.png"} width={500} height={100} alt="logo"></Image></Link>
      <h1 className="text-xl text-gray-600 w-full text-center">Congrats! you&apos;re now signed up</h1>
      <p className="text-lg text-gray-600  rounded-2xl text-center"> <Link className="text-xl text-blue-600" href="/signin">Log in</Link></p>
      </div>
    </div>
  );
}

else{
 return(
   <div className="flex flex-col grow-1 m-2 justify-center items-center min-h-screen">
      <div className="flex justify-center items-center m-4">
        <Link href={"/"}><Image className="" src={"/transparentBlueLogo.png"} width={400} height={0} alt="logo"></Image></Link>
      </div>
    <div className='flex bg-white-400 w-100 ring-2 ring-blue-500/100  rounded-lg shadow-xl shadow-gray-500/50 p-3 bg-white'>

        <form className="flex flex-col justify-center items-center p-4 gap-4"onSubmit={handleSubmit}>

          <div className="flex-1 justify-center items-center w-full">
            <h1 className="text-[3vh] text-center">Create a new account</h1>
            <p className="text-lg text-gray-600 w-full text-center">It&apos;s quick and easy.</p>
            </div>

            <div className="flex flex-row gap-2 justify-center items-center">
            <input placeholder="First Name" className="flex-1 border-2 rounded-md border-blue-600 text-lg p-1 w-full"  
            type="text" 
            name="fname" 
            id="fname"
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} 
            required></input>

            <input placeholder="Last Name" className="flex-1 border-2 rounded-md border-blue-600 text-lg p-1 w-full"  
            type="text" 
            name="fname" 
            id="fname"
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            required></input>
            </div>

            <input className="border-2 rounded-md border-blue-600 text-lg p-1 w-full"
            type="email" 
            name='email' id='email' 
            placeholder='example@email.com' 
            pattern="/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/" 
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required></input>

            <input placeholder="New Password"className="border-2 rounded-md border-blue-600 text-lg p-1 w-full"
            type="password" 
            name="createPassword" 
            minLength={8}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required></input>

            <input placeholder="Confirm Password" className="border-2 rounded-md border-blue-600 text-lg p-1 w-full"
            type="password" 
            name="confirmPassword" 
            minLength={8}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required></input>

            <h2 className="text-lg">Select whichever applies best to you:</h2>
             
            <div className="flex gap-4 justify-center items-center w-full">
            <label htmlFor="tutor" className={  `cursor-pointer ${userRole === "tutor" ? "bg-blue-500 text-white" : "bg-gray-200"} 
            p-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white w-full text-center`}>
            <input
              type="radio"
              id="tutor"
              name="role"
              value="tutor"
              onChange={(e) =>{
                setUserRole(e.target.value)
                setNewUser({ ...newUser, role: e.target.value })
              }}
              checked={userRole === "tutor"}
              className="hidden"
              required></input>Tutor</label>

            <label
              htmlFor="lecturer"
              className={`cursor-pointer ${userRole === "lecturer" ? "bg-blue-500 text-white" : "bg-gray-200"} 
              p-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white w-full text-black text-center`}>
                
              <input type="radio"
                id="lecturer"
                name="role"
                value="lecturer"
                onChange={(e)=>{
                  setUserRole(e.target.value)
                  setNewUser({ ...newUser, role: e.target.value })
                }}
                checked={userRole === "lecturer"}
                className="hidden"
                required></input>Lecturer</label>

            </div>
            <button className="text-{6vh} text-white p-1 hover:cursor-pointer bg-blue-600 hover:bg-blue-500 rounded-lg text-white w-full text-lg" 
            type="submit">Submit</button>
        </form>
    </div>
    </div>
 );  
}
}
