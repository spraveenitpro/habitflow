import { HabitWithStats } from "@/lib/types";
import { getUserId } from "@/lib/session";
import { listHabitsWithStats } from "@/lib/store";
import { HabitForm } from "@/components/HabitForm";
import { HabitList } from "@/components/HabitList";
import { ProgressSummary } from "@/components/ProgressSummary";

async function getHabits(): Promise<HabitWithStats[]> {
  const userId = await getUserId();
  return listHabitsWithStats(userId);
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
