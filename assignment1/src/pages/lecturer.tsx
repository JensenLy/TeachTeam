import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import SideBar from "../components/sidebar";
import styles from "../styles/sidebar.module.css";
import { Applicant } from "./types/applicants";

export default function Lecturer() {
  const [applicationData, setApplicationData] = useState<Applicant[]>([]);
  const [availibility, setAvailibility] = useState<string>("");
  const [tutorName, setTutorName] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [skillSets, setSkillSets] = useState<string>("");
  const [chosenCandidates, setChosenCandidates] = useState<{ [index: number]: boolean }>({});

  // Load application data and lecturer data from local storage
  useEffect(() => {
    const email = localStorage.getItem("emailLogedIn") || "[]";  //get the current user's email from local storage
    const data = JSON.parse(localStorage.getItem("ApplicationData") || "[]").filter(Boolean); //get all of the applicant's data from local storage
    setApplicationData(data); //set the useState

    //load all of the chosenCandidates from lecturer's data (identified by email) to storedLecturer
    const storedLecturer = JSON.parse(localStorage.getItem(email) || "{}"); 

    //check if storedLecturer exists and if it is an array
    if (storedLecturer && Array.isArray(storedLecturer)) {
      //create a map of which candidates is chosen by index 
      const chosenMap: { [index: number]: boolean } = {};
    
      //loop through the storedLecturer data for candidates 
      storedLecturer.forEach((candidate: any, index: number) => {
        //mark them as chosen if a candidate exists at this index
        if (candidate !== null) {
          chosenMap[index] = true;
        }
      });

      //update the state of chosen candidates
      setChosenCandidates(chosenMap);
    }
  }, []);

  //status in this means: "0 for not chosen", "1 for most chosen", "2 for least chosen", "3 for others"
  //filter applicants based on selected criteria
  const filteredApplicants = applicationData
    .map((app, index) => ({
      ...app,
      originalIndex: index,
      status: 3, //default to "others"
    }))
    .filter((app) => {
      const fullName = `${app.firstName} ${app.lastName}`;
      return (
        (courseName === "" || app.courseName === courseName) &&
        (availibility === "" || app.userAvailability === availibility) &&
        (tutorName === "" || fullName === tutorName) &&
        (skillSets === "" || app.skill === skillSets)
      );
    });

  //categorise by count
  const zeroCount = filteredApplicants.filter((app) => app.count === 0);
  const nonZero = filteredApplicants.filter((app) => app.count > 0);

  nonZero.sort((a, b) => b.count - a.count); //sort by count

  nonZero.forEach((app, i) => {
    if (i === 0) app.status = 1; // most chosen
    else if (i === nonZero.length - 1) app.status = 2; // least chosen (not zero)
    else app.status = 3; // others
  });
  zeroCount.forEach((app) => (app.status = 0)); // not chosen

  //merge all categorised applicants into 1 array, in order from most chosen -> least chosen -> others -> not chosen
  const orderedApplicants = [ 
    ...nonZero.filter((app) => app.status === 1),
    ...nonZero.filter((app) => app.status === 2),
    ...nonZero.filter((app) => app.status === 3),
    ...zeroCount,
  ];

  //different styling for different status 
  const getStatusClass = (status: number) => {
    switch (status) {
      case 1:
        return "flex justify-center text-lg text-black font-bold rounded-xl border border-black bg-yellow-500"; 
      case 2:
        return "flex justify-center text-lg text-black font-bold rounded-xl border border-black bg-gray-400";
      case 3:
        return "flex justify-center text-lg text-black font-bold rounded-xl border border-black bg-gray-200"; 
      default:
        return "flex justify-center text-lg text-black font-bold rounded-xl border border-black bg-blue-300"; 
    }
  };

  //handle the choosing process
  const handleChooseCandidate = (index: number) => {
    const email = localStorage.getItem("emailLogedIn") || "[]";  //get the user's email, 
    setChosenCandidates((prev) => { //update setChosenCandidates based on the current state
      //get the chosen candidates or return an empty array if null 
      let storedLecturer = JSON.parse(localStorage.getItem(email) || "[]"); 
      
      //initialise if it is not an array 
      if (!Array.isArray(storedLecturer)) {
        storedLecturer = new Array(applicationData.length).fill(null);
      }
      
      const isSelected = !prev[index]; //selection status 
      const updated = { ...prev, [index]: isSelected }; //updated selection status 
  
      //update count
      const updatedData = [...applicationData]; //clone the current data
      const oldCount = applicationData[index]?.count || 0; //get the current vote count or 0 if undefied
      updatedData[index] = {
        ...updatedData[index],
        count: isSelected ? oldCount + 1 : Math.max(0, oldCount - 1), //increment if chosen, decrement if de-selected
      };

      //update the state with the new data
      setApplicationData(updatedData);

      //save the new data to storedLecturer
      storedLecturer[index] = isSelected ? updatedData[index] : null;
      
      //save the new data to local storage both on the lecturer side and globally 
      localStorage.setItem(email, JSON.stringify(storedLecturer));
      localStorage.setItem("ApplicationData", JSON.stringify(updatedData));
  
      return updated;
    });
  };

  return (
    <div className="min-h-screen">
      <div className="hidden lg:flex">
        <Header />
      </div>
      <div className={styles.wrapper}>
        <SideBar />
        <div className={styles.mainContent}>
          {/* Filter Section */}
          <div className="flex max-w-[99%] m-3 flex-row flex-wrap bg-white rounded-lg p-2 justify-center items-center gap-4">
            <label className="text-xl text-blue-600">Course Name:</label>
            <select
              id="filter-course"
              className="w-50 border-blue-600 rounded-lg p-1 border-2 bg-white text-blue-500"
              onChange={(e) => setCourseName(e.target.value)}
            >
              <option></option>
              {[...new Set(applicationData.map((app) => app.courseName))].map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>

            <label className="text-xl text-blue-600">Tutor Name:</label>
            <select
              className="border-blue-600 rounded-lg p-1 border-2 bg-white text-blue-500"
              id="filter-name"
              onChange={(e) => setTutorName(e.target.value)}
            >
              <option></option>
              {[...new Set(applicationData.map((app) => `${app.firstName} ${app.lastName}`))].map((fullName, index) => (
                <option key={index} value={fullName}>
                  {fullName}
                </option>
              ))}
            </select>

            <label className="text-xl text-blue-600">Availability:</label>
            <select
              id="filter-availability"
              className="border-blue-600 rounded-lg p-1 border-2 bg-white text-blue-500"
              onChange={(e) => setAvailibility(e.target.value)}
            >
              <option></option>
              <option>Part-Time</option>
              <option>Full-Time</option>
            </select>

            <label className="text-xl text-blue-600">Skill Set:</label>
            <select
              className="truncate overflow-hidden border-blue-600 rounded-lg p-1 border-2 bg-white text-blue-500"
              id="filter-skills"
              onChange={(e) => setSkillSets(e.target.value)}
            >
              <option></option>
              {[...new Set(applicationData.map((app) => app.skill))].map((skillSet, index) => (
                <option
                  className="truncate overflow-hidden"
                  key={index}
                  value={skillSet}
                >
                  {skillSet.length > 20 ? `${skillSet.slice(0, 30)}...` : skillSet}
                </option>
              ))}
            </select>
          </div>

          {/* Candidate List */}
          {orderedApplicants.map((candidate) => (
            <div className={styles.container} key={candidate.originalIndex}>
              <div className={getStatusClass(candidate.status)}>
                {candidate.status === 0 && "Not Selected By Anyone Yet"}
                {candidate.status === 1 && `Most Chosen - ${candidate.count} vote`}
                {candidate.status === 2 && `Least Chosen - ${candidate.count} vote`}
                {candidate.status === 3 && `${candidate.count} vote`}
              </div>
              <ul className={styles.jobCard}>
                
                <li><h2>{candidate.firstName} {candidate.lastName} - {candidate.courseName}</h2></li>

                <button
                  onClick={() => handleChooseCandidate(candidate.originalIndex)}
                  className={`px-4 py-2 rounded-md text-white ${
                    chosenCandidates[candidate.originalIndex]
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-500 hover:bg-sky-700"
                  }`}
                  type="button"
                >
                  {chosenCandidates[candidate.originalIndex] ? "Added !!!" : "Add as a candidate"}
                </button>

                <li><h3>{candidate.email}</h3></li>

                <li><h3>{candidate.userAvailability}</h3></li>

                <li><p><strong>Skill(s):</strong> {candidate.skill}</p></li>

                <li><p><strong>Academic Credential(s):</strong> {candidate.academic}</p></li>

                <li><p><strong>Previous Role(s):</strong> {candidate.prevRoles}</p></li>
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
