import { DataSource } from "typeorm"
import * as dotenv from "dotenv"
import { Answer } from "@/entities/answer.entity"
import { Post } from "@/entities/post.entity"
import { User } from "@/entities/user.entity"
import { Comment } from "@/entities/comment.entity"
import { Report } from "@/entities/report.entity"

dotenv.config()

const isProd = process.env.NODE_ENV === "production"

const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT || "5432", 10),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	logging: true,
	synchronize: false,
	ssl:
		process.env.NODE_ENV === "production"
			? { rejectUnauthorized: false }
			: false,
	entities: [User, Post, Comment, Answer, Report],
	migrations: [
		isProd
			? `${process.cwd()}/dist/migrations/*.js`
			: `${process.cwd()}/src/migrations/*.ts`,
	],
	subscribers: [],
})

AppDataSource.initialize()
	.then(() => {
		console.log("Banco de dados conectado com sucesso")
	})
	.catch((err) => {
		console.error("Erro durante a conexão:", err)
	})

export default AppDataSource
