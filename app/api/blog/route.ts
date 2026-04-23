import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN";

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search");
    const relatedCategory = searchParams.get("related");
    const excludeSlug = searchParams.get("exclude");
    const limit = searchParams.get("limit");

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

    if (relatedCategory) {
      whereClause.category = relatedCategory;
    }

    if (excludeSlug) {
      whereClause.slug = { not: excludeSlug };
    }

    const takeCount = limit ? parseInt(limit, 10) : (relatedCategory ? 5 : undefined);

    const posts = await prisma.blogPost.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: takeCount, 
    });

    return NextResponse.json({ success: true, data: posts }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}