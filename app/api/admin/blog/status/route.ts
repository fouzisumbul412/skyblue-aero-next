import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin){
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id, published } = await req.json();

    if (!id){
        return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    await prisma.blogPost.update({
      where: { id },
      data: { published },
    });

    return NextResponse.json({ success: true, message: "Status updated successfully" });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}