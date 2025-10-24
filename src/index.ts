import type { Request, Response } from "express"
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import path from "path"
import AppDataSource from "./database/connection"
import routes from "./routes"
import { setupSwagger } from "./swagger"

dotenv.config()

const app = express()

app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"https://anonimo-angola-three.vercel.app",
			"https://anonimo-angola.vercel.app"
		],
		credentials: true,
	})
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/public", express.static(path.join(__dirname, "../public")))
app.get("/", (req: Request, res: Response) => {
	res.json({ status: "ok", timestamp: new Date() })
})
app.use(routes)
setupSwagger(app)

async function garantirConexaoBancoDeDados() {
	if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize()
		console.log("Conexão com o banco de dados estabelecida (sob demanda).")
	}
}

export default async function handler(req: Request, res: Response) {
	try {
		await garantirConexaoBancoDeDados()
		app(req, res)
	} catch (erro) {
		console.error("Erro ao inicializar a conexão com o banco de dados:", erro)
		res.status(500).json({ erro: "Falha ao conectar ao banco de dados" })
	}
}
