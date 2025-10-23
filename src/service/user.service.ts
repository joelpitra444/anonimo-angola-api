import { User } from "@/entities/user.entity"
import bcrypt from "bcrypt"
import { UserRepository } from "@/repositories/user.repository"
import { CreateUserDTO, UpdateUserDTO } from "@/dto/user.dto"
import { getRandomAvatar } from "@/utils/random-avatar"

export class UserService {
	private userRepository: UserRepository

	constructor() {
		this.userRepository = new UserRepository()
	}

	async findById(id: string): Promise<User> {
		const user = await this.userRepository.findById(id)

		if (!user) {
			throw new Error("Usuário não encontrado")
		}

		return user
	}

	async find(): Promise<
		{
			id: string
			anon_name: string
			phone_number: string
			created_at: Date
			is_active: boolean
		}[]
	> {
		const users = await this.userRepository.findAll()

		return users.map((user) => ({
			id: user.id,
			anon_name: user.anon_name,
			phone_number: user.phone_number,
			profile_picture: user.profile_picture,
			created_at: user.created_at,
			is_active: user.is_active,
		}))
	}

	async update(id: string, input: UpdateUserDTO): Promise<User> {
		const user = await this.userRepository.findById(id)
		if (!user) {
			throw new Error("Usuário não encontrado")
		}

		if (input.anon_name && input.anon_name !== user.anon_name) {
			const existingUser = await this.userRepository.findByAnonName(
				input.anon_name
			)
			if (existingUser) {
				throw new Error("Este nome de usuário já está em uso")
			}
			user.anon_name = input.anon_name
		}

		if (input.password_hash) {
			user.password_hash = await bcrypt.hash(input.password_hash, 10)
		}

		if (input.password_hash) {
			const isSame = await bcrypt.compare(
				input.password_hash,
				user.password_hash
			)
			if (isSame) {
				throw new Error("A nova senha deve ser diferente da senha atual")
			}

			user.password_hash = await bcrypt.hash(input.password_hash, 10)
		}

		user.is_active = input.is_active ?? user.is_active
		user.phone_number = input.phone_number || user.phone_number

		return await this.userRepository.update(user)
	}

	async delete(id: string): Promise<void> {
		const user = await this.userRepository.findById(id)

		if (!user) {
			throw new Error("Usuário não encontrado")
		}

		await this.userRepository.delete(id)
	}
}
