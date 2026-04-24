import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [charterCount, quoteCount, blogCount, galleryCount] = await Promise.all([
      prisma.charterRequest.count(),
      prisma.quoteRequest.count(),
      prisma.blogPost.count(),
      prisma.galleryImage.count(),
    ]);

    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);

    const [chartersThisYear, quotesThisYear] = await Promise.all([
      prisma.charterRequest.findMany({
        where: { createdAt: { gte: startOfYear } },
        select: { createdAt: true }
      }),
      prisma.quoteRequest.findMany({
        where: { createdAt: { gte: startOfYear } },
        select: { createdAt: true }
      })
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = months.map(month => ({ name: month, Charters: 0, Quotes: 0 }));

    chartersThisYear.forEach(req => {
      const monthIndex = req.createdAt.getMonth();
      monthlyData[monthIndex].Charters += 1;
    });

    quotesThisYear.forEach(req => {
      const monthIndex = req.createdAt.getMonth();
      monthlyData[monthIndex].Quotes += 1;
    });

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          charters: charterCount,
          quotes: quoteCount,
          blogs: blogCount,
          gallery: galleryCount
        },
        chartData: monthlyData
      }
    }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}