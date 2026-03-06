import { NextRequest, NextResponse } from "next/server";

const VALID_CREDENTIALS = {
  email: "admin@admin.com",
  password: "password123",
};

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (
    email === VALID_CREDENTIALS.email &&
    password === VALID_CREDENTIALS.password
  ) {
    return NextResponse.json({
      success: true,
      user: { email, name: "Admin User" },
    });
  }

  return NextResponse.json(
    { success: false, error: "Invalid email or password" },
    { status: 401 }
  );
}
