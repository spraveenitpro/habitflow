"use client";

import { useMemo } from "react";
import { HabitWithStats } from "@/lib/types";
import { isCompletionToday } from "@/lib/streaks";

type ProgressSummaryProps = {
  habits: HabitWithStats[];
};

export function ProgressSummary({ habits }: ProgressSummaryProps) {
  const { completedToday, totalHabits, averageCompletion } = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter((habit) => isCompletionToday(habit.completions)).length;
    const average =
      total === 0
        ? 0
        : Number(
            (
              habits.reduce((sum, habit) => sum + habit.completionRate, 0) / total
            ).toFixed(1)
          );

    return { completedToday: completed, totalHabits: total, averageCompletion: average };
  }, [habits]);

  return (
    <section className="summary">
      <div>
        <h1>Habitflow</h1>
        <p>Designed for calm, consistent progress.</p>
      </div>
      <div className="summary-metrics">
        <div className="summary-card">
          <h3>Today</h3>
          <p className="metric">
            {completedToday}/{totalHabits}
          </p>
          <span>Habits completed</span>
        </div>
        <div className="summary-card">
          <h3>Average completion</h3>
          <p className="metric">{averageCompletion}%</p>
          <span>Your overall follow-through</span>
        </div>
      </div>
    </section>
  );
}
