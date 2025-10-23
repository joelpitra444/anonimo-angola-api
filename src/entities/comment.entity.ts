import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./post.entity";
import { User } from "./user.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  text: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Post, { onDelete: "CASCADE" })
  post: Post;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column({
    type: "enum",
    enum: ["active", "deleted", "flagged"],
    default: "active",
  })
  status: "active" | "deleted" | "flagged";
}
