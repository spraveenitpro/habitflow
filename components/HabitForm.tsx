"use client";

import { useTransition } from "react";
import { createHabit } from "@/app/actions";

const frequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" }
] as const;

export function HabitForm() {
  const [pending, startTransition] = useTransition();

  return (
    <section className="panel">
      <h2>Create a habit</h2>
      <form
        action={(formData) => startTransition(() => createHabit(formData))}
        className="form"
      >
        <label>
          <span>Title</span>
          <input name="title" placeholder="e.g. Journal for 5 minutes" required maxLength={64} />
        </label>

        <label>
          <span>Category</span>
          <input name="category" placeholder="Health, Learning, etc." maxLength={32} />
        </label>

        <label>
          <span>Emoji</span>
          <input name="emoji" placeholder="🌿" maxLength={2} />
        </label>

        <label>
          <span>Frequency</span>
          <select name="frequency" defaultValue="daily">
            {frequencies.map((frequency) => (
              <option key={frequency.value} value={frequency.value}>
                {frequency.label}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Add habit"}
        </button>
      </form>
    </section>
  );
}
