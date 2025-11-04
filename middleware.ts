import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const COOKIE_NAME = "habitflow-user";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!request.cookies.get(COOKIE_NAME)) {
    response.cookies.set(COOKIE_NAME, nanoid(), {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });
  }

  return response;
}

export const config = {
  matcher: ["/:path*"]
};
