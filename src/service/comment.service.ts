import { CreateCommentDTO, UpdateCommentDTO } from "@/dto/comment.dto";
import { Comment } from "@/entities/comment.entity";
import { CommentRepository } from "@/repositories/comment.repository";
import { PostRepository } from "@/repositories/post.repository";
import { UserRepository } from "@/repositories/user.repository";
import badWordsFilter from "@/utils/bad-words-filter";

export class CommentService {
  private commentRepository: CommentRepository;
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.commentRepository = new CommentRepository();
    this.userRepository = new UserRepository();
  }

  async create(
    postId: string,
    input: CreateCommentDTO,
    userId: string
  ): Promise<Comment> {
    const post = await this.postRepository.findByPostId(postId);

    if (!post) {
      throw new Error("Post não encontrado");
    }

    if (!input.text) {
      throw new Error("O comentário não pode estar vazio");
    }

    const comment = new Comment();
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    comment.post = post;
    comment.user = user;
    comment.text = badWordsFilter(input.text);
    comment.created_at = new Date();
    comment.status = "active";

    return this.commentRepository.create(comment);
  }

  async update(
    commentId: string,
    input: UpdateCommentDTO,
    userId: string
  ): Promise<Comment> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new Error("Comentário não encontrado");
    }

    if (userId !== comment.user.id) {
      throw new Error("Não tem autorização para editar o comentário");
    }

    if (input.text) {
      comment.text = badWordsFilter(input.text);
    }

    if (input.status) {
      comment.status = input.status;
    }

    comment.status = input.status;

    return this.commentRepository.update(comment);
  }

  async getById(id: string): Promise<Comment | null> {
    if (!id) {
      throw new Error("Comentário não encontrado");
    }

    return this.commentRepository.findById(id);
  }

  async delete(id: string, userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const comment = await this.commentRepository.findById(id);

    if (!comment) {
      throw new Error("Comentário não encontrado");
    }

    if (userId !== comment.post.user.id && userId !== comment.user.id) {
      throw new Error("Não tem permissão para apagar o comentário");
    }

    await this.commentRepository.delete(id);
  }
}
