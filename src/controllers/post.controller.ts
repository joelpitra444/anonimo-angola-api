import { CreatePostDTO, UpdatePostDTO } from "@/dto/post.dto";
import { PostService } from "@/service/post.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";

class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CreatePostDTO, req.body);

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

      const post = await this.postService.create(dto, id);

      return res.status(201).json({
        id: post.id,
        userId: post.user.id,
        anon_name: post.user.anon_name,
        profile_picture: post.user.profile_picture,
        text: post.text,
        created_at: post.created_at,
        status: post.status,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  updatePost = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id: userId } = req.anon_name;
      const { id } = req.params;
      const dto = plainToInstance(UpdatePostDTO, req.body);

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

      const post = await this.postService.update(userId, id, dto);

      return res.status(200).json({
        id: post.id,
        userId: post.user.id,
        anon_name: post.user.anon_name,
        profile_picture: post.user.profile_picture,
        text: post.text,
        created_at: post.created_at,
        status: post.status,
      });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  deletePost = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id: userId } = req.anon_name;
      const { id } = req.params;

      await this.postService.delete(id, userId);

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const posts = await this.postService.findAll();

      return res.status(200).json(
        posts.map((post) => ({
          id: post.id,
          userId: post.user.id,
          anon_name: post.user.anon_name,
          profile_picture: post.user.profile_picture,
          text: post.text,
          created_at: post.created_at,
          status: post.status,
          comments: post.comments.map((comment) => ({
            id: comment.id,
            userId: comment.user.id,
            anon_name: comment.user.anon_name,
            profile_picture: comment.user.profile_picture,
            text: comment.text,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            status: comment.status,
          })),
        }))
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const post = await this.postService.findById(id);

      return res.status(200).json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  getAllByUserId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId } = req.params;
      const posts = await this.postService.findAllByUserId(userId);

      return res.status(200).json(
        posts.map((post) => ({
          id: post.id,
          userId: post.user.id,
          anon_name: post.user.anon_name,
          profile_picture: post.user.profile_picture,
          text: post.text,
          created_at: post.created_at,
          status: post.status,
          comments: post.comments.map((comment) => ({
            id: comment.id,
            userId: comment.user.id,
            anon_name: comment.user.anon_name,
            profile_picture: comment.user.profile_picture,
            text: comment.text,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            status: comment.status,
          })),
        }))
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  };
}

export default new PostController();
