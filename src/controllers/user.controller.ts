import { Response, Request } from "express"
import { UserRepository } from "@/repositories/user.repository"
import { UserService } from "@/service/user.service"
import { validate } from "class-validator"
import { UpdateUserDTO } from "@/dto/user.dto"
import { plainToInstance } from "class-transformer"

class UserController {
	private userService: UserService

	constructor() {
		this.userService = new UserService()
	}

	updateUser = async (req: Request, res: Response) => {
		try {
			const { id } = req.params
			const dto = plainToInstance(UpdateUserDTO, req.body)

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

			const updatedUser = await this.userService.update(id, dto)

			return res.status(200).json({
				message: "Usuário atualizado com sucesso",
				user: {
					id: updatedUser.id,
					anon_name: updatedUser.anon_name,
					phone_number: updatedUser.phone_number,
					role: updatedUser.role,
					profile_picture: updatedUser.profile_picture,
					created_at: updatedUser.created_at,
					last_login_at: updatedUser.last_login_at,
					is_active: updatedUser.is_active,
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

	getUserById = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params
			const user = await this.userService.findById(id)

			return res.status(200).json({
				id: user.id,
				anon_name: user.anon_name,
				phone_number: user.phone_number,
				role: user.role,
				created_at: user.created_at,
				last_login_at: user.last_login_at,
				is_active: user.is_active,
			})
		} catch (error) {
			console.error(error)
			return res.status(500).json({
				error:
					error instanceof Error ? error.message : "Erro interno do servidor",
			})
		}
	}

	getAllUsers = async (req: Request, res: Response): Promise<Response> => {
		try {
			const users = await this.userService.find()
			return res.status(200).json(users)
		} catch (error) {
			console.error(error)
			return res.status(500).json({
				error:
					error instanceof Error ? error.message : "Erro interno do servidor",
			})
		}
	}

	deleteUser = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params
			await this.userService.delete(id)
			return res.status(204).send()
		} catch (error) {
			console.error(error)
			return res.status(500).json({
				error:
					error instanceof Error ? error.message : "Erro interno do servidor",
			})
		}
	}
}

export default new UserController()
