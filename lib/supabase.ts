"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const COOKIE_NAME = "habitflow-user";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  throw new Error("Missing SUPABASE_ANON_KEY environment variable");
}

export function getUserId() {
  const store = cookies();
  const id = store.get(COOKIE_NAME)?.value;

  if (!id) {
    throw new Error("User cookie is not set");
  }

  return id;
}

export function createServerSupabaseClient(useServiceKey = false) {
  const key = useServiceKey ? supabaseServiceKey ?? supabaseAnonKey : supabaseAnonKey;

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
