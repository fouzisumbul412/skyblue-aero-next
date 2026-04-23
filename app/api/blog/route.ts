import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN";

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search");

    const whereClause: any = {};
    if (!isAdmin) {
      whereClause.published = true;
    }

    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { category: { contains: searchQuery, mode: "insensitive" } },
        { excerpt: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        thumbnail: true,
        category: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: posts }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}