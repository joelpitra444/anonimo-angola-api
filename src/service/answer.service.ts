import { CreateAnswerDTO } from "../dto/answer.dto";
import { Answer } from "../entities/answer.entity";
import { AnswerRepository } from "../repositories/answer.repository";
import { CommentRepository } from "../repositories/comment.repository";
import { UserRepository } from "../repositories/user.repository";
import badWordsFilter from "../utils/bad-words-filter";

export class AnswerService {
  private answerRepository: AnswerRepository;
  private commentRepository: CommentRepository;
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.commentRepository = new CommentRepository();
    this.answerRepository = new AnswerRepository();
  }

  async create(
    commentId: string,
    input: CreateAnswerDTO,
    userId: string
  ): Promise<Answer> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (user.id !== userId) {
      throw new Error("Não tem permisão para responder");
    }

    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new Error("Comentário não encontrado");
    }

    const answer = new Answer();

    if (comment.id === commentId) {
      answer.created_at = new Date();
      answer.text = badWordsFilter(input.text);
      answer.status = "active";
    }

    return await this.answerRepository.create(answer);
  }
}
