import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import SideBar from "../components/sidebar";
import styles from "../styles/sidebar.module.css";
import { Applicant } from "../types/applicants";
import { courseApi, Course, candidateApi, userApi, Application, applicationApi } from "../services/api";

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
          chosenStatus[index] = chosenList.includes(String(userData.lecturerProfile?.lecturerId));
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
  const handleChooseCandidate = async (index: number) => {
    const isSelected = !chosenCandidates[index]; // toggle status

    // Clone state
    const updated = { ...chosenCandidates, [index]: isSelected };
    const updatedData = [...applicationData];
    const app = updatedData[index];
    

    const oldCount = app.count || 0;
    const chosenListStr = app.chosenBy || "";
    const chosenListArr = chosenListStr.split(",").map((id) => parseInt(id)).filter((id) => !isNaN(id));
    
    let newChosenListArr: number[];

    if (isSelected) {
      newChosenListArr = chosenListArr.includes(userID) ? chosenListArr : [...chosenListArr, userID];
    } else {
      newChosenListArr = chosenListArr.filter((id) => id !== userID);
    }

    const newChosenListStr = newChosenListArr.join(",");

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
                  {chosenCandidates[candidate.originalIndex] ? "Chosen !!!" : "Choose this candidate"}
                </button>

                <li><h3>{candidate.email}</h3></li>

                <li><h3>{candidate.userAvailability}</h3></li>

                <li><p><strong>Skill(s):</strong> {candidate.skill}</p></li>

                <li><p><strong>Academic Credential(s):</strong> {candidate.academic}</p></li>

                <li><p><strong>Previous Role(s):</strong> {candidate.prevRoles}</p></li>
                <li><p><strong>Role:</strong>{candidate.role}</p></li>
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
