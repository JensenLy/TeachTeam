import '@testing-library/jest-dom';
import {render, screen } from '@testing-library/react'
import SuccessScreen from '@/components/successScreen';

/*  tests the rendering of the success screen to check
    if all the elements such as logo, success message,
    and links back to apply for more jobs page. */

test("should render all successScreen elements", () => {
    render(
            <SuccessScreen applyMoreJobs={(jest.fn())}/>
    );
    const logo = screen.getByAltText("logo");
    expect(logo).toBeInTheDocument();

    const successMessage = screen.getByText("Congrats! Your application have been sent!");
    expect(successMessage).toBeInTheDocument();

    const applyText = screen.getByText("In the meantime, apply for more jobs");
    expect(applyText).toBeInTheDocument();

    const applyLinked = screen.getByText("here");
    expect(applyLinked).toBeInTheDocument();

});

/*  This test shows how the "here" work is linked to the tutor
    page where it shows courses and allows users to apply to these
    courses */
    
test('tests if "here" is linked to apply for more jobs page', () => {
    render(
        <SuccessScreen applyMoreJobs={jest.fn()}/>
    );

    const applyLink = screen.getByText("here").closest("a");
    expect(applyLink).toHaveAttribute("href", "/tutor");
});