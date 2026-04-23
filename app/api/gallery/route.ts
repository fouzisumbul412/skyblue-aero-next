import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: images }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch gallery" }, { status: 500 });
  }
}