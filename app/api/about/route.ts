import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const aboutData = await prisma.aboutPage.findFirst({
      include: {
        counters: { orderBy: { order: "asc" } },
        values: { orderBy: { order: "asc" } },
      },
    });

    if (!aboutData) {
      return NextResponse.json({ success: false, message: "About data not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: aboutData });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}