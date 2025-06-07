import { Router } from "express";
import { commentCtrl } from "../controller/commentCtrl";

const router = Router();
const CmtCtrl = new commentCtrl();

router.get("/comments", async (req, res) => {
  await CmtCtrl.all(req, res);
});

router.post("/comments", async (req, res) => {
  await CmtCtrl.save(req, res);
});

router.delete("/comments/:id", async (req, res) => {
  await CmtCtrl.remove(req, res);
});

export default router;