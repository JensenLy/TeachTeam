import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react'
import Header from '@/components/header'
import { LoginContext, LoginContextType } from '@/contexts/LoginContext';

/* This test checks if the header component is being rendered properly
    with it's elements including logo and navigation links */

test("header is being rendered properly with logo and nav links when users is logged out", () =>{
const testContext : LoginContextType ={
        isLoggedIn: false,
        firstNameLoggedIn: "John",
        setFirstNameLoggedIn: jest.fn(),
        lastNameLoggedIn: "Doe",
        setLastNameLoggedIn: jest.fn(),
        emailLoggedIn: "john@email.com",
        setEmailLoggedIn: jest.fn(),
        userRole: "user",
        setUserRole: jest.fn(),
        setIsLoggedIn: jest.fn()
    };
    
    render(
        <LoginContext.Provider value={testContext}>
            <Header/>
        </LoginContext.Provider>
    );

    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
    
    /* since we have a total of 4 sign up & 4 sign in
       (due to having mobile & desktop versions) 
       we have to take all of them and check if there
       length is bigger than zero to see if they're 
       being displayed. 
    */
    const signUpLinks = screen.getAllByText("Sign Up");
    const signInLinks = screen.getAllByText("Sign In");

    expect(signUpLinks.length).toBeGreaterThan(0);
    expect(signInLinks.length).toBeGreaterThan(0);   

    // checks if a <nav> element exists even if it's hidden or display is none
    const nav = screen.getAllByRole("navigation", { hidden : true});
    expect(nav.length).toBeGreaterThan(0);

});

/* This test checks if the sign out button works as intendend when
a lecturer signs out by setting setIsLoggedIn(false) when user
clicks it */

test("When user clicks sign out it should set isLoggedin to false", () => {
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
            <Header />
        </LoginContext.Provider>
    );

    const signOutButton = screen.getByTestId("lecturer-signOut");
    fireEvent.click(signOutButton);

    expect(testContext.setIsLoggedIn).toHaveBeenCalledWith(false);
});

