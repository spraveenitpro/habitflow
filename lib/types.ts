export type HabitFrequency = "daily" | "weekly" | "custom";

export type Habit = {
  id: string;
  user_id: string;
  title: string;
  category: string | null;
  frequency: HabitFrequency;
  emoji: string | null;
  created_at: string;
};

export type HabitCompletion = {
  id: string;
  habit_id: string;
  completed_on: string;
  user_id: string;
  created_at: string;
};

export type HabitWithStats = Habit & {
  completions: HabitCompletion[];
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
};
