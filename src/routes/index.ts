import { Router, Response, Request } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import postRoutes from "./post.routes";
import commentRoutes from "./comment.routes";
import answerRoutes from "./answer.routes";

const routes = Router();

routes.use("/api/auth", authRoutes);
routes.use("/api/users", userRoutes);
routes.use("/api/posts", postRoutes);
routes.use("/api/comments", commentRoutes);
routes.use("/api/answers", answerRoutes);

routes.get("/", (_: Request, res: Response) => {
  res.status(200).send({ success: true });
});

export default routes;
