import { cookies } from "next/headers";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const admin = cookieStore.get("admin_authenticated");
  return admin?.value === "true";
}

export async function authenticateAdmin(username: string, password: string) {
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies();
    cookieStore.set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    return true;
  }
  return false;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set("admin_authenticated", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}
