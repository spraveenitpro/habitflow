"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerSupabaseClient, getUserId } from "@/lib/supabase";
import { normalizeToISO } from "@/lib/streaks";

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

  const supabase = createServerSupabaseClient();
  const userId = getUserId();

  const { error } = await supabase.from("habits").insert({
    user_id: userId,
    title: parsed.data.title,
    frequency: parsed.data.frequency,
    category: parsed.data.category,
    emoji: parsed.data.emoji
  });

  if (error) {
    throw new Error(error.message);
  }

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

  const supabase = createServerSupabaseClient();
  const userId = getUserId();

  const { error } = await supabase
    .from("habits")
    .update({
      title: parsed.data.title,
      frequency: parsed.data.frequency,
      category: parsed.data.category,
      emoji: parsed.data.emoji
    })
    .match({ id: parsed.data.id, user_id: userId });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

export async function deleteHabit(formData: FormData) {
  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    throw new Error("Missing habit id");
  }

  const supabase = createServerSupabaseClient(true);
  const userId = getUserId();

  const { error } = await supabase.from("habits").delete().match({ id, user_id: userId });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

export async function toggleCompletion(formData: FormData) {
  const habitId = formData.get("habitId");
  const completed = formData.get("completed") === "true";

  if (!habitId || typeof habitId !== "string") {
    throw new Error("Missing habit id");
  }

  const supabase = createServerSupabaseClient(true);
  const userId = getUserId();
  const today = normalizeToISO(new Date());

  if (completed) {
    const { error } = await supabase.from("habit_completions").insert({
      habit_id: habitId,
      user_id: userId,
      completed_on: today
    });

    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("habit_completions")
      .delete()
      .eq("habit_id", habitId)
      .eq("user_id", userId)
      .eq("completed_on", today);

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/dashboard");
}

export async function resetStreak(formData: FormData) {
  const habitId = formData.get("habitId");

  if (!habitId || typeof habitId !== "string") {
    throw new Error("Missing habit id");
  }

  const supabase = createServerSupabaseClient(true);
  const userId = getUserId();

  const { error } = await supabase
    .from("habit_completions")
    .delete()
    .eq("habit_id", habitId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}
