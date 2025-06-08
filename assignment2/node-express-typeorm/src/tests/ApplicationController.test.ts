import { AppDataSource } from "src/data-source";
import app from "src/app";
import { Applications } from "src/entity/Applications";
import { Courses } from "src/entity/Courses";
import { CandidateProfile } from "src/entity/CandidateProfile";
import { User } from "src/entity/User";
const request = require("supertest")

// before testing connect to the database 
beforeAll(async () => {
    await AppDataSource.initialize();
});

afterAll(async () => {
    await AppDataSource.destroy();
});

/* The test creates a new user and course, then the user applies to that course twice.
The first application being a success but the second one fails because no user can apply
for the same course twice. */

describe("prevent duplicate application to the same course", () => {

    let userId: number;
    let candidateId: number;
    let courseId: number;
    let applicationId: number;

    it("user should apply once and reject further applications to the same course", async () => {
        // add new user
        const user = await request(app).post("/api/users").send({
            firstName: "James",
            lastName: "Smith",
            email: "smith@email.com",
            password: "John12345@",
            role: "candidate",
        });

        userId = user.body.userId;

        const candidate = await request(app).post("/api/candidates").send({
            userId,
        });

        candidateId = candidate.body.candidateId;
        // add new course
        const course = await request(app).post("/api/courses").send({
            title: "Full Stack Development",
            description: "Full Stack Development provides a range of enabling skills for independent development of small to medium-scale industry standard web applications.",
            courseCode: "COSC2390",
            type: "Tutor",
            location: "Bundoora Campus",
            requirement: "No Prerequisites",
            createdAt: "2025-06-07",
        })

        courseId = course.body.courseId;
        // first application to the course
        const firstApplication = await request(app).post("/api/apps").send({
            candidateId,
            courseId,
            skills: "React, Typescript",
            academic: "Computer science student",
            prevRoles: "none",
            availability: "Part-Time",
            role: "Tutor"
        })

        applicationId = firstApplication.body.applicationId;

        // 2nd application to the course
        const secondApplication = await request(app).post("/api/apps").send({
            candidateId,
            courseId,
            skills: "React, Typescript",
            academic: "Computer science student",
            prevRoles: "none",
            availability: "Part-Time",
            role: "Tutor"
        })
        // fails because only 1 application is allowed 
        expect(secondApplication.status).toBe(400);
        expect(secondApplication.body.message).toBe("You have already applied for this course");
    });
});