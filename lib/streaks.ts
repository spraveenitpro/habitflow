import { differenceInCalendarDays, isToday, parseISO, subDays } from "date-fns";
import { HabitCompletion } from "./types";

export function calculateCurrentStreak(completions: HabitCompletion[]) {
  if (!completions.length) {
    return 0;
  }

  const sorted = [...completions]
    .map((completion) => parseISO(completion.completed_on))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let dayOffset = 0;

  while (sorted.length) {
    const date = sorted.shift();
    if (!date) break;

    if (differenceInCalendarDays(new Date(), date) === dayOffset) {
      streak += 1;
      dayOffset += 1;
    } else if (differenceInCalendarDays(new Date(), date) > dayOffset) {
      break;
    }
  }

  return streak;
}

export function calculateLongestStreak(completions: HabitCompletion[]) {
  if (!completions.length) {
    return 0;
  }

  const sorted = [...completions]
    .map((completion) => parseISO(completion.completed_on))
    .sort((a, b) => a.getTime() - b.getTime());

  let longest = 0;
  let current = 1;

  for (let i = 1; i < sorted.length; i += 1) {
    const diff = differenceInCalendarDays(sorted[i], sorted[i - 1]);
    if (diff === 1 || diff === 0) {
      current += diff === 0 ? 0 : 1;
    } else {
      longest = Math.max(longest, current);
      current = 1;
    }
  }

  longest = Math.max(longest, current);
  return longest;
}

export function calculateCompletionRate(completions: HabitCompletion[], createdAt: string) {
  const createdDate = parseISO(createdAt);
  const today = new Date();

  const totalDays = Math.max(differenceInCalendarDays(today, createdDate) + 1, 1);
  const uniqueDays = new Set(
    completions.map((completion) => parseISO(completion.completed_on).toDateString())
  );

  return Number(((uniqueDays.size / totalDays) * 100).toFixed(1));
}

export function normalizeToISO(date: Date) {
  const normalized = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return normalized.toISOString().split("T")[0];
}

export function isCompletionToday(completions: HabitCompletion[]) {
  return completions.some((completion) => isToday(parseISO(completion.completed_on)));
}

export function groupCompletionsByDate(completions: HabitCompletion[]) {
  return completions.reduce<Record<string, HabitCompletion[]>>((acc, completion) => {
    const key = completion.completed_on;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(completion);
    return acc;
  }, {});
}

export function getLastNDays(days: number) {
  return Array.from({ length: days }).map((_, index) => normalizeToISO(subDays(new Date(), days - index - 1)));
}
