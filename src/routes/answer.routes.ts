import answerController from "@/controllers/answer.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { Router } from "express";

const routes = Router();

routes.post("/:id", authMiddleware, answerController.create);

export default routes;
