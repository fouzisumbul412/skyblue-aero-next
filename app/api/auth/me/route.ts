import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const authUser = await getUser();

    if (!authUser) {
      return NextResponse.json( { success: false, message: "Unauthorized" }, { status: 401 } );
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    if (!user) {
      return NextResponse.json( { success: false, message: "User no longer exists" }, { status: 401 } );
    }

    return NextResponse.json( { success: true, user: user }, { status: 200 } );

  } catch {
    return NextResponse.json( { success: false, message: "Internal server error" }, { status: 500 } );
  }
}