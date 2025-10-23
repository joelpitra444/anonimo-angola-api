import commentController from "@/controllers/comment.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Endpoints para gerenciamento de comentários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "cmt123"
 *         postId:
 *           type: string
 *           example: "post456"
 *         postUserId:
 *           type: string
 *           example: "user789"
 *         userId:
 *           type: string
 *           example: "user321"
 *         anon_name:
 *           type: string
 *           example: "anonimo123"
 *         profile_picture:
 *           type: string
 *           example: "https://anonimo-angola.com/avatars/avatar1.png"
 *         text:
 *           type: string
 *           example: "Força, vai dar tudo certo!"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-08-21T14:15:22.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-08-21T15:00:00.000Z"
 *         status:
 *           type: string
 *           enum: [active, deleted, archived]
 *           example: "active"
 *
 *     CreateCommentInput:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *           example: "Força, vai dar tudo certo!"
 *
 *     UpdateCommentInput:
 *       type: object
 *       properties:
 *         commentId:
 *           type: string
 *           example: "cmt123"
 *         text:
 *           type: string
 *           example: "Comentário atualizado"
 *         status:
 *           type: string
 *           enum: [active, deleted, archived]
 *           example: "active"
 */

/**
 * @swagger
 * /comments/{id}:
 *   post:
 *     summary: Criar um novo comentário em um post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do post onde será criado o comentário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentInput'
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Post ou usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /comments:
 *   put:
 *     summary: Atualizar um comentário
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentInput'
 *     responses:
 *       200:
 *         description: Comentário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Comentário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Deletar um comentário
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do comentário a ser deletado
 *     responses:
 *       204:
 *         description: Comentário deletado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Comentário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

router.post("/:id", authMiddleware, commentController.create);
router.delete("/:id", authMiddleware, commentController.delete);
router.put("/", authMiddleware, commentController.update);

export default router;
