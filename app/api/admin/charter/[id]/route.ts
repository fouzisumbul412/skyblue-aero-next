import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE( req: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  try {
    const admin = await getAdmin();
    if (!admin){
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.charterRequest.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Charter request deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}