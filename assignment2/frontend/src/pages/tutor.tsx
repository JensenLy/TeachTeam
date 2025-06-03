import React, { useState } from 'react';
import styles from "../styles/sidebar.module.css"
import Header from "../components/header"
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import { useContext } from "react";
import { loginContext, LoginContextType } from "@/contexts/LoginContext";
import { JobInfo } from '../types/jobInfo';
import SuccessScreen from '@/components/successScreen';

export default function Tutor() {
    
    const[skill, setSkill] = useState<string>("")
    const[academic, setAcademic] = useState<string>("")
    const[prevRoles, setPrevRoles] = useState<string>("")
    const[userAvailability, setUserAvailability] = useState<string>("")
    const[successfullySubmittedForm, setSuccessfullySubmittedForm] = useState<boolean>(false)
    const[screenState, setScreenState] = useState<boolean>(true)
    const[courseCodeAppliedTo, setcourseCodeAppliedTo] = useState<string>("")
    const context = useContext(loginContext) as LoginContextType;

    interface ApplicationData{
        firstName: string
        lastName: string
        email: string
        skill: string
        academic: string
        prevRoles?: string //optional
        userAvailability: string,
        courseName: string
        count: number
        comment: string[]
    }

    const Job1 : JobInfo = {
        courseTitle: "C++ Programming Studio",
        courseCode: "COSC2804",
        location: "Melbourne CBD",
        description: "C++ Programming Studio is an intermediate studio-based course that focuses on the further acquisition and development of technical and professional skills for computing. The studio-based approach provides an authentic problem setting where theory and practice of computer architecture are blended. In this course you will develop programming principles, skills and practices for modern software development, continuing the study of design, development and testing from previous courses. These learning outcomes will be achieved by developing a medium-sized real-world application.",
        requirement: "COSC2802 C++ Programming Bootcamp (Course ID 054080)",
        dayPosted: 1,
    }

    const Job2 : JobInfo  = {
        courseTitle: "C++ Programming Bootcamp",
        courseCode: "COSC2802",
        location: "Melbourne CBD",
        description: "C++ Programming Bootcamp builds on Java Programming Bootcamp, in a bootcamp style, i.e. in a focussed mode over a period of 5 or 6 weeks. This course covers more advanced algorithms. This course serves as a pre-requisite for more specialized courses that require programming.",
        requirement: "COSC2801 Java Programming Bootcamp (Course ID 054079)",
        dayPosted: 6,
    }

    const Job3 : JobInfo  = {
        courseTitle: "Algorithms and Analysis",
        courseCode: "COSC2123",
        location: "Melbourne CBD",
        description: "The main objective of this course is for you to acquire the tools and techniques necessary to propose practical algorithmic solutions to real-world problems which still allow strong theoretical bounds on time and space usage. You will study a broad variety of important and useful algorithms and data structures in different areas of applications, and will concentrate on fundamental algorithms. You will spend a significant time on each algorithm to understand its essential characteristics and to respect its subtleties.",
        requirement: "COSC2288 / COSC2391 / COSC2440 / COSC2684 / COSC2786 - Further Programming (Course ID 014052) OR COSC2802 - Programming Bootcamp 2 (Course ID 054080) OR COSC1076 / COSC2082 / COSC2136 / COSC2696 - Advanced Programming Techniques (Course ID 004068) OR COSC2800 -  IT Studio 2 (Course ID 054075) OR EEET2482 - Software Engineering Design (Course ID 038296) OR MATH2393- Engineering Mathematics (Course ID 054543)",
        dayPosted: 4,
    }

    const Job4 : JobInfo  = {
        courseTitle: "Full Stack Development",
        courseCode: "COSC2390",
        location: "Bundoora Campus",
        description: "Full Stack Development provides a range of enabling skills for independent development of small to medium-scale industry standard web applications. These skills will equip you to be ready for commercial development and to meet the demand of small to medium sized organisations such as start-ups, small businesses, and other ventures.",
        requirement: "No Prerequisites",
        dayPosted: 17,
    }

    const Job5 : JobInfo  = {
        courseTitle: "Math For Computing 1",
        courseCode: "COSC9301",
        location: "Melbourne CBD",
        description: "Mathematics for Computing 1 provides a foundation for Computer Science. Many other areas of Computer Science require the ability to work with concepts from discrete structures, which include topics such asset theory, integers, functions, relations, logic, proofs, and graph theory. The material in discrete structures is pervasive in the areas of data structures and algorithms but appears elsewhere in Computer Science as well.",
        requirement: "No Prerequisites",
        dayPosted: 7,
    }

    const Job6 : JobInfo  = {
        courseTitle: "Software Engineering Fundamentals",
        courseCode: "COSC9921",
        location: "Bundoora Campus",
        description: "This course is designed to provide you opportunity to gain knowledge and skills necessary to analyse, design and implement complex software engineering projects.",
        requirement: "No Prerequisites",
        dayPosted: 11,
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //prevent the browser from refreshing
        
        //take the name and email from sign in/up data, the others from the input field. 
        const userSignUpData: ApplicationData = {
          firstName: context.firstNameLogedIn,
          lastName: context.lastNameLogedIn,
          email: context.emailLogedIn,
          skill: skill,
          academic: academic,
          prevRoles: prevRoles,
          userAvailability: userAvailability,
          courseName: courseCodeAppliedTo, //take course name from swapScreen
          count: 0,    //initialise the vote count
          comment: []  //initialise the comment array 
        }   

        setPrevRoles("") //clear prevRoles when submitting 
        
        //get data from local storage, set it to an empty array if null
        const existingApplications: ApplicationData[] = JSON.parse((localStorage.getItem("ApplicationData") || "[]" ))
        existingApplications.push(userSignUpData) //add the new submission to the array 
        
        //save it back to local storage 
        localStorage.setItem("ApplicationData", JSON.stringify(existingApplications))
        setSuccessfullySubmittedForm(true) //this is used to trigger the "congrats" screen 
    }

    // swap (or switch or whatever) between the jobs card and the form 
    const swapScreen = (e: React.MouseEvent<HTMLButtonElement>, programCode?: string) => {    
        e.preventDefault(); //same as above, prevent refreshing 
        if(typeof programCode !== "undefined"){ //set the program code for the form if there's none 
            setcourseCodeAppliedTo(programCode)
        }
        setScreenState(!screenState); //swap back and forth between screens (false is the job cards, true is the form)
    }

    return (
        <>
        <div className="hidden lg:flex"><Header/></div>
        <div className={styles.wrapper}>
            <Sidebar/>
            <div className={styles.mainContent}>
                {screenState ? (//swapScreen changes screenState which is used for this
                <>
                <div className={styles.container}>
                    <ul className = {styles.jobCard}>
                        <li><h2>{Job1.courseTitle}</h2></li>

                        {/* trigger the swap screen in this button, will be the same for other jobs below */}
                        <button className="bg-blue-500 hover:bg-sky-700" type="button" onClick={(e) => {swapScreen(e, Job1.courseTitle)}}>Apply Now!</button>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M520-120v-80h80v80h-80Zm-80-80v-200h80v200h-80Zm320-120v-160h80v160h-80Zm-80-160v-80h80v80h-80Zm-480 80v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm360-280v-80h80v80h-80ZM180-660h120v-120H180v120Zm-60 60v-240h240v240H120Zm60 420h120v-120H180v120Zm-60 60v-240h240v240H120Zm540-540h120v-120H660v120Zm-60 60v-240h240v240H600Zm80 480v-120h-80v-80h160v120h80v80H680ZM520-400v-80h160v80H520Zm-160 0v-80h-80v-80h240v80h-80v80h-80Zm40-200v-160h80v80h80v80H400Zm-190-90v-60h60v60h-60Zm0 480v-60h60v60h-60Zm480-480v-60h60v60h-60Z"/></svg>
                            <h3>{Job1.courseCode}</h3>
                        </li>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
                            <h3>Posted {Job1.dayPosted} day(s) ago.</h3>
                        </li>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                            <h3>{Job1.location}</h3>
                        </li>

                        <li><p><strong>Description:</strong> {Job1.description}</p></li>

                        <li><p><strong>Requirement:</strong> {Job1.requirement}</p></li>
                    </ul>
                </div>
                <div className={styles.container}>
                    <ul className = {styles.jobCard}>
                        <li><h2>{Job2.courseTitle}</h2></li>

                        <button className="bg-blue-500 hover:bg-sky-700" type="button" onClick={(e) => {swapScreen(e, Job2.courseTitle)}}>Apply Now!</button>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M520-120v-80h80v80h-80Zm-80-80v-200h80v200h-80Zm320-120v-160h80v160h-80Zm-80-160v-80h80v80h-80Zm-480 80v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm360-280v-80h80v80h-80ZM180-660h120v-120H180v120Zm-60 60v-240h240v240H120Zm60 420h120v-120H180v120Zm-60 60v-240h240v240H120Zm540-540h120v-120H660v120Zm-60 60v-240h240v240H600Zm80 480v-120h-80v-80h160v120h80v80H680ZM520-400v-80h160v80H520Zm-160 0v-80h-80v-80h240v80h-80v80h-80Zm40-200v-160h80v80h80v80H400Zm-190-90v-60h60v60h-60Zm0 480v-60h60v60h-60Zm480-480v-60h60v60h-60Z"/></svg>
                            <h3>{Job2.courseCode}</h3>
                        </li>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
                            <h3>Posted {Job2.dayPosted} day(s) ago.</h3>
                        </li>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                            <h3>{Job2.location}</h3>
                        </li>

                        <li><p><strong>Description:</strong> {Job2.description}</p></li>

                        <li><p><strong>Requirement:</strong> {Job2.requirement}</p></li>
                    </ul>
                </div>
                <div className={styles.container}>
                    <ul className = {styles.jobCard}>
                        <li><h2>{Job3.courseTitle}</h2></li>

                        <button className="bg-blue-500 hover:bg-sky-700" type="button" onClick={(e) => {swapScreen(e, Job3.courseTitle)}}>Apply Now!</button>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" 
                            width="24px" fill="#7f8992"><path d="M520-120v-80h80v80h-80Zm-80-80v-200h80v200h-80Zm320-120v-160h80v160h-80Zm-80-160v-80h80v80h-80Zm-480 80v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm360-280v-80h80v80h-80ZM180-660h120v-120H180v120Zm-60 60v-240h240v240H120Zm60 420h120v-120H180v120Zm-60 60v-240h240v240H120Zm540-540h120v-120H660v120Zm-60 60v-240h240v240H600Zm80 480v-120h-80v-80h160v120h80v80H680ZM520-400v-80h160v80H520Zm-160 0v-80h-80v-80h240v80h-80v80h-80Zm40-200v-160h80v80h80v80H400Zm-190-90v-60h60v60h-60Zm0 480v-60h60v60h-60Zm480-480v-60h60v60h-60Z"/></svg>
                            <h3>{Job3.courseCode}</h3>
                        </li>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
                            <h3>Posted {Job3.dayPosted} day(s) ago.</h3>
                        </li>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                            <h3>{Job3.location}</h3>
                        </li>

                        <li><p><strong>Description:</strong> {Job3.description}</p></li>

                        <li><p><strong>Requirement:</strong> {Job3.requirement}</p></li>
                    </ul>
                </div>
                <div className={styles.container}>
                    <ul className = {styles.jobCard}>
                        <li><h2>{Job4.courseTitle}</h2></li>

                        <button className="bg-blue-500 hover:bg-sky-700" type="button" onClick={(e) => {swapScreen(e, Job4.courseTitle)}}>Apply Now!</button>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" 
                            width="24px" fill="#7f8992"><path d="M520-120v-80h80v80h-80Zm-80-80v-200h80v200h-80Zm320-120v-160h80v160h-80Zm-80-160v-80h80v80h-80Zm-480 80v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm360-280v-80h80v80h-80ZM180-660h120v-120H180v120Zm-60 60v-240h240v240H120Zm60 420h120v-120H180v120Zm-60 60v-240h240v240H120Zm540-540h120v-120H660v120Zm-60 60v-240h240v240H600Zm80 480v-120h-80v-80h160v120h80v80H680ZM520-400v-80h160v80H520Zm-160 0v-80h-80v-80h240v80h-80v80h-80Zm40-200v-160h80v80h80v80H400Zm-190-90v-60h60v60h-60Zm0 480v-60h60v60h-60Zm480-480v-60h60v60h-60Z"/></svg>
                            <h3>{Job4.courseCode}</h3>
                        </li>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
                            <h3>Posted {Job4.dayPosted} day(s) ago.</h3>
                        </li>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                            <h3>{Job4.location}</h3>
                        </li>

                        <li><p><strong>Description:</strong> {Job4.description}</p></li>

                        <li><p><strong>Requirement:</strong> {Job4.requirement}</p></li>
                    </ul>
                </div>
                <div className={styles.container}>
                    <ul className = {styles.jobCard}>
                        <li><h2>{Job5.courseTitle}</h2></li>

                        <button className="bg-blue-500 hover:bg-sky-700" type="button" onClick={(e) => {swapScreen(e, Job5.courseTitle)}}>Apply Now!</button>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" 
                            width="24px" fill="#7f8992"><path d="M520-120v-80h80v80h-80Zm-80-80v-200h80v200h-80Zm320-120v-160h80v160h-80Zm-80-160v-80h80v80h-80Zm-480 80v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm360-280v-80h80v80h-80ZM180-660h120v-120H180v120Zm-60 60v-240h240v240H120Zm60 420h120v-120H180v120Zm-60 60v-240h240v240H120Zm540-540h120v-120H660v120Zm-60 60v-240h240v240H600Zm80 480v-120h-80v-80h160v120h80v80H680ZM520-400v-80h160v80H520Zm-160 0v-80h-80v-80h240v80h-80v80h-80Zm40-200v-160h80v80h80v80H400Zm-190-90v-60h60v60h-60Zm0 480v-60h60v60h-60Zm480-480v-60h60v60h-60Z"/></svg>
                            <h3>{Job5.courseCode}</h3>
                        </li>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
                            <h3>Posted {Job5.dayPosted} day(s) ago.</h3>
                        </li>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                            <h3>{Job5.location}</h3>
                        </li>

                        <li><p><strong>Description:</strong> {Job5.description}</p></li>

                        <li><p><strong>Requirement:</strong> {Job5.requirement}</p></li>
                    </ul>
                </div>
                <div className={styles.container}>
                    <ul className = {styles.jobCard}>
                        <li><h2>{Job6.courseTitle}</h2></li>

                        <button className="bg-blue-500 hover:bg-sky-700" type="button" onClick={(e) => {swapScreen(e, Job6.courseTitle)}}>Apply Now!</button>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" 
                            width="24px" fill="#7f8992"><path d="M520-120v-80h80v80h-80Zm-80-80v-200h80v200h-80Zm320-120v-160h80v160h-80Zm-80-160v-80h80v80h-80Zm-480 80v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm360-280v-80h80v80h-80ZM180-660h120v-120H180v120Zm-60 60v-240h240v240H120Zm60 420h120v-120H180v120Zm-60 60v-240h240v240H120Zm540-540h120v-120H660v120Zm-60 60v-240h240v240H600Zm80 480v-120h-80v-80h160v120h80v80H680ZM520-400v-80h160v80H520Zm-160 0v-80h-80v-80h240v80h-80v80h-80Zm40-200v-160h80v80h80v80H400Zm-190-90v-60h60v60h-60Zm0 480v-60h60v60h-60Zm480-480v-60h60v60h-60Z"/></svg>
                            <h3>{Job6.courseCode}</h3>
                        </li>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
                            <h3>Posted {Job6.dayPosted} day(s) ago.</h3>
                        </li>

                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                            <h3>{Job6.location}</h3>
                        </li>

                        <li><p><strong>Description:</strong> {Job6.description}</p></li>

                        <li><p><strong>Requirement:</strong> {Job6.requirement}</p></li>
                    </ul>
                </div>
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
                            onChange={(e) => {setSkill(e.target.value)}} //updates the value on typing, same for the other textarea. 
                            required></textarea>

                            <textarea placeholder="Academic Credentials" className="flex-1 border-2 rounded-md border-blue-600 text-lg p-1 w-full"
                            name="academic" 
                            onChange={(e) => {setAcademic(e.target.value)}}
                            required></textarea>

                            <textarea placeholder="Previous Roles (Optional)" className="flex-1 border-2 rounded-md border-blue-600 text-lg p-1 w-full"
                            name="prevRoles" 
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