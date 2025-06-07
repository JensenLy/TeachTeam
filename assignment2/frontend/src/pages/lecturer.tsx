import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import SideBar from "../components/sidebar";
import styles from "../styles/sidebar.module.css";
import { Applicant } from "../types/applicants";
import { courseApi, Course, candidateApi, userApi, Application, applicationApi } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Lecturer() {
  const [applicationData, setApplicationData] = useState<Applicant[]>([]);
  const [availibility, setAvailibility] = useState<string>("");
  const [tutorName, setTutorName] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [skillSets, setSkillSets] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [chosenCandidates, setChosenCandidates] = useState<{ [index: number]: boolean }>({});
  const [userID, setUserID] = useState<number>(0);

  const fetchApplications = async () => {
    try {
      const data = await applicationApi.getAllApps();
      const email = localStorage.getItem("emailLoggedIn") || "";
      const lecturer = await userApi.getUserByEmail(email);
      const coursesAssigned = lecturer.lecturerProfile?.coursesAssigned;
      const coursesAssignedArr = coursesAssigned ? coursesAssigned.split(",") : [];

      const filteredApplications: Applicant[] = [];

      data.forEach((app: any) => {
        if (coursesAssignedArr.includes(app.courses?.courseId?.toString())) {
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
          filteredApplications.push(appli);
        } else {
          console.log("No course found");
        }
      });

      // Single state update, replaces all previous data
      setApplicationData(filteredApplications);

    } catch (err) {
      console.log(err);
      console.log("Failed to fetch applications 0");
    }
  };

  // initialise 
  useEffect(() => {

    fetchApplications();

  }, []);

  // creating chosen map
  useEffect(() => {
    const initChosen = async () => {
      if (applicationData.length === 0) return;

      try {
        const email = localStorage.getItem("emailLoggedIn") || "";
        const userData = await userApi.getUserByEmail(email);
        setUserID(userData.lecturerProfile?.lecturerId);

        const chosenStatus: { [index: number]: boolean } = {};

        applicationData.forEach((app, index) => {
          const chosenList = app.chosenBy ? app.chosenBy.split(",") : [];
          const idList = chosenList.map((pair) => parseInt(pair.split("_")[0])).filter((id) => !isNaN(id));
          chosenStatus[index] = idList.includes(userData.lecturerProfile?.lecturerId ?? -1);
        });

        setChosenCandidates(chosenStatus);
      } catch (err) {
        console.error("Failed to determine chosen candidates", err);
      }
    };

    initChosen();
}, [applicationData]);

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
        (skillSets === "" || app.skill === skillSets) &&
        (role === "" || app.role === role)
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

  //merge all categorised applicants into 1 array, in order from most chosen -> others -> least chosen -> not chosen
  const orderedApplicants = [ 
    ...nonZero.filter((app) => app.status === 1),
    ...nonZero.filter((app) => app.status === 3),
    ...nonZero.filter((app) => app.status === 2),
    ...zeroCount,
  ];

  const chartData = orderedApplicants.map((app) => ({
    name: `${app.firstName} ${app.lastName} (${app.courseName})`,
    votes: app.count
  }))

  // console.log(chartData)

  //different styling for different status 
  const getStatusClass = (status: number) => {
    switch (status) {
      default:
        return "flex justify-center text-lg text-black font-bold rounded-xl border border-black bg-blue-300"; 
    }
  };

  //handle the choosing process
  const handleChooseCandidate = async (index: number) => {
    const isSelected = !chosenCandidates[index]; // toggle status

    // Clone state
    const updated = { ...chosenCandidates, [index]: isSelected };
    const updatedData = [...applicationData];
    const app = updatedData[index];
    

    const oldCount = app.count || 0;
    const chosenListStr = app.chosenBy || "";
    const chosenMap: Record<number, number> = {}; 

    chosenListStr.split(",").forEach((pair) => {
      const [idStr, prefStr] = pair.split("_");
      const id = parseInt(idStr);
      const pref = parseInt(prefStr);

      if (!isNaN(id)) {
        chosenMap[id] = !isNaN(pref) ? pref : 0;
      }

    });

    // Add or remove current userID from map
    if (isSelected) {

      if (!(userID in chosenMap)) {
        chosenMap[userID] = 0;
      }

    } else {
      delete chosenMap[userID];
    }

    // Rebuild the chosenBy string
    const newChosenListStr = Object.entries(chosenMap)
      .map(([id, pref]) => `${id}_${pref}`)
      .join(",");

    // Update frontend state
    updatedData[index] = {
      ...app,
      count: isSelected ? oldCount + 1 : Math.max(0, oldCount - 1),
      chosenBy: newChosenListStr,
    };
    setApplicationData(updatedData);
    setChosenCandidates(updated);

    // Sync with backend
    try {
      await applicationApi.updateCount(app.applicationId, updatedData[index].count, newChosenListStr);
    } catch (err) {
      console.error("Failed to update backend:", err);
    }
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

            <label className="text-xl text-blue-600">Role:</label>
            <select
              id="filter-type"
              className="w-20 border-blue-600 rounded-lg p-1 border-2 bg-white text-blue-500"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value=""></option>
              <option value="Tutor">Tutor</option>
              <option value="Lab Assistance">Lab Assistance</option>
            </select>
          </div>

            <div className="flex max-w-[99%] m-3 flex-row flex-wrap bg-white rounded-lg p-2 justify-center items-center gap-4">
              <details className="border-blue-600 rounded-lg p-1 border-2 bg-white text-blue-500 w-full">
                  <summary>Applicant Vote Chart</summary>
                <div style={{width:"100%", height:300}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={chartData} margin={{top: 10, right:20, left: 100, bottom:10}} barGap={10} barCategoryGap={10}>
                      <XAxis type="number"/>
                      <YAxis type="category" dataKey="name" width={150} tickMargin={5}/>
                      <Tooltip/>
                      <Bar dataKey="votes" fill="#4299E1"/> 
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </details>
            </div>

          {/* Candidate List */}
          {orderedApplicants.map((candidate) => (
            <div className={styles.container} key={candidate.originalIndex}>
              <div className={getStatusClass(candidate.status)}>
                {candidate.status === 0 && "Not Selected By Anyone Yet"}
                {candidate.status === 1 &&  `${candidate.count} vote`}
                {candidate.status === 2 && ` ${candidate.count} vote`}
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
                  {chosenCandidates[candidate.originalIndex] ? "Chosen !!!" : "Choose this candidate"}
                </button>

                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                    <h3>{candidate.email}</h3>
                </li>

                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
                    <h3>{candidate.userAvailability}</h3>
                </li>

                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7f8992"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z"/></svg>
                    <h3>{candidate.role}</h3>
                </li>

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
