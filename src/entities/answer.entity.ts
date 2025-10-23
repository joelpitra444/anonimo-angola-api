import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm"
import { User } from "./user.entity"
import { Comment } from "./comment.entity"

@Entity()
export class Answer {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({ type: "text" })
	text: string

	@CreateDateColumn()
	created_at: Date

	@ManyToOne(() => Comment, { onDelete: "CASCADE" })
	comment: Comment

	@ManyToOne(() => User)
	user: User

	@Column({
		type: "enum",
		enum: ["active", "deleted", "flagged"],
		default: "active",
	})
	status: "active" | "deleted" | "flagged"
}
