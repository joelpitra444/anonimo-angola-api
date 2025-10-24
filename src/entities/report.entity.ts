import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm"
import { User } from "./user.entity"

export enum ReportTargetType {
	POST = "post",
	COMMENT = "comment",
	ANSWER = "answer",
}

@Entity()
export class Report {
	@PrimaryGeneratedColumn("uuid")
	id!: string

	@Column()
	reason!: string

	@CreateDateColumn()
	created_at!: Date

	@Column({
		type: "enum",
		enum: ReportTargetType,
	})
	target_type!: ReportTargetType

	@Column()
	target_id!: number

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	user!: User
}
