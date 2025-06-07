import React, { useState, useEffect } from 'react';
import styles from "../styles/sidebar.module.css"
import Header from "../components/header"
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import { useMemo } from "react";
import { userApi, applicationApi, commentApi } from "../services/api";
import { Applicant } from "../types/applicants";

export default function chosenCandidates() {
    
const[comment, setComment] = useState<Record<number, string>>({});
const[sentComment, setSentComment] = useState<{ [index: number]: string[] }>({});
const[chosenCandidates, setChosenCandidates] = useState<Applicant[]>([]);
// const [sortedCandidates, setSortedCandidates] = useState<Applicant[]>([]);
const[lecturerData, setLecturerData] = useState<any>();

    const fetchChosen = async () => {
        try {
            const data = await applicationApi.getAllApps();
            const email = localStorage.getItem("emailLoggedIn") || "";
            const lecturer = await userApi.getUserByEmail(email);
            setLecturerData(lecturer)
            const lecturerID = lecturer.lecturerProfile?.lecturerId;

            if (lecturerID === undefined || lecturerID === null) {
                console.warn("Lecturer ID is not available");
                return;
            }

            const chosenApplications: Applicant[] = [];

            data.forEach((app: any) => {
                // Defensive: Ensure chosenBy is a string
                const pairList: string[] = typeof app.chosenBy === "string" ? app.chosenBy.split(",") : [];
                const chosenList: number[] = pairList
                    .map((pair: string) => parseInt(pair.split("_")[0]))
                    .filter((id: number) => !isNaN(id));
                console.log(chosenList)

                if (chosenList.includes(lecturerID)) {
                    const appli: Applicant = {
                    firstName: app.candidate?.user?.firstName,
                    lastName: app.candidate?.user?.lastName,
                    email: app.candidate.user?.email,
                    skill: app.skills,
                    academic: app.academic,
                    prevRoles: app.prevRoles,
                    userAvailability: app.availability,
                    courseName: app.courses?.title,
                    count: app.count,
                    status: 0,
                    applicationId: app.applicationId,
                    chosenBy: app.chosenBy,
                    role: app.role
                    };
                    chosenApplications.push(appli);
                }
            });

            if (chosenApplications.length > 0) {
                console.log("Fetched chosen candidates");
            } else {
                console.log("No candidates found");
            }

            // Idempotent: Only set once with fresh data
            setChosenCandidates(chosenApplications);

        } catch (err) {
            console.log(err);
            console.log("Failed to fetch candidates");
        }
    };

    const handleComment = async (index: number, applicationId: number) => {
        const email = localStorage.getItem("emailLoggedIn") || "";
        const lecturer = await userApi.getUserByEmail(email);
        const lecturerID = lecturer.lecturerProfile?.lecturerId;

        //save the comment
        const newComment = comment[index] || "";
        
        if (newComment !== '') { //check if the comment is not blank or null 
            
            setSentComment(prev => { //add new comment to the list at that index
                return {
                    ...prev,
                    [index]: [...(prev[index] || []), newComment],
                };
            });
        
            try {
                await commentApi.createComment(newComment, applicationId, lecturerID)
            } catch (err) {
                console.error("Failed to update backend:", err);
            }
            
            
            // clear textarea after submit 
            setComment(prev => ({ ...prev, [index]: "" }));
            loadComments()
        }
    };

    const loadComments = async () => {
        try {
        const allComments = await commentApi.getAllComments();

        const commentMap: { [index: number]: string[] } = {};

        // Group by applicationId
        allComments.forEach((cmt: any) => {
            const appId = cmt.application?.applicationId;

            if (!commentMap[appId]) commentMap[appId] = [];

            // Construct comment string with name delimiter
            const commenter = `${cmt.lecturer?.user?.firstName} ${cmt.lecturer?.user?.lastName}`;
            const commentTime = `${cmt.createdAt}`
            commentMap[appId].push(`${commenter}/|theBestDelimiter/|${cmt.content}/|theBestDelimiter/|${commentTime}`);
        });

        setSentComment(commentMap);
        } catch (err) {
        console.error("Failed to fetch comments:", err);
        }
    };

    const handlePreference = async (applicationId: number, newPreference: number) => {
        const updatedData = chosenCandidates.map(app => {
            if (app.applicationId !== applicationId) return app;

            const chosenByStr: string = app.chosenBy || "";
            const pairList: string[] = chosenByStr.split(",");

            // Build map of lecturerId -> value
            const chosenMap: Record<number, number> = {};
            pairList.forEach((pair) => {
                const [idStr, valueStr] = pair.split("_");
                const id = parseInt(idStr);
                const value = parseInt(valueStr);
                if (!isNaN(id)) {
                    chosenMap[id] = !isNaN(value) ? value : 0;
                }
            });

            // Get current lecturer ID
            const lecturerID = lecturerData?.lecturerProfile?.lecturerId;
            if (lecturerID === undefined) {
                console.warn("Lecturer ID missing");
                return app;
            }

            // Update preference
            chosenMap[lecturerID] = newPreference;

            // Rebuild chosenBy string
            const newChosenByStr = Object.entries(chosenMap)
                .map(([id, val]) => `${id}_${val}`)
                .join(",");

            // Return updated application
            return {
                ...app,
                chosenBy: newChosenByStr,
            };
        });

        setChosenCandidates(updatedData);

        // Sync updated application with backend
        try {
            const updatedApp = updatedData.find(app => app.applicationId === applicationId);
            if (updatedApp) {
                await applicationApi.updateCount(applicationId, updatedApp.count, updatedApp.chosenBy || "");
            }
        } catch (err) {
            console.error("Failed to update preference on backend:", err);
        }
    };

    useEffect(() => {
        fetchChosen()
        loadComments()
    }, []);

    const sortedCandidates = useMemo(() => {
        if (!lecturerData?.lecturerProfile?.lecturerId) return [];

        const lecturerID = lecturerData.lecturerProfile.lecturerId;

        const getLecturerPreference = (candidate: Applicant): [number, number] => {
            const chosenBy = candidate.chosenBy || "";
            const match = chosenBy
            .split(",")
            .find((pair) => {
                const [idStr] = pair.split("_");
                return parseInt(idStr) === lecturerID;
            });

            if (!match) return [0, 0]; // no entry → sort first
            const pref = parseInt(match.split("_")[1]);
            return [1, isNaN(pref) ? Infinity : pref]; // has entry → sort by pref
        };

        return [...chosenCandidates].sort((a, b) => {
            const [aHas, aPref] = getLecturerPreference(a);
            const [bHas, bPref] = getLecturerPreference(b);
            return aHas !== bHas ? aHas - bHas : aPref - bPref;
        });
    }, [chosenCandidates, lecturerData]);

    const applicantList = (): React.JSX.Element => {
        return (
            <>
                {sortedCandidates.map((candidate, index) => (
                    candidate ? (
                    <div key={index} className={styles.container}>
                        <ul className = {styles.jobCard}>
                            <div className='flex gap-5 justify-between'>
                            <li><h2>{candidate.firstName} {candidate.lastName} - {candidate.courseName}</h2></li>
                            <li>
                                <h2>Preference: </h2>

                                <select className="rounded-md bg-gray-300 text-xl"
                                    value={
                                        (() => {
                                        const pair = (candidate.chosenBy || "").split(",").find(p => parseInt(p.split("_")[0]) === lecturerData.lecturerProfile?.lecturerId);
                                        const pref = pair ? parseInt(pair.split("_")[1]) : 0;
                                        return pref === 0 ? "" : pref; // Show empty string (--) if pref is 0
                                        })()
                                    }
                                    onChange={(e) => {
                                        // Convert empty string (--) back to 0 when updating preference
                                        const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                                        handlePreference(candidate.applicationId, val);
                                    }}
                                >
                                    <option value="">--</option>
                                    {sortedCandidates.filter(candidate => candidate !== null).map((_, idx) => (
                                        <option key={idx} value={idx + 1}>
                                            {idx + 1}
                                        </option>
                                    ))}
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
                                {(sentComment[candidate.applicationId] || []).map((comment, i) => (
                                    <>
                                        <div key={i} className='mb-3 p-2 w-full break-words rounded-md bg-gray-200'>   
                                            <div className='flex justify-between items-center gap-1'>                 
                                                <div className='flex items-center gap-1'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                                                        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Zm80 0h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                                                    </svg>
                                                    <h3><strong>{comment.split("/|theBestDelimiter/|")[0]}</strong></h3> 
                                                </div>
                                                    <h3><strong>Posted at: </strong>{comment.split("/|theBestDelimiter/|")[2]}</h3> 
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
                                maxLength={250}
                                className="flex-1 border-2 rounded-md border-blue-600 text-lg p-1 w-full resize-none"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setComment(prev => ({ ...prev, [index]: value }));
                                }}
                            ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button onClick={() => handleComment(index , candidate.applicationId)} className="bg-blue-500 hover:bg-sky-700" type="button">Comment</button>
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