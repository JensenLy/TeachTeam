import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Courses } from "../entity/Courses";

export class courseCtrl {
  private CourseRepository = AppDataSource.getRepository(Courses);

  //get all courses 
  async all(request: Request, response: Response) {
    const course = await this.CourseRepository.find();

    return response.json(course);
  }

  //get one course by its id 
  async one(request: Request, response: Response) {
    const temp = request.params.id;
    const id = parseInt(temp);
    const course = await this.CourseRepository.findOne({
      where: { courseId: id }
    });

    if (!course) {
      return response.status(404).json({ message: "Course not found" });
    }
    return response.json(course);
  }

}