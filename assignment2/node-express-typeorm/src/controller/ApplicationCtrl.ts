import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Applications } from "../entity/Applications";
import { CandidateProfile } from "../entity/CandidateProfile";
import { Courses } from "../entity/Courses";

export class ApplicationCtrl {
  
  private AppRepository = AppDataSource.getRepository(Applications);
  private CandidateRepo = AppDataSource.getRepository(CandidateProfile);
  private CourseRepo = AppDataSource.getRepository(Courses);

  //get all applications with user data, and course data 
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

  //add a new application to the database 
  async save(request: Request, response: Response) {

      const { 
        candidateId,
        courseId,
        availability,
        skills,
        academic,
        prevRoles,
        role
      } = request.body; //get these data from the frontend/api 
  
      try {
          //get the courseId and candidateId related to the application
          const candidate = await this.CandidateRepo.findOneBy({ id: candidateId }); 
          const course = await this.CourseRepo.findOneBy({ courseId });

          if (!candidate || !course) {
            return response.status(400).json({ message: "Invalid candidate or course ID" });
          }

          const checkExisitngApp = await this.AppRepository.findOne({
            where:{
              candidate: {id: candidateId},
              courses: {courseId},
              },
              relations: ["candidate", "courses"],
          });

          if(checkExisitngApp){
            return response.status(400).json({ message: "You have already applied for this course" }); 
          }
        
          //create a new object with new data
          const app = new Applications();
          app.chosenBy;
          app.availability = availability;
          app.skills = skills;
          app.academic = academic;
          app.prevRoles = prevRoles;
          app.candidate = candidate;
          app.courses = course;
          app.role = role;

          const savedApp = await this.AppRepository.save(app); //save the new object to the database 
          
          return response.status(201).json(savedApp);
        } catch (error) {
          console.error("Error creating application:", error);
          return response.status(400).json({ message: "Error creating application", error });
        }
    }

  // check if candidateId has applied to courseId 
  async hasApplied(request: Request, response: Response){
    const { candidateId, courseId } = request.params;

    try{
      const existingApp = await this.AppRepository.findOne({ //find application with candidateId AND courseId 
        where: {
          candidate: {id: Number(candidateId)},
          courses: {courseId: Number(courseId)},
        },
        relations: ["candidate", "courses"],
      });

      if(existingApp){ //if the application exists then set hasApplied to true
        return response.status(200).json({ hasApplied: true });
      }
      //else set hasApplied to false 
      return response.status(200).json({hasApplied: false})
    } catch(error){
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  //this was named updateCount when it was only used updating the count
  //but actually this also updates the chosenBy string (including the preference/ranking)
  async updateCount(request: Request, response: Response) {
    const applicationId = parseInt(request.params.id); // get applicationId
    const { count, chosenBy } = request.body; //get fresh and new data from the frontend/api, 

    try {
      const appToUpdate = await this.AppRepository.findOne({ //get the current application that needs to be updated by ID 
        where: { applicationId },
      });

      if (!appToUpdate) {
        return response.status(404).json({ message: "Application not found" });
      }

      //set the new data 
      appToUpdate.count = count;
      appToUpdate.chosenBy = chosenBy;

      const updatedApp = await this.AppRepository.save(appToUpdate); //update to the database 
      return response.json(updatedApp);
    } catch (error) {
      return response.status(400).json({ message: "Error updating application count", error });
    }
  }

}