import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Report {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  reason: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: "enum", enum: ["post", "comment", "answer"] })
  target_type: "post" | "comment" | "answer";

  @Column()
  target_id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;
}
