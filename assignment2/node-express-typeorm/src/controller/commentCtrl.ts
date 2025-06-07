import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Comment } from "../entity/Comment";
import { LecturerProfile } from "../entity/LecturerProfile";
import { Applications } from "../entity/Applications";

export class commentCtrl {
    
    private AppRepository = AppDataSource.getRepository(Applications);
    private CommentRepo = AppDataSource.getRepository(Comment);
    private LecturerRepo = AppDataSource.getRepository(LecturerProfile);

    async all(request: Request, response: Response) {
        const comments = await this.CommentRepo.find({
        relations: ["application", "lecturer", "lecturer.user"],
        
        });

        return response.json(comments);
    }

    async save(request: Request, response: Response) {

      const {content, applicationId, lecturerId} = request.body;
  
      try {
          const cmt = new Comment();
          cmt.content = content;
          cmt.application = applicationId;
          cmt.lecturer = lecturerId; 

          const savedCmt = await this.CommentRepo.save(cmt);
          
          return response.status(201).json(savedCmt);
        } catch (error) {
          console.error("Error creating application:", error);
          return response.status(400).json({ message: "Error creating application", error });
        }
    }

    async remove(request: Request, response: Response) {
      const id = parseInt(request.params.id);
      const cmtToRemove = await this.CommentRepo.findOne({
        where: { id },
      });

      if (!cmtToRemove) {
        return response.status(404).json({ message: "Comment not found" });
      }

      await this.CommentRepo.remove(cmtToRemove);
      return response.json({ message: "Comment removed successfully" });
    }
}