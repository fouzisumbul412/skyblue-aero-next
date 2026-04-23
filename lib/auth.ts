import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
  iat?: number;
  exp?: number;
}

export async function getUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as AuthUser;

    return decoded;
  } catch {
    return null;
  }
}

export async function getAdmin(): Promise<AuthUser | null> {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return user;
}