import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN";

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    
    const relatedCategory = searchParams.get("related");
    const excludeSlug = searchParams.get("exclude");

    const whereClause: any = {};
    
    if (!isAdmin) {
      whereClause.published = true;
    } else {
      if (status === "published") whereClause.published = true;
      if (status === "draft") whereClause.published = false;
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

    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit, 
      }),
      prisma.blogPost.count({ where: whereClause })
    ]);

    return NextResponse.json({ 
      success: true, 
      data: posts,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}