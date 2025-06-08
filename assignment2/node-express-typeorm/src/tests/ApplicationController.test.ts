import { AppDataSource } from "src/data-source";
import { User } from "../entity/User"
import { CandidateProfile } from "src/entity/CandidateProfile";
import app from "src/app";
import { Applications } from "src/entity/Applications";
const request = require("supertest")

// before testing connect to the database 
// and remove all exisitg data in applications, candidateProfile, and user
beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.getRepository(Applications).delete({})
    await AppDataSource.getRepository(CandidateProfile).delete({})
    await AppDataSource.getRepository(User).delete({})


});

// after testing close the connection to the database
afterAll(async () => {
    await AppDataSource.destroy();
});

describe("d", () => {
    let userId: number;
    let candidateId: number;
    let courseId: number;
    let applicationId: number;

    it("d", async () => {
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


        const secondApplication = await request(app).post("/api/apps").send({
            candidateId,
            courseId,
            skills: "React, Typescript",
            academic: "Computer science student",
            prevRoles: "none",
            availability: "Part-Time",
            role: "Tutor"
        })

        expect(secondApplication.status).toBe(400);
        expect(secondApplication.body.message).toBe("You have already applied for this course");
    });
});