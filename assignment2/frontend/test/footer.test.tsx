import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react'
import { loginContext } from '@/contexts/LoginContext';
import Footer from '@/components/footer';

/*  This test checks if all elements included in the footer 
    are being rendered 
*/
test("Test footer rendering properly with it's elements", () => {
    const testContext = {
        isLoggedIn: false,
        setIsLoggedIn: jest.fn()
    };

    render(
        <loginContext.Provider value={testContext}>
            <Footer/>
        </loginContext.Provider>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
});

/* This test checks how the footer elements change when a user
    is logged in, specifically it checks for if sign out exists
    and sign up and sign in don't exist 
*/
test("Render user with sign out when user logs in", () => {
    const textContext = {
        isLoggedIn: true,
        setIsLoggedIn: jest.fn()
    }

    render(
        <loginContext.Provider value={textContext}>
            <Footer/>
        </loginContext.Provider>
    );

    expect(screen.getByText("Sign Out")).toBeInTheDocument();
    expect(screen.queryByText("Sign Up")).toBeNull();
    expect(screen.queryByText("Sign In")).toBeNull();
});

/*  This test checks if the sign out button functions properly
    by creating a click on the sign out button and it sets 
    the setIsLoggedIn to false which shows us now that the 
    user is logged out
*/

test("Clicking sign out sets setLoggedIn to false", () => {
    const textContext = {
        isLoggedIn: true,
        setIsLoggedIn: jest.fn()
    }

    render(
        <loginContext.Provider value={textContext}>
            <Footer/>
        </loginContext.Provider>
    );

    const signOutLink = screen.getByText("Sign Out");
    fireEvent.click(signOutLink);
    
    expect(textContext.setIsLoggedIn).toHaveBeenCalledWith(false);
})