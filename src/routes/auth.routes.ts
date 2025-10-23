import { Router } from "express";
import authController from "@/controllers/auth.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e criação de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthLoginInput:
 *       type: object
 *       required:
 *         - anon_name
 *         - password
 *       properties:
 *         anon_name:
 *           type: string
 *           example: "joel123"
 *         password:
 *           type: string
 *           example: "minhaSenha@123"
 *     AuthLoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Sessão iniciada com sucesso"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     AuthRegisterInput:
 *       type: object
 *       required:
 *         - anon_name
 *         - password
 *       properties:
 *         anon_name:
 *           type: string
 *           example: "joel123"
 *         phone_number:
 *           type: string
 *           example: "+244900000000"
 *         password:
 *           type: string
 *           example: "minhaSenha@123"
 *     AuthRegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Usuário criado com sucesso"
 *         user:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login e receber JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginInput'
 *     responses:
 *       200:
 *         description: Sessão iniciada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Criar um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterInput'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthRegisterResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Erro interno do servidor
 */

router.post("/login", authController.login);

router.post("/register", authController.register);


export default router;
