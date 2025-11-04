"use client";

import { useMemo, useState } from "react";
import { HabitWithStats } from "@/lib/types";
import { HabitCard } from "./HabitCard";
import { MiniCalendar } from "./MiniCalendar";
import { CategoryFilter } from "./CategoryFilter";

type HabitListProps = {
  habits: HabitWithStats[];
};

export function HabitList({ habits }: HabitListProps) {
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    habits.forEach((habit) => {
      if (habit.category) {
        unique.add(habit.category);
      }
    });
    return Array.from(unique.values());
  }, [habits]);

  const filteredHabits = useMemo(() => {
    if (!category) return habits;
    return habits.filter((habit) => habit.category === category);
  }, [habits, category]);

  const completions = useMemo(() => {
    return habits.flatMap((habit) => habit.completions);
  }, [habits]);

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>Today&apos;s habits</h2>
          <p className="panel-subtitle">
            Stay in flow — mark habits done as you go and watch streaks grow.
          </p>
        </div>
        <CategoryFilter categories={categories} active={category} onChange={setCategory} />
      </header>

      <MiniCalendar completions={completions} />

      <div className="habits-grid">
        {filteredHabits.length === 0 ? (
          <p className="empty-state">
            {habits.length === 0
              ? "Create your first habit to get started."
              : "No habits in this category yet."}
          </p>
        ) : (
          filteredHabits.map((habit) => <HabitCard key={habit.id} habit={habit} />)
        )}
      </div>
    </section>
  );
}
