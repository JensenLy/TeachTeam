import { Router } from "express";
import { courseCtrl } from "../controller/courseCtrl";

const router = Router();
const courses = new courseCtrl();

router.get("/courses", async (req, res) => {
  await courses.all(req, res);
});

router.get("/users/:id", async (req, res) => {
  await courses.one(req, res);
});
export default router;