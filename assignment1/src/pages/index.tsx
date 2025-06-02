import Image from "next/image";
import Footer from "../components/footer";  
import Header from "../components/header"
import Link from "next/link";

export default function Home() {
  return(
    <div className="min-h-screen bg-white">
      <Header/>
        <div className="flex flex-col justify-center bg-white items-center p-4 min-h-full h-100">
          <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl text-center font-bold">Connect. Teach. Grow</h1>
          <p className="text-gray-600 text-center text-lg mt-2">Become a Tutor or find the perfect one - right here.</p>
          <Link href={"/signup"}><button className="hover:bg-blue-500 hover:text-white bg-blue-600 text-lg rounded-xl mt-4 p-1 hover:cursor-pointer px-8 text-white ">Get Started</button></Link>
          </div>
        </div>

      <div className="becomeLecturer bg-gray-50 flex p-4 mt-10 justify-center items-center">
        <div className="flex justify-evenly items-center w-full">
          <div className="flex flex-col gap-3 justify-center items-start">
            <h2 className="text-4xl text-blue-600">Are you a Lecturer?</h2>
            <div className="flex justify-left items-center">
              <p className="max-w-200 text-xl text-gray-600">Welcome to TeachTeam! As a lecturer, you can review tutor applications, select the best candidates, and offer them teaching opportunities. 
              Find qualified tutors to help students succeed and grow your teaching network.</p>
            </div>
            <Link href={"/signup"}><button className="bg-blue-600 text-lg p-1 px-8 rounded-xl text-white hover:cursor-pointer hover:bg-blue-500">Become a Lecturer</button></Link>
          </div>
          <div className="flex justify-center items-center ml-8">
            <Image className="rounded-xl w-full h-auto" src={"/lecturer.jpg"} alt="" width={500} height={100}></Image>
          </div>
        </div>
      </div>

      <div className="becomeLecturer bg-gray-50 flex p-4 mt-15 mb-20 justify-center items-center">
        <div className="flex justify-evenly items-center w-full">
          <div className="flex justify-center items-center m-0">
            <Image className="rounded-xl w-full h-auto mr-8" src={"/tutor.jpg"} alt="" width={500} height={100}></Image>
          </div>
          <div className="flex flex-col gap-3 justify-center items-start">
            <h2 className="text-4xl text-blue-600">Want to become a Tutor?</h2>
            <div className="flex justify-left items-center">
              <p className="max-w-200 text-xl text-gray-600">Welcome to TeachTeam! As a tutor, you can submit your details, set your availability, and start connecting with students who need your expertise. 
              Join today and begin making a difference in students learning journeys.</p>
            </div>
            <Link href={"/signup"}><button className="bg-blue-600 text-lg p-1 px-8 rounded-xl text-white hover:cursor-pointer hover:bg-blue-500">
            Become a Tutor</button></Link>
          </div>
          
        </div>
      </div>

    <Footer/>
    </div>
  );
  }
  
  