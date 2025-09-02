# TeachTeam, a platform for lecturers and tutors (ReactTS, Node/Express, TypeORM)
Full Stack Development Assignment (React TS + Node/Express + Cloud MySQL)

**Contributors:**  
Christian Nabati and Kien Hung (Jensen) Ly

Assignment 1 unit tests are written in the front end.  
```use command: npm test```

Assignment 2 unit tests are written in the node-express-typeorm file.  
```use command: npm test```

For chart to be working (if npm install does not install everything from package.json for some reason)  
```
npm i @chakra-ui/react@2 @emotion/react @emotion/styled framer-motion
npm install recharts
```
to install jest use  
```npm install --save-dev jest ts-jest @types/jest @testing-library/react @testing-library/jest-dom```

**password for all users is John12345@**

**[1]**  
For assigning course to the lecturer, in coursesAssigned, use this format "courseId,courseId,courseId" (for example "1,2,3"). Assigned course will be NULL in database upon creating a user-lecturer and there will be no application showing until assigned courses are set on the database. 

**[2]**  
For the "chosenBy" column in "applications" table, the format will be "lecturerId_preference,lecturerId_preference,lecturerId_preference", so 5_2,4_3,6_1 means chosen by a lecturer with lecturerId = 5 with a preference = 2, lecturer with lecturerId = 4 with a preference = 3, lecturer with lecturerId = 6 with a preference = 1. Having no preference means 0 (like 5_0) and 0 is also the value when an application is first chosen. Setting a preference then de-choose the application will reset it to preference 0. 

**!!IMPORTANT!!**: the format ***MUST NOT*** have whitespaces, for example "1, 2, 3" instead of "1,2,3", since this will not work in point 1 and 2.

The 2 points above is why you will come across quite a few .split(",") and .split("_") in the frontend since we break these string down to get the data we want. 

The ER diagram was put under assignment2/node-express-typeorm/ER-diagram.png

**REFERENCE**
1. The structure of **authContext** was used to create the LoginContext from week 4 lab code.
2. The graphing library used for **Visual Reprensetation** Distinction part is from recharts.
Link: https://www.npmjs.com/package/recharts
3. Used super test for testing the backend. 
Link: https://www.npmjs.com/package/supertest
4. The structure of backend and api (including routes, entities, controllers, server.ts, data-sources.ts, app.ts,) was based on week 8 workshop/lab code. 
5. The regex for password validation from signup.tsx and signin.tsx was based on week 4 workshop/lab code.
6. In both signup.tsx and signin.tsx, onBlur() was found on GeeksforGeeks (https://www.geeksforgeeks.org/reactjs/react-onblur-event/) when finding for a deviant of onChange(). 

**database access details**  
DB_HOST=209.38.26.237  
DB_PORT=3306  
DB_USER=S3977367  
DB_PASS=S3977367  
DB_NAME=S3977367  
DB_DIALECT=mysql  


