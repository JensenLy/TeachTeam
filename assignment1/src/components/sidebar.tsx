import styles from "../styles/sidebar.module.css"
import React, { useState } from 'react';
import { loginContext } from "@/contexts/LoginContext";
import { useContext } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";

export default function Sidebar() {
    const router = useRouter();
    const currentPath = router.pathname;
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const {setIsLoggedIn, userRole, firstNameLogedIn} = useContext(loginContext)
    const toggleSidebar = () => {
        setIsSidebarCollapsed(prevState => !prevState);
    };

    let greeting:string = ""; 
    // if fitstNameLogedIn is set to be null or undefined the fall back is welcome back!
    if (!firstNameLogedIn){ 
        greeting = "Welcome back!"
    }
    else { 
        greeting = "Hi, " + firstNameLogedIn + "!"
    }

    let isTutor:boolean = true; 
    if (userRole === "Tutor"){ 
        isTutor = true; 
    }
    else if (userRole === "Lecturer") { 
        isTutor = false; 
    }

    return (
        <nav data-testid="sidebar" id={styles.sidebar} className={`${styles.sidebar} ${isSidebarCollapsed ? styles.close : ''}`}>
            <ul>
                <li>
                    <p className={styles.logo}>{greeting}</p>
                    <button data-testid="toggleSideBar" onClick={toggleSidebar} id={styles.toggleBtn} className={isSidebarCollapsed ? styles.rotate : ''}>
                        <svg className='transition-transform duration-150 ease-in-out rotate-0' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m313-480 155 156q11 11 11.5 27.5T468-268q-11 11-28 11t-28-11L228-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T468-692q11 11 11 28t-11 28L313-480Zm264 0 155 156q11 11 11.5 27.5T732-268q-11 11-28 11t-28-11L492-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T732-692q11 11 11 28t-11 28L577-480Z"/></svg>
                    </button>
                </li>
                <li>
                    <Link href="./">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Zm-80 0v-360q0-19 8.5-36t23.5-28l240-180q21-16 48-16t48 16l240 180q15 11 23.5 28t8.5 36v360q0 33-23.5 56.5T720-120H560q-17 0-28.5-11.5T520-160v-200h-80v200q0 17-11.5 28.5T400-120H240q-33 0-56.5-23.5T160-200Zm320-270Z"/></svg>
                    <span>Home Page</span>
                    </Link>
                </li>
                {isTutor ? (
                <li>
                    <Link href="/tutor" className={currentPath === '/tutor' ? styles.activeLink : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M657-121 544-234l56-56 57 57 127-127 56 56-183 183Zm-537 1v-80h360v80H120Zm0-160v-80h360v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Z"/></svg>
                    <span>Apply for roles</span>
                    </Link>
                </li>
                ) : (
                    <>
                <li>
                    <Link href="/lecturer" className={currentPath === '/lecturer' ? styles.activeLink : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z"/></svg>
                    <span>Applicants</span>
                    </Link>
                </li>

                <li>
                    <Link href="/chosenCandidates" className={currentPath === '/chosenCandidates' ? styles.activeLink : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m221-313 142-142q12-12 28-11.5t28 12.5q11 12 11 28t-11 28L250-228q-12 12-28 12t-28-12l-86-86q-11-11-11-28t11-28q11-11 28-11t28 11l57 57Zm0-320 142-142q12-12 28-11.5t28 12.5q11 12 11 28t-11 28L250-548q-12 12-28 12t-28-12l-86-86q-11-11-11-28t11-28q11-11 28-11t28 11l57 57Zm339 353q-17 0-28.5-11.5T520-320q0-17 11.5-28.5T560-360h280q17 0 28.5 11.5T880-320q0 17-11.5 28.5T840-280H560Zm0-320q-17 0-28.5-11.5T520-640q0-17 11.5-28.5T560-680h280q17 0 28.5 11.5T880-640q0 17-11.5 28.5T840-600H560Z"/></svg>
                    <span>Chosen Candidates</span>
                    </Link>
                </li>
                </>
                )}
                <li>
                    <Link href="/" onClick={() => setIsLoggedIn(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>                        
                    <span>Sign Out</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}
