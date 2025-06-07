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
    const application = await this.AppRepository.find({
      relations: {
        candidate: {
          user: true,
        },
        courses: true,
      },
      
    });

    return response.json(application);
  }

  async save(request: Request, response: Response) {

      const { 
        candidateId,
        courseId,
        availability,
        skills,
        academic,
        prevRoles,
        role
      } = request.body;
  
      try {
          const candidate = await this.CandidateRepo.findOneBy({ id: candidateId });
          const course = await this.CourseRepo.findOneBy({ courseId });

          if (!candidate || !course) {
            return response.status(400).json({ message: "Invalid candidate or course ID" });
          }
        
          const app = new Applications();
          app.chosenBy;
          app.availability = availability;
          app.skills = skills;
          app.academic = academic;
          app.prevRoles = prevRoles;
          app.candidate = candidate;
          app.courses = course;
          app.role = role;

          const savedApp = await this.AppRepository.save(app);
          
          return response.status(201).json(savedApp);
        } catch (error) {
          console.error("Error creating application:", error);
          return response.status(400).json({ message: "Error creating application", error });
        }
    }

  async hasApplied(request: Request, response: Response){
    const { candidateId, courseId } = request.params;

    try{
      const existingApp = await this.AppRepository.findOne({
        where: {
          candidate: {id: Number(candidateId)},
          courses: {courseId: Number(courseId)},
        },
        relations: ["candidate", "courses"],
      });

      if(existingApp){
        return response.status(200).json({ hasApplied: true });
      }
      
      return response.status(200).json({hasApplied: false})
    } catch(error){
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  async updateCount(request: Request, response: Response) {
    const applicationId = parseInt(request.params.id); // assuming :id is applicationId
    const { count, chosenBy } = request.body;

    try {
      const appToUpdate = await this.AppRepository.findOne({
        where: { applicationId },
      });

      if (!appToUpdate) {
        return response.status(404).json({ message: "Application not found" });
      }

      appToUpdate.count = count;
      appToUpdate.chosenBy = chosenBy;

      const updatedApp = await this.AppRepository.save(appToUpdate);
      return response.json(updatedApp);
    } catch (error) {
      return response.status(400).json({ message: "Error updating application count", error });
    }
  }

}