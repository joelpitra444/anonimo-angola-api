import { AuthLoginDTO } from "../dto/auth.dto"
import { CreateUserDTO } from "../dto/user.dto"
import { User } from "../entities/user.entity"
import { UserRepository } from "../repositories/user.repository"
import { getRandomAvatar } from "../utils/random-avatar"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class AuthService {
	private userRepository: UserRepository

	constructor() {
		this.userRepository = new UserRepository()
	}

	async register(input: CreateUserDTO): Promise<User> {
		if (!input.anon_name || input.anon_name.trim().length === 0) {
			throw new Error("Nome de usuário não pode estar vazio")
		}

		if (!input.password) {
			throw new Error("Senha obrigatória")
		}

		const existingUser = await this.userRepository.findByAnonName(
			input.anon_name
		)

		if (existingUser) {
			throw new Error("Usuário já existe")
		}

		if (input.phone_number) {
			const existingPhone = await this.userRepository.findByPhoneNumber(
				input.phone_number
			)
			if (existingPhone) {
				throw new Error("Número de telefone já em uso")
			}
		}

		const baseUrl = process.env.BASE_URL || "http://localhost:8080/public"

		const profilePicture = getRandomAvatar()

		const user = new User()
		user.anon_name = input.anon_name
		user.profile_picture = `${baseUrl}${profilePicture}`
		user.password_hash = await bcrypt.hash(input.password, 10)
		user.phone_number = input.phone_number || ""
		user.role = "user"

		return await this.userRepository.create(user)
	}

	async login(
		input: AuthLoginDTO
	): Promise<{ user: Partial<User>; token: string }> {
		const user = await this.userRepository.findByAnonName(input.anon_name)

		if (!user) {
			throw new Error("Usuário não encontrado")
		}

		const validPassword = await bcrypt.compare(
			input.password,
			user.password_hash
		)

		if (!validPassword) {
			throw new Error("Senha incorreta")
		}

		user.last_login_at = new Date()

		await this.userRepository.update(user)

		const token = jwt.sign(
			{ id: user.id, anon_name: user.anon_name },
			process.env.JWT_SECRET as string,
			{ expiresIn: "12h" }
		)

		return {
			user: {
				id: user.id,
				anon_name: user.anon_name,
				phone_number: user.phone_number,
				profile_picture: user.profile_picture,
				is_active: user.is_active,
				created_at: user.created_at,
				last_login_at: user.last_login_at,
			},
			token,
		}
	}

	// 🔥 Novo método: criar conta anônima automaticamente
	async loginAsGuest(): Promise<{ user: Partial<User>; token: string }> {
		const baseUrl = process.env.BASE_URL || "http://localhost:8080/public"
		const profilePicture = getRandomAvatar()

		let anon_name = "Anônimo" + Math.floor(Math.random() * 100000)
		while (await this.userRepository.findByAnonName(anon_name)) {
			anon_name = "Anônimo" + Math.floor(Math.random() * 100000)
		}

		const user = new User()
		user.anon_name = anon_name
		user.profile_picture = `${baseUrl}${profilePicture}`
		user.password_hash = ""
		user.phone_number = ""
		user.role = "anonymous"
		user.is_active = true

		const createdUser = await this.userRepository.create(user)

		const token = jwt.sign(
			{
				id: createdUser.id,
				anon_name: createdUser.anon_name,
				role: "anonymous",
			},
			process.env.JWT_SECRET as string,
			{ expiresIn: "12h" }
		)

		return {
			user: {
				id: createdUser.id,
				anon_name: createdUser.anon_name,
				profile_picture: createdUser.profile_picture,
				is_active: createdUser.is_active,
				created_at: createdUser.created_at,
			},
			token,
		}
	}
}
