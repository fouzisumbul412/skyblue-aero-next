import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN";


    const whereClause: any = { slug };
    if (!isAdmin) {
      whereClause.published = true;
    }

    const post = await prisma.blogPost.findFirst({ where: whereClause });

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}