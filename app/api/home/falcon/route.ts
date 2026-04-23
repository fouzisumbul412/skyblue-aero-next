import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.homeFalconSection.findFirst({
      include: {
        gridItems: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!data) {
      return NextResponse.json( { success: false, message: "No data found" }, { status: 404 } );
    }

    const { gridItems, ...rest } = data;

    const formattedData = {
      ...rest,
      leftItems: gridItems.filter((item) => item.side === "LEFT"),
      rightItems: gridItems.filter((item) => item.side === "RIGHT"),
    };

    return NextResponse.json({ success: true, data: formattedData });
  } catch {
    return NextResponse.json( { success: false, message: "Internal Server Error" }, { status: 500 } );
  }
}