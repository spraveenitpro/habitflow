"use client";

import { format, parseISO } from "date-fns";
import { HabitCompletion } from "@/lib/types";
import { getLastNDays } from "@/lib/streaks";

type MiniCalendarProps = {
  completions: HabitCompletion[];
};

const DAYS = 28;

export function MiniCalendar({ completions }: MiniCalendarProps) {
  const dates = getLastNDays(DAYS);
  const completionSet = new Set(completions.map((completion) => completion.completed_on));

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <h3>Last {DAYS} days</h3>
        <span className="legend">
          <span className="dot filled" /> Completed day
        </span>
      </div>
      <div className="mini-calendar-grid">
        {dates.map((date) => {
          const active = completionSet.has(date);
          return (
            <div
              key={date}
              className={`mini-calendar-cell ${active ? "active" : ""}`}
              title={`${format(parseISO(date), "MMMM d")} • ${active ? "Completed" : "No entry"}`}
            />
          );
        })}
      </div>
    </div>
  );
}
