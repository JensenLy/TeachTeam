import { Router } from "express";
import { ApplicationCtrl } from "../controller/ApplicationCtrl";

const router = Router();
const AppCtrl = new ApplicationCtrl();

router.get("/apps", async (req, res) => {
  await AppCtrl.all(req, res);
});

router.post("/apps", async (req, res) => {
  await AppCtrl.save(req, res);
});

export default router;