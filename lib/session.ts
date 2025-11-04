"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "habitflow-user";

export async function getUserId() {
  const store = cookies();
  const id = store.get(COOKIE_NAME)?.value;

  if (!id) {
    throw new Error("User cookie is not set");
  }

  return id;
}
