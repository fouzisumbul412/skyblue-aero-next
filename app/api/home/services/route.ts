import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = await prisma.homeServicesConfig.findFirst({
      include: {
        cards: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!config) {
      return NextResponse.json({ success: false, message: "Services config not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: config });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}