import { Request, Response } from "express"
import { plainToInstance } from "class-transformer"
import { AuthLoginDTO } from "@/dto/auth.dto"
import { validate } from "class-validator"
import { AuthService } from "@/service/auth.service"
import { CreateUserDTO } from "@/dto/user.dto"

class AuthController {
	private authService: AuthService

	constructor() {
		this.authService = new AuthService()
	}

	register = async (req: Request, res: Response): Promise<Response> => {
		try {
			const dto = plainToInstance(CreateUserDTO, req.body)

			const errors = await validate(dto)
			if (errors.length > 0) {
				return res.status(400).json({
					error: "Erro de validação",
					details: errors.map((error) => ({
						property: error.property,
						constraints: error.constraints,
					})),
				})
			}

			const user = await this.authService.register(dto)

			return res.status(201).json({
				message: "Usuário criado com sucesso",
				user: {
					id: user.id,
					anon_name: user.anon_name,
					phone_number: user.phone_number,
					is_active: user.is_active,
					profile_picture: user.profile_picture,
					role: user.role,
					created_at: user.created_at,
				},
			})
		} catch (error) {
			console.error(error)
			return res.status(500).json({
				error:
					error instanceof Error ? error.message : "Erro interno do servidor",
			})
		}
	}

	login = async (req: Request, res: Response): Promise<Response> => {
		try {
			const dto = plainToInstance(AuthLoginDTO, req.body)

			const errors = await validate(dto)
			if (errors.length > 0) {
				return res.status(400).json({
					error: "Erro de validação",
					details: errors.map((error) => ({
						property: error.property,
						constraints: error.constraints,
					})),
				})
			}

			const user = await this.authService.login(dto)

			return res.status(200).json({
				message: "Sessão iniciada com sucesso",
				user: user.user,
				token: user.token,
			})
		} catch (error) {
			console.error(error)
			return res.status(500).json({
				error:
					error instanceof Error ? error.message : "Erro interno do servidor",
			})
		}
	}
}

export default new AuthController()
