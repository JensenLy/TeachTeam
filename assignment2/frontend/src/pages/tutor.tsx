import React, { useEffect, useState } from 'react';
import styles from "../styles/sidebar.module.css"
import Header from "../components/header"
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import { useContext } from "react";
import { LoginContext, LoginContextType } from "@/contexts/LoginContext";
import SuccessScreen from '@/components/successScreen';
import { courseApi, Course, candidateApi, userApi, Application, applicationApi } from "../services/api";

export default function Tutor() {
    
    const[skill, setSkill] = useState<string>("")
    const[academic, setAcademic] = useState<string>("")
    const[prevRoles, setPrevRoles] = useState<string>("")
    const[userAvailability, setUserAvailability] = useState<string>("")
    const[successfullySubmittedForm, setSuccessfullySubmittedForm] = useState<boolean>(false)
    const[screenState, setScreenState] = useState<boolean>(true)
    const context = useContext(LoginContext) as LoginContextType;

    const [course, setCourse] = useState({
        courseId: 0,
        title: "",
        description: "",
        courseCode: "",
        type: "",
        location: "",
        createdAt: "", 
        requirement: "",
    });
    const [courses, setCourses] = useState<Course[]>([]);

    const fetchCourses = async () => {
        try {
        const data = await courseApi.getAllCourses();
        setCourses(data);
        } catch (err) {
        console.log("Failed to fetch users 0", err);
        } 
    };

    useEffect(() => {fetchCourses()}, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //prevent the browser from refreshing

        createApplication();

        setPrevRoles("") //clear prevRoles when submitting 

        setSuccessfullySubmittedForm(true) //this is used to trigger the "congrats" screen 
    }

    // swap (or switch or whatever) between the jobs card and the form 
    const swapScreen = (e: React.MouseEvent<HTMLButtonElement>, index?: number) => {    
        e.preventDefault(); //same as above, prevent refreshing 
        if(typeof index !== "undefined"){ //set the program code for the form if there's one 
            setCourse(courses[index])
        }
        setScreenState(!screenState); //swap back and forth between screens (false is the job cards, true is the form)
    }

    const createApplication = async () => {
        try {
            //get candidate id by email in localstorage 
            const user = await userApi.getUserByEmail(context.emailLoggedIn);
            const candidate = await candidateApi.getCandidateByUserID(user);
            const candidateId = candidate.id;

            //check if the candidate is already applied for the course 
            const alreadyApplied = await applicationApi.hasApplied(candidateId, course.courseId)
            
            if(alreadyApplied){
                alert("You have already applied for this course")
                return;
            }

            //the data of application will be set here 
            const application: Application = {
                candidateId,
                courseId: course.courseId,
                skills: skill,
                academic: academic,
                prevRoles: prevRoles,
                availability: userAvailability,
                role: course.type as "Tutor" | "Lab Assistance",
            };

            console.log(application)
            await applicationApi.createApp(application); //add the application to the database 
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
        <div className="hidden lg:flex"><Header/></div>
        <div className={styles.wrapper}>
            <Sidebar/>
            <div className={styles.mainContent}>
                {screenState ? (//swapScreen changes screenState which is used for this
                <>
                {courses.map((course, index) => (
                    <div key={course.courseId || index} className={styles.container}>
                        <ul className = {styles.jobCard}>
                            <li><h2>{course.title} - {course.type}</h2></li>

                            {/* trigger the swap screen in this button, will be the same for other jobs below */}
                            <button className="bg-blue-500 hover:bg-sky-700" type="button" onClick={(e) => {swapScreen(e, index)}}>Apply Now!</button>

                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M520-120v-80h80v80h-80Zm-80-80v-200h80v200h-80Zm320-120v-160h80v160h-80Zm-80-160v-80h80v80h-80Zm-480 80v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm360-280v-80h80v80h-80ZM180-660h120v-120H180v120Zm-60 60v-240h240v240H120Zm60 420h120v-120H180v120Zm-60 60v-240h240v240H120Zm540-540h120v-120H660v120Zm-60 60v-240h240v240H600Zm80 480v-120h-80v-80h160v120h80v80H680ZM520-400v-80h160v80H520Zm-160 0v-80h-80v-80h240v80h-80v80h-80Zm40-200v-160h80v80h80v80H400Zm-190-90v-60h60v60h-60Zm0 480v-60h60v60h-60Zm480-480v-60h60v60h-60Z"/></svg>
                                <h3>{course.courseCode}</h3>
                            </li>

                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
                                <h3>Posted at: {course.createdAt}</h3>
                            </li>

                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                                <h3>{course.location}</h3>
                            </li>

                            <li><p><strong>Description:</strong> {course.description}</p></li>

                            <li><p><strong>Requirement:</strong> {course.requirement}</p></li>
                        </ul>
                    </div>
                ))}
                </>
                ) : (
                    
                <div className="flex grow-1 m-2 justify-center text-black items-center min-h-screen">
                    {successfullySubmittedForm ? ( //if true then show the "congrats" screen, if not show the form 
                        <SuccessScreen applyMoreJobs={() => { //after submitted the form
                            setScreenState(true);
                            setSuccessfullySubmittedForm(false);
                        }}/>
                    ) : (
                    <div className='flex justify-center bg-white-400 w-5/7 lg:w-6/10 min-h-screen ring-2 ring-blue-500/100  rounded-lg shadow-xl shadow-gray-500/50 p-3 bg-white'>
                        <form className="flex flex-col justify-center items-center w-full p-4 gap-4"onSubmit={handleSubmit}>

                        <div className="justify-center items-center w-full">
                            <h1 className="text-[3vh] text-center"><strong>Application form</strong></h1>
                            <p className="text-lg text-gray-600 w-full text-center">It&apos;s quick and easy.</p>
                        </div>
                            <textarea placeholder="Describe your skills" className="flex-1 border-2 rounded-md border-blue-600 text-lg p-1 w-full"
                            name="skill" 
                            maxLength={250}
                            onChange={(e) => {setSkill(e.target.value)}} //updates the value on typing, same for the other textarea. 
                            required></textarea>

                            <textarea placeholder="Academic Credentials" className="flex-1 border-2 rounded-md border-blue-600 text-lg p-1 w-full"
                            name="academic" 
                            maxLength={250}
                            onChange={(e) => {setAcademic(e.target.value)}}
                            required></textarea>

                            <textarea placeholder="Previous Roles (Optional)" className="flex-1 border-2 rounded-md border-blue-600 text-lg p-1 w-full"
                            name="prevRoles" 
                            maxLength={250}
                            onChange={(e) => {setPrevRoles(e.target.value)}}></textarea>

                            <h2 className="text-lg">Select your availability:</h2>
                            
                        <div className="flex gap-4 justify-center items-center w-full">
                            <label htmlFor="Part-Time" className={  `cursor-pointer ${userAvailability === "Part-Time" ? "bg-blue-600 text-white" : "bg-gray-200"} 
                            p-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-500 w-full text-center`}>
                            <input
                                type="radio"
                                id="Part-Time"
                                name="availability"
                                value="Part-Time"
                                onChange={(e) =>{
                                setUserAvailability(e.target.value)
                                }}
                                checked={userAvailability === "Part-Time"}
                                className="hidden"
                                required></input>Part-Time</label>

                            <label
                            htmlFor="Full-Time"
                            className={`cursor-pointer ${userAvailability === "Full-Time" ? "bg-blue-600 text-white" : "bg-gray-200"} 
                            p-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-500 w-full text-center`}>
                                
                            <input type="radio"
                                id="Full-Time"
                                name="availability"
                                value="Full-Time"
                                onChange={(e)=>{
                                setUserAvailability(e.target.value)
                                }}
                                checked={userAvailability === "Full-Time"}
                                className="hidden"
                                required></input>Full-Time</label>
                        </div>
                            <button className="text-{6vh} text-white p-1 hover:cursor-pointer bg-blue-600 hover:bg-blue-500 rounded-lg w-full text-lg" 
                            type="submit">Submit</button>
                            
                            {/* swapScreen back to the job cards  */}
                            <button onClick={(e) => {swapScreen(e)}} className="text-red-500 text-lg hover:text-white hover:bg-red-500 rounded-lg p-1">Go Back</button>

                        </form>
                    </div>
                    )}
                </div> )}
            </div>
        </div>
        <Footer/>
        </>
    );
}