import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
}
