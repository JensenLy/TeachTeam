import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Applications } from "../entity/Applications";
import { CandidateProfile } from "../entity/CandidateProfile";
import { Courses } from "../entity/Courses";

export class ApplicationCtrl {
  
  private AppRepository = AppDataSource.getRepository(Applications);
  private CandidateRepo = AppDataSource.getRepository(CandidateProfile);
  private CourseRepo = AppDataSource.getRepository(Courses);

  async all(request: Request, response: Response) {
    const application = await this.AppRepository.find();

    return response.json(application);
  }

  async save(request: Request, response: Response) {

      const { 
        status,
        candidateId,
        courseId,
        availability,
        skills,
        academic,
        prevRoles 
      } = request.body;
  
      try {
          const candidate = await this.CandidateRepo.findOneBy({ id: candidateId });
          const course = await this.CourseRepo.findOneBy({ courseId });

          if (!candidate || !course) {
            return response.status(400).json({ message: "Invalid candidate or course ID" });
          }
        
          const app = new Applications();
          app.status = status ?? "pending";
          app.availability = availability;
          app.skills = skills;
          app.academic = academic;
          app.prevRoles = prevRoles;
          app.candidate = candidate;
          app.courses = course;

          const savedApp = await this.AppRepository.save(app);
          
          return response.status(201).json(savedApp);
        } catch (error) {
          console.error("Error creating application:", error);
          return response
            .status(400)
            .json({ message: "Error creating application", error });
        }
    }
}