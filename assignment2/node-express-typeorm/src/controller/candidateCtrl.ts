import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CandidateProfile } from "../entity/CandidateProfile";

export class candidateCtrl {
  private candiRepositry = AppDataSource.getRepository(CandidateProfile);

  //get all candidates 
  async all(request: Request, response: Response) {
    const candidate = await this.candiRepositry.find();

    return response.json(candidate);
  }

  //get one candidate by userID  
  async one(request: Request, response: Response) {
    const userID = parseInt(request.params.user); 

    if (isNaN(userID)) {
        return response.status(400).json({ message: "Invalid user ID" });
    }

    const candi = await this.candiRepositry.findOne({
      where: { user: { id: userID } },
    });

    if (!candi) {
      return response.status(404).json({ message: "Candidate not found" });
    }
    return response.json(candi);
  }

}