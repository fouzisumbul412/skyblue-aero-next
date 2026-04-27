import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest,{ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const page = await prisma.dynamicPage.findUnique({
      where: { slug: slug },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            items: { orderBy: { order: "asc" } },
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ success: false, message: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: page }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}