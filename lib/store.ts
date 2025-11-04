import { nanoid } from "nanoid";
import { Habit, HabitCompletion, HabitWithStats } from "./types";
import { calculateCompletionRate, calculateCurrentStreak, calculateLongestStreak } from "./streaks";

type UserStore = {
  habits: Habit[];
  completions: HabitCompletion[];
};

type HabitflowStore = Map<string, UserStore>;

const STORE_SYMBOL = Symbol.for("habitflow.store");

function getGlobalStore(): HabitflowStore {
  const globalWithStore = globalThis as typeof globalThis & { [STORE_SYMBOL]?: HabitflowStore };

  if (!globalWithStore[STORE_SYMBOL]) {
    globalWithStore[STORE_SYMBOL] = new Map();
  }

  return globalWithStore[STORE_SYMBOL]!;
}

function getUserStore(userId: string): UserStore {
  const store = getGlobalStore();

  if (!store.has(userId)) {
    store.set(userId, { habits: [], completions: [] });
  }

  return store.get(userId)!;
}

function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function listHabitsWithStats(userId: string): HabitWithStats[] {
  const { habits, completions } = getUserStore(userId);

  if (habits.length === 0) {
    return [];
  }

  return habits
    .slice()
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((habit) => {
      const habitCompletions = completions
        .filter((completion) => completion.habit_id === habit.id)
        .slice()
        .sort((a, b) => a.completed_on.localeCompare(b.completed_on));

      return {
        ...deepCopy(habit),
        completions: habitCompletions.map((completion) => deepCopy(completion)),
        currentStreak: calculateCurrentStreak(habitCompletions),
        longestStreak: calculateLongestStreak(habitCompletions),
        completionRate: calculateCompletionRate(habitCompletions, habit.created_at)
      };
    });
}

type HabitInput = {
  title: string;
  frequency: Habit["frequency"];
  category: Habit["category"];
  emoji: Habit["emoji"];
};

export function createHabit(userId: string, data: HabitInput) {
  const userStore = getUserStore(userId);

  const habit: Habit = {
    id: nanoid(),
    user_id: userId,
    title: data.title,
    category: data.category ?? null,
    frequency: data.frequency,
    emoji: data.emoji ?? null,
    created_at: new Date().toISOString()
  };

  userStore.habits.push(habit);
}

export function updateHabit(userId: string, habitId: string, data: HabitInput) {
  const userStore = getUserStore(userId);
  const habitIndex = userStore.habits.findIndex((habit) => habit.id === habitId);

  if (habitIndex === -1) {
    throw new Error("Habit not found");
  }

  userStore.habits[habitIndex] = {
    ...userStore.habits[habitIndex],
    title: data.title,
    category: data.category ?? null,
    frequency: data.frequency,
    emoji: data.emoji ?? null
  };
}

export function deleteHabit(userId: string, habitId: string) {
  const userStore = getUserStore(userId);
  userStore.habits = userStore.habits.filter((habit) => habit.id !== habitId);
  userStore.completions = userStore.completions.filter((completion) => completion.habit_id !== habitId);
}

export function addCompletion(userId: string, habitId: string, completedOn: string) {
  const userStore = getUserStore(userId);
  const habitExists = userStore.habits.some((habit) => habit.id === habitId);

  if (!habitExists) {
    throw new Error("Habit not found");
  }

  const alreadyCompleted = userStore.completions.some(
    (completion) => completion.habit_id === habitId && completion.completed_on === completedOn
  );

  if (alreadyCompleted) {
    return;
  }

  const completion: HabitCompletion = {
    id: nanoid(),
    habit_id: habitId,
    user_id: userId,
    completed_on: completedOn,
    created_at: new Date().toISOString()
  };

  userStore.completions.push(completion);
}

export function removeCompletion(userId: string, habitId: string, completedOn: string) {
  const userStore = getUserStore(userId);
  userStore.completions = userStore.completions.filter(
    (completion) => !(completion.habit_id === habitId && completion.completed_on === completedOn)
  );
}

export function clearCompletions(userId: string, habitId: string) {
  const userStore = getUserStore(userId);
  userStore.completions = userStore.completions.filter((completion) => completion.habit_id !== habitId);
}
