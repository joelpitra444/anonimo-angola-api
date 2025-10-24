
import AppDataSource from "../database/connection";
import { Answer } from "../entities/answer.entity";
import { Repository } from "typeorm";

export class AnswerRepository {
  private answerRepository: Repository<Answer>;

  constructor() {
    this.answerRepository = AppDataSource.getRepository(Answer);
  }

  async create(input: Answer): Promise<Answer> {
    return await this.answerRepository.save(input);
  }

  async update(answer: Answer): Promise<Answer> {
    return this.answerRepository.save(answer);
  }

  async delete(id: string): Promise<void> {
    await this.answerRepository.delete(id);
  }

  async findById(id: string): Promise<Answer | null> {
    return await this.answerRepository.findOne({
      where: { id },
      relations: ["user", "post", "post.user", "comment", "comment.user"],
    });
  }
}
