"use client";

import { useMemo, useState, useTransition } from "react";
import { deleteHabit, resetStreak, toggleCompletion, updateHabit } from "@/app/actions";
import { HabitWithStats } from "@/lib/types";
import { isCompletionToday } from "@/lib/streaks";

type HabitCardProps = {
  habit: HabitWithStats;
};

export function HabitCard({ habit }: HabitCardProps) {
  const [editMode, setEditMode] = useState(false);
  const [pending, startTransition] = useTransition();
  const completedToday = useMemo(
    () => isCompletionToday(habit.completions),
    [habit.completions]
  );

  return (
    <article className="habit-card">
      <header>
        <div className="title">
          <span className="emoji">{habit.emoji ?? "🌱"}</span>
          {!editMode ? (
            <div>
              <h3>{habit.title}</h3>
              {habit.category && <p className="category">{habit.category}</p>}
            </div>
          ) : (
            <form
              className="inline-form"
              action={(formData) =>
                startTransition(() => {
                  formData.set("id", habit.id);
                  return updateHabit(formData).then(() => setEditMode(false));
                })
              }
            >
              <input name="title" defaultValue={habit.title} required maxLength={64} />
              <input
                name="category"
                defaultValue={habit.category ?? ""}
                placeholder="Category"
                maxLength={32}
              />
              <input name="emoji" defaultValue={habit.emoji ?? ""} maxLength={2} />
              <select name="frequency" defaultValue={habit.frequency}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
              <button type="submit" disabled={pending}>
                Save
              </button>
            </form>
          )}
        </div>
        <div className="actions">
          <form
            action={(formData) =>
              startTransition(() => {
                formData.set("habitId", habit.id);
                formData.set("completed", (!completedToday).toString());
                return toggleCompletion(formData);
              })
            }
          >
            <button type="submit" className={completedToday ? "checked" : ""}>
              {completedToday ? "Completed" : "Mark done"}
            </button>
          </form>
          <button className="ghost" onClick={() => setEditMode((state) => !state)}>
            {editMode ? "Cancel" : "Edit"}
          </button>
          <form
            action={(formData) =>
              startTransition(() => {
                formData.set("id", habit.id);
                return deleteHabit(formData);
              })
            }
          >
            <button type="submit" className="ghost danger">
              Delete
            </button>
          </form>
        </div>
      </header>

      <dl className="stats">
        <div>
          <dt>Current streak</dt>
          <dd>{habit.currentStreak} days</dd>
        </div>
        <div>
          <dt>Longest streak</dt>
          <dd>{habit.longestStreak} days</dd>
        </div>
        <div>
          <dt>Completion rate</dt>
          <dd>{habit.completionRate}%</dd>
        </div>
        <form
          action={(formData) =>
            startTransition(() => {
              formData.set("habitId", habit.id);
              return resetStreak(formData);
            })
          }
        >
          <button type="submit" className="ghost small">
            Reset streak
          </button>
        </form>
      </dl>
    </article>
  );
}
