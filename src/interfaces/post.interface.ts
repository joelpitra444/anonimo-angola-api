export interface PostInterface {
  id: string;
  user: string;
  text: string;
  created_at: Date;
  updated_at?: Date;
  status: "active" | "deleted" | "flagged";
}
