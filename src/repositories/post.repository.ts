import AppDataSource from "../database/connection";
import { Post } from "../entities/post.entity";
import { Repository } from "typeorm";

export class PostRepository {
  private postRepository: Repository<Post>;

  constructor() {
    this.postRepository = AppDataSource.getRepository(Post);
  }

  async create(post: Post): Promise<Post> {
    return await this.postRepository.save(post);
  }

  async findByPostId(id: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async findByUserId(postId: string, userId: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { id: postId, user: { id: userId } },
    });
  }

  async findAllByUserId(userId: string): Promise<Post[]> {
    return await this.postRepository.find({
      where: { user: { id: userId } },
      relations: ["user", "comments", "comments.user"],
      order: { created_at: "DESC" },
    });
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ["user", "comments", "comments.user", "answer", "answer.user"],
      order: { created_at: "DESC" },
    });
  }

  async update(post: Post): Promise<Post> {
    return await this.postRepository.save(post);
  }

  async delete(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }
}
