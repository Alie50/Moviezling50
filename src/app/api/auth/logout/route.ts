import { NextResponse } from "next/server";
import { logoutAdmin } from "@/lib/auth";

export async function POST() {
  try {
    await logoutAdmin();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
