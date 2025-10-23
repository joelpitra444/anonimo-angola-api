import AppDataSource from "@/database/connection";
import { Comment } from "@/entities/comment.entity";
import { Repository } from "typeorm";

export class CommentRepository {
  private commentRepository: Repository<Comment>;

  constructor() {
    this.commentRepository = AppDataSource.getRepository(Comment);
  }

  async create(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }

  async update(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }

  async delete(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }

  async findById(id: string): Promise<Comment | null> {
    return this.commentRepository.findOne({
      where: { id },
      relations: ["user", "post", "post.user"],
    });
  }
}
