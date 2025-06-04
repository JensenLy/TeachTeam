import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Courses } from "../entity/Courses";

export class courseCtrl {
  private CourseRepository = AppDataSource.getRepository(Courses);

  async all(request: Request, response: Response) {
    const course = await this.CourseRepository.find();

    return response.json(course);
  }

}