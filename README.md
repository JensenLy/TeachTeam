# s4107070-s3977367-a2
Full Stack Development Assignment 2 by Christian Nabati(S4107070) and Kien Hung Ly(S3977367)

Github Repositary Link:
https://github.com/rmit-fsd-2025-s1/s4107070-s3977367-a2

How to run unit tests:
use command: npm test

For chart to be working (if npm install does not install everything from package.json for some reason)
npm i @chakra-ui/react@2 @emotion/react @emotion/styled framer-motion
npm install recharts

**[1]** For assigning course to the lecturer, in coursesAssigned   , use this format "courseId,courseId,courseId" (for example "1,2,3"). Assigned course will be NULL in database upon creating a user-lecturer and there will be no application showing until assigned courses are set on the database. 

**[2]** For the "chosenBy" column in "applications" table, the format will be "lecturerId_preference,lecturerId_preference,lecturerId_preference", so 5_2,4_3,6_1 means chosen by a lecturer with lecturerId = 5 with a preference = 2, lecturer with lecturerId = 4 with a preference = 3, lecturer with lecturerId = 6 with a preference = 1. Having no preference means 0 (like 5_0) and 0 is also the value when an application is first chosen. Setting a preference then de-choose the application will reset it to preference 0. 

The 2 points above is why you will come across quite a few .split(",") and .split("_") in the frontend since we break these string down to get the data we want. 