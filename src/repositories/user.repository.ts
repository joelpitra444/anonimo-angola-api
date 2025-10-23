import { User } from "@/entities/user.entity"
import AppDataSource from "@/database/connection"
import { Repository } from "typeorm"

export class UserRepository {
	private userRepository: Repository<User>

	constructor() {
		this.userRepository = AppDataSource.getRepository(User)
	}

	async findAll(): Promise<User[]> {
		return await this.userRepository.find()
	}

	async create(user: User): Promise<User> {
		return await this.userRepository.save(user)
	}

	async findById(id: string): Promise<User | null> {
		return await this.userRepository.findOneBy({ id })
	}

	async findByPhoneNumber(phone_number: string): Promise<User | null> {
		return await this.userRepository.findOneBy({ phone_number })
	}

	async findByAnonName(anon_name: string): Promise<User | null> {
		return await this.userRepository.findOneBy({ anon_name })
	}

	async update(user: User): Promise<User> {
		return await this.userRepository.save(user)
	}

	async delete(id: string): Promise<void> {
		await this.userRepository.delete(id)
	}
}
