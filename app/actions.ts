"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { normalizeToISO } from "@/lib/streaks";
import { getUserId } from "@/lib/session";
import {
  addCompletion,
  clearCompletions,
  createHabit as createHabitRecord,
  deleteHabit as deleteHabitRecord,
  removeCompletion,
  updateHabit as updateHabitRecord
} from "@/lib/store";

const habitSchema = z.object({
  title: z.string().min(1).max(64),
  frequency: z.enum(["daily", "weekly", "custom"]),
  category: z.string().max(32).optional().nullable(),
  emoji: z.string().max(2).optional().nullable()
});

const updateHabitSchema = habitSchema.extend({
  id: z.string().uuid()
});

export async function createHabit(formData: FormData) {
  const parsed = habitSchema.safeParse({
    title: formData.get("title"),
    frequency: formData.get("frequency"),
    category: formData.get("category") || null,
    emoji: formData.get("emoji") || null
  });

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const userId = await getUserId();
  createHabitRecord(userId, parsed.data);

  revalidatePath("/dashboard");
}

export async function updateHabit(formData: FormData) {
  const parsed = updateHabitSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    frequency: formData.get("frequency"),
    category: formData.get("category") || null,
    emoji: formData.get("emoji") || null
  });

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const userId = await getUserId();
  updateHabitRecord(userId, parsed.data.id, parsed.data);

  revalidatePath("/dashboard");
}

export async function deleteHabit(formData: FormData) {
  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    throw new Error("Missing habit id");
  }

  const userId = await getUserId();
  deleteHabitRecord(userId, id);

  revalidatePath("/dashboard");
}

export async function toggleCompletion(formData: FormData) {
  const habitId = formData.get("habitId");
  const completed = formData.get("completed") === "true";

  if (!habitId || typeof habitId !== "string") {
    throw new Error("Missing habit id");
  }

  const userId = await getUserId();
  const today = normalizeToISO(new Date());

  if (completed) {
    addCompletion(userId, habitId, today);
  } else {
    removeCompletion(userId, habitId, today);
  }

  revalidatePath("/dashboard");
}

export async function resetStreak(formData: FormData) {
  const habitId = formData.get("habitId");

  if (!habitId || typeof habitId !== "string") {
    throw new Error("Missing habit id");
  }

  const userId = await getUserId();
  clearCompletions(userId, habitId);

  revalidatePath("/dashboard");
}
