// Challenge type definition
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: string;
  category: string;
  completedAt?: string;
  isCompleted?: boolean;
}