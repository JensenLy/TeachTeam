import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react'
import {LoginContext, LoginContextType } from '@/contexts/LoginContext';
import Sidebar from '@/components/sidebar';
import { tr } from 'framer-motion/client';

jest.mock('next/router', () => ({
    useRouter: () => ({
      pathname: '/',
    }),
  }));

/*  This test renders all the side bar links, loged in user's name
    and doubles checks to make sure it's ui is specified to Tutor and
    not Lecturer */

test("Render all side bar links for Tutor and there name", () => {

    const testContext : LoginContextType ={
        isLoggedIn: true,
        firstNameLoggedIn: "John",
        setFirstNameLoggedIn: jest.fn(),
        lastNameLoggedIn: "Doe",
        setLastNameLoggedIn: jest.fn(),
        emailLoggedIn: "john@email.com",
        setEmailLoggedIn: jest.fn(),
        userRole: "candidate",
        setUserRole: jest.fn(),
        setIsLoggedIn: jest.fn()
    };
    render(
        <LoginContext.Provider value={testContext}>        
            <Sidebar/>
        </LoginContext.Provider>
    );

    expect(screen.getByText("Apply for roles")).toBeInTheDocument();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
    expect(screen.queryByText("Applicants")).not.toBeInTheDocument();
    expect(screen.queryByText("Chosen Candidates")).not.toBeInTheDocument();
    expect(screen.getByText("Hi, " + testContext.firstNameLoggedIn + "!")).toBeInTheDocument();
})

/*  This test renders all the side bar links, loged in user's name
    and doubles checks to make sure it's ui is specified to Lecturer and
    not Tutor */

test("Render all side bar links for Lecturer and there name", () => {

        const testContext : LoginContextType ={
        isLoggedIn: true,
        firstNameLoggedIn: "John",
        setFirstNameLoggedIn: jest.fn(),
        lastNameLoggedIn: "Doe",
        setLastNameLoggedIn: jest.fn(),
        emailLoggedIn: "john@email.com",
        setEmailLoggedIn: jest.fn(),
        userRole: "lecturer",
        setUserRole: jest.fn(),
        setIsLoggedIn: jest.fn()
        };
    render(
        <LoginContext.Provider value={testContext}>        
            <Sidebar/>
        </LoginContext.Provider>
    );

    expect(screen.getByText("Applicants")).toBeInTheDocument();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
    expect(screen.getByText("Chosen Candidates")).toBeInTheDocument();
    expect(screen.queryByText("Apply for roles")).not.toBeInTheDocument();
    expect(screen.getByText("Hi, " + testContext.firstNameLoggedIn + "!")).toBeInTheDocument();
});

/* This test tests an edge case where user name is undefined
    what kind of value will be shown in the ui, it's welcome back! */

test("Render fall back name when user name and user role are undefined", () => {    
    const testContext : LoginContextType ={
        isLoggedIn: true,
        firstNameLoggedIn: "",
        setFirstNameLoggedIn: jest.fn(),
        lastNameLoggedIn: "Doe",
        setLastNameLoggedIn: jest.fn(),
        emailLoggedIn: "john@email.com",
        setEmailLoggedIn: jest.fn(),
        userRole: "candidate",
        setUserRole: jest.fn(),
        setIsLoggedIn: jest.fn()
    };

    render(
        <LoginContext.Provider value={testContext}>        
            <Sidebar/>
        </LoginContext.Provider>
    );
    expect(screen.getByText("Welcome back!")).toBeInTheDocument();
});

/*  Test checks if the home page is linked to the index page from the side bar ui in the tutor page  */

test("testing to see if homepage has the link to navigate to index page from candidate side bar", () => {
        const testContext : LoginContextType ={
        isLoggedIn: true,
        firstNameLoggedIn: "John",
        setFirstNameLoggedIn: jest.fn(),
        lastNameLoggedIn: "Doe",
        setLastNameLoggedIn: jest.fn(),
        emailLoggedIn: "john@email.com",
        setEmailLoggedIn: jest.fn(),
        userRole: "candidate",
        setUserRole: jest.fn(),
        setIsLoggedIn: jest.fn()
    };
    render(
        <LoginContext.Provider value={testContext}>
            <Sidebar/>
        </LoginContext.Provider>     
    );
    const homeLink = screen.getByText("Home Page").closest("a");
    expect(homeLink).toHaveAttribute("href", "./");
});


/*  This test focuses on the user being able to click on the expand/collapse
    button on the side bar to toggle it. */

test("Should toggle the sidebar when the side bar collapse/expand button is pressed", () => {
        const testContext : LoginContextType ={
        isLoggedIn: true,
        firstNameLoggedIn: "John",
        setFirstNameLoggedIn: jest.fn(),
        lastNameLoggedIn: "Doe",
        setLastNameLoggedIn: jest.fn(),
        emailLoggedIn: "john@email.com",
        setEmailLoggedIn: jest.fn(),
        userRole: "lecturer",
        setUserRole: jest.fn(),
        setIsLoggedIn: jest.fn()
    };
    render(
        <LoginContext.Provider value={testContext}>
            <Sidebar/>
        </LoginContext.Provider>
    );

    const toggleSideBar = screen.getByTestId("toggleSideBar");
    const testSideBar = screen.getByTestId("sidebar");

    expect(testSideBar).toHaveClass("sidebar");
    
    fireEvent.click(toggleSideBar);

    expect(testSideBar).toHaveClass("close")

    fireEvent.click(toggleSideBar);

    expect(testSideBar).toHaveClass("sidebar");
})