import React, { useState, useEffect } from 'react';
import styles from "../styles/sidebar.module.css"
import Header from "../components/header"
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import { useContext } from "react";
import { LoginContext, LoginContextType } from "@/contexts/LoginContext";

export default function Lecturer() {
    
const[comment, setComment] = useState<Record<number, string>>({});
const[sentComment, setSentComment] = useState<{ [index: number]: string[] }>({});
// const[chosenCandidates, setChosenCandidates] = useState<{ [index: number]: boolean }>({});
const[candidateArray, setCandidateArray] = useState<ApplicationData[]>([]);
const{lastNameLoggedIn, firstNameLoggedIn} = useContext(LoginContext) as LoginContextType;

interface ApplicationData{
    firstName: string
    lastName: string
    email: string
    skill: string
    academic: string
    prevRoles: string
    userAvailability: string
    courseName: string
    comment?: string[]
    preference?: number
}

    const handleComment = (index: number) => {
        //we saved the commenter's name by putting it straight into the comment string,
        //seperated by a delimiter: "/|theBestDelimiter/|" (which will be used later for split)

        //save the comment with name 
        const newComment = `${firstNameLoggedIn} ${lastNameLoggedIn}/|theBestDelimiter/|${comment[index]}` || "";
        
        if (newComment !== `${firstNameLoggedIn} ${lastNameLoggedIn}/|theBestDelimiter/|`) { //check if the comment is not blank or null 
            
            setSentComment(prev => { //add new comment to the list at that index
                return {
                    ...prev,
                    [index]: [...(prev[index] || []), newComment],
                };
            });
        
            //Get applicants' data from local storage
            const candidates = JSON.parse(localStorage.getItem("ApplicationData") || "{}");
        
            if (
                //check if the candidates at that index exists 
                candidates[index] 
            ) {
                //check if there's any comment value (it is optional in the interface), if not initialise with an empty array
                if (!candidates[index].comment) { 
                    candidates[index].comment = [];
                }
                //add new comment to the array
                candidates[index].comment.push(newComment); 
                //save it back to local storage
                localStorage.setItem("ApplicationData", JSON.stringify(candidates)); 

                const email = localStorage.getItem("emailLoggedIn") || "[]"; //get email
                //get lecturer's chosen candidates from local storage
                const storedLecturer: ApplicationData[] =  JSON.parse(localStorage.getItem(email) || "{}");

                //same process as above but this time save to the lecuter's data on local storage 
                if (storedLecturer[index]) {   
                    if (!storedLecturer[index].comment) {
                        storedLecturer[index].comment = [];
                    }
                    storedLecturer[index].comment.push(newComment);
                    
                    //send the newly updated lecturer data to local storage
                    localStorage.setItem(email, JSON.stringify(storedLecturer));  
                }
            }
    
            // clear textarea after submit 
            setComment(prev => ({ ...prev, [index]: "" }));
        }
    };

    const handlePreference = (index: number, newPreference: number) => {
        setCandidateArray(prev => { //updating the candidateArray
          const updated = [...prev]; //clone the current state array
          if (updated[index]) { //check if that candidate exists (they should)
            updated[index].preference = newPreference; //update the new preference number at that index
            
            const email = localStorage.getItem("emailLoggedIn") || "[]"; //get email 
            const storedLecturer = JSON.parse(localStorage.getItem(email) || "[]"); //get lecturer's data 
            if (Array.isArray(storedLecturer)) {    
              storedLecturer[index].preference = newPreference; //also update the new preference number to the storedLecturer 
              localStorage.setItem(email, JSON.stringify(storedLecturer)); //save it to lecturer's data on local storage
            }
          }
          return updated;
        });
      };

    useEffect(() => {
        const email = localStorage.getItem("emailLoggedIn") || "[]"; //get email 
        const storedLecturer: ApplicationData[] = JSON.parse(localStorage.getItem(email) || "{}"); //get lecturer's data 
    
        if (storedLecturer && Array.isArray(storedLecturer)) { //check if storedLecturer exists and is an array 
            const commentMap: { [index: number]: string[] } = {}; //map to store candidate's comments
            const chosenMap: { [index: number]: boolean } = {}; //map to store chosen candidates
    
            storedLecturer.forEach((candidate, index: number) => {//loop through the chosen candidates list
                if (candidate) { //mark them as chosen if they are not null
                    chosenMap[index] = true;
    
                    if (Array.isArray(candidate.comment)) {//if that candidate have comments, store it to comment map 
                        commentMap[index] = candidate.comment;
                    }
                }
            });
            
            //set the state with the new data 
            setSentComment(commentMap);
            // setChosenCandidates(chosenMap);
            setCandidateArray([...storedLecturer]);
        }
    }, []);

    const applicantList = (): React.JSX.Element => {
        return (
            <>
                {candidateArray.map((candidate, index) => (
                    candidate ? (
                    <div key={index} className={styles.container}>
                        <ul className = {styles.jobCard}>
                            <div className='flex gap-5 justify-between'>
                            <li><h2>{candidate.firstName} {candidate.lastName} - {candidate.courseName}</h2></li>
                            <li>
                                <h2>Preference: </h2>

                                <select className='rounded-md bg-gray-300 text-xl' value={candidate.preference || ""} onChange={(e) => handlePreference(index, parseInt(e.target.value))}>
                                    {candidateArray
                                        .filter(candidate => candidate !== null)
                                        .map((_, idx) => (
                                        <option key={idx} value={idx + 1}>
                                            {idx + 1}
                                        </option>
                                        ))
                                    }
                                </select>
                            </li>
                            </div>

                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M520-120v-80h80v80h-80Zm-80-80v-200h80v200h-80Zm320-120v-160h80v160h-80Zm-80-160v-80h80v80h-80Zm-480 80v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm360-280v-80h80v80h-80ZM180-660h120v-120H180v120Zm-60 60v-240h240v240H120Zm60 420h120v-120H180v120Zm-60 60v-240h240v240H120Zm540-540h120v-120H660v120Zm-60 60v-240h240v240H600Zm80 480v-120h-80v-80h160v120h80v80H680ZM520-400v-80h160v80H520Zm-160 0v-80h-80v-80h240v80h-80v80h-80Zm40-200v-160h80v80h80v80H400Zm-190-90v-60h60v60h-60Zm0 480v-60h60v60h-60Zm480-480v-60h60v60h-60Z"/></svg>
                                <h3>{candidate.email}</h3>
                            </li>

                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
                                <h3>{candidate.userAvailability}</h3>
                            </li>

                            <li><p><strong>Skill(s):</strong> {candidate.skill}</p></li>

                            <li><p><strong>Academic Credential(s):</strong> {candidate.academic}</p></li>

                            <li><p><strong>Previous Role(s):</strong> {candidate.prevRoles}</p></li>

                            <li><p><strong>Comment(s):</strong></p></li>

                            <div>
                                {(sentComment[index] || []).map((comment, i) => (
                                    <>
                                        <div key={i} className='mb-3 p-2 w-full break-words rounded-md bg-gray-200'>   
                                            <div className='flex gap-1'>                 
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Zm80 0h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                                                
                                                {/* the split process appears here, the name should be
                                                            at the first index after split (unless someone named themself /|theBestDelimiter/|) */}
                                                <h3><strong>{comment.split("/|theBestDelimiter/|")[0]}</strong></h3> 

                                            </div>     
                                            {/*the name should be at the second index after split (unless someone accidently commented /|theBestDelimiter/|) */}
                                            {comment.split("/|theBestDelimiter/|")[1]}
                                        </div>
                                    </>

                                ))}
                            </div>

                            <div key={index}> 
                            <textarea
                                rows={4}
                                placeholder="Type your comment"
                                value={comment[index] || ""}
                                className="flex-1 border-2 rounded-md border-blue-600 text-lg p-1 w-full resize-none"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setComment(prev => ({ ...prev, [index]: value }));
                                }}
                            ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button onClick={() => handleComment(index)} className="bg-blue-500 hover:bg-sky-700" type="button">Comment</button>
                            </div>
                        </ul>
                    </div>
                    ) : null
                ))}
            </>
        );
    };

    return (
        <>
        <div className="hidden lg:flex">
            <Header/>
            </div>
        <div className={styles.wrapper}>
            <Sidebar/>
            <div className={styles.mainContent}><div>{applicantList()}</div></div>
        </div>
        <Footer/>
        </>
    );
}