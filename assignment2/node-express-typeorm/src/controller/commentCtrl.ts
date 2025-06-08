import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Comment } from "../entity/Comment";

export class commentCtrl {
    
    private CommentRepo = AppDataSource.getRepository(Comment);

    //get all comments with everything related 
    async all(request: Request, response: Response) {
        const comments = await this.CommentRepo.find({
        relations: ["application", "lecturer", "lecturer.user"],
        
        });

        return response.json(comments);
    }

    //add new comment onto the database
    async save(request: Request, response: Response) {

      const {content, applicationId, lecturerId} = request.body; //get new data from the api/frontend 
  
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

    //delete a comment by looking for its id 
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