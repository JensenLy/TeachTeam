import "reflect-metadata";
import express from "express";
import userRoutes from "./routes/user.routes";
import appRoutes from "./routes/applications.routes";
import courseRoutes from "./routes/courses.routes";
import candidateRoutes from "./routes/candidates.routes";
import commentRoutes from "./routes/comment.routes";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", appRoutes);
app.use("/api", courseRoutes);
app.use("/api", candidateRoutes);
app.use("/api", commentRoutes);

export default app;