import { Router } from "express";
import { candidateCtrl } from "../controller/candidateCtrl";

const router = Router();
const courses = new candidateCtrl();

router.get("/candidate", async (req, res) => {
  await courses.all(req, res);
});

router.get("/candidate/:user", async (req, res) => {
  await courses.one(req, res);
});
export default router;