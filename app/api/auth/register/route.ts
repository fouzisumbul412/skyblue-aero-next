import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json( { success: false, message: result.error.issues[0] }, { status: 400 } );
    }

    const { email, password, name } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json( { success: false, message: "User already exists" }, { status: 409 } );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword }
    });

    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, 
        path: "/",
    });

    return NextResponse.json( { success: true, message: "User registered successfully" }, { status: 201 } );
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}