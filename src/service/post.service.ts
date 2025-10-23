import { CreatePostDTO, UpdatePostDTO } from "@/dto/post.dto";
import { Post } from "@/entities/post.entity";
import { PostInterface } from "@/interfaces/post.interface";
import { PostRepository } from "@/repositories/post.repository";
import { UserRepository } from "@/repositories/user.repository";
import leoProfanity from "leo-profanity";
import { badWords } from "../utils/bad-word";

export class PostService {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();

  
  }

  async create(input: CreatePostDTO, id: string): Promise<Post> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const post = new Post();

    post.user = user;
    post.text = leoProfanity.clean(input.text);
    post.created_at = new Date();
    post.status = "active";

    return await this.postRepository.create(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.findAll();
  }

  async findById(id: string): Promise<PostInterface> {
    const post = await this.postRepository.findByPostId(id);

    if (!post) {
      throw new Error("Postagem não encontrada");
    }

    return {
      id: post.id,
      user: post.user.anon_name,
      text: post.text,
      created_at: post.created_at,
      updated_at: post.updated_at,
      status: post.status,
    };
  }

  async findAllByUserId(userId: string): Promise<Post[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return await this.postRepository.findAllByUserId(userId);
  }

  async update(
    userId: string,
    postId: string,
    dto: UpdatePostDTO
  ): Promise<Post> {
    const post = await this.postRepository.findByPostId(postId);
    if (!post) throw new Error("Post não encontrado");

    if (post.user.id !== userId) throw new Error("Não autorizado");

    if (dto.text) {
      post.text = leoProfanity.clean(dto.text);
    }

    post.status = dto.status ?? post.status;

    return await this.postRepository.update(post);
  }

  async delete(postId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findByPostId(postId);
    if (!post) throw new Error("Post não encontrado");

    if (post.user.id !== userId) throw new Error("Não autorizado");
    await this.postRepository.delete(postId);
  }
}
