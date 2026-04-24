import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const skip = (page - 1) * limit;

    const [images, totalCount] = await Promise.all([
      prisma.galleryImage.findMany({
        orderBy: { order: "asc" },
        skip,
        take: limit,
      }),
      prisma.galleryImage.count(),
    ]);

    return NextResponse.json({ 
      success: true, 
      data: images,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch gallery" }, { status: 500 });
  }
}