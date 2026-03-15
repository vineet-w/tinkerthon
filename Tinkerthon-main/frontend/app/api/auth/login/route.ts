import { NextRequest, NextResponse } from "next/server";
import { signToken, getAdminCredentials, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const creds = getAdminCredentials();

    if (username !== creds.username || password !== creds.password) {
      return NextResponse.json(
        { error: "ACCESS DENIED: Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({ username, role: "admin" });

    const response = NextResponse.json(
      { message: "ACCESS GRANTED", role: "admin" },
      { status: 200 }
    );

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Invalid request" },
      { status: 400 }
    );
  }
}
