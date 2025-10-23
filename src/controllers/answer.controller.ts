import { CreateAnswerDTO } from "@/dto/answer.dto";
import { AnswerService } from "@/service/answer.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";

export class AnswerController {
  private answerService: AnswerService;

  constructor() {
    this.answerService = new AnswerService();
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id: userId } = req.anon_name;
      const { id: commentId } = req.params;

      const dto = plainToInstance(CreateAnswerDTO, req.body);

      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          error: "Erro de validação",
          details: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
      }

      const answer = await this.answerService.create(commentId, dto, userId);

      return res.status(201).json({
        message: "Resposta criada com sucesso",
        answer: answer,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  };
}

export default new AnswerController();
