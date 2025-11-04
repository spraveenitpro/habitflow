import { createServerSupabaseClient, getUserId } from "@/lib/supabase";
import { calculateCompletionRate, calculateCurrentStreak, calculateLongestStreak } from "@/lib/streaks";
import { HabitWithStats } from "@/lib/types";
import { HabitForm } from "@/components/HabitForm";
import { HabitList } from "@/components/HabitList";
import { ProgressSummary } from "@/components/ProgressSummary";

async function getHabits(): Promise<HabitWithStats[]> {
  const supabase = createServerSupabaseClient();
  const userId = getUserId();

  const { data: habits, error: habitError } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (habitError) {
    throw new Error(habitError.message);
  }

  if (!habits || habits.length === 0) {
    return [];
  }

  const habitIds = habits.map((habit) => habit.id);

  const { data: completions, error: completionError } = await supabase
    .from("habit_completions")
    .select("*")
    .in("habit_id", habitIds)
    .order("completed_on", { ascending: true });

  if (completionError) {
    throw new Error(completionError.message);
  }

  return habits.map((habit) => {
    const habitCompletions = completions?.filter((completion) => completion.habit_id === habit.id) ?? [];
    return {
      ...habit,
      completions: habitCompletions,
      currentStreak: calculateCurrentStreak(habitCompletions),
      longestStreak: calculateLongestStreak(habitCompletions),
      completionRate: calculateCompletionRate(habitCompletions, habit.created_at)
    };
  });
}

export default async function DashboardPage() {
  const habits = await getHabits();

  return (
    <main className="layout">
      <aside>
        <ProgressSummary habits={habits} />
        <HabitForm />
      </aside>
      <section>
        <HabitList habits={habits} />
      </section>
    </main>
  );
}
