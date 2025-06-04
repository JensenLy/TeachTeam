import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Applications } from "../entity/Applications";

export class ApplicationCtrl {
  private AppRepository = AppDataSource.getRepository(Applications);

  async all(request: Request, response: Response) {
    const application = await this.AppRepository.find();

    return response.json(application);
  }

}