import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteLeadFromZoho } from "@/lib/zoho";

export async function DELETE( req: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  try {
    const admin = await getAdmin();
    if (!admin){
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const removeFromZoho = searchParams.get("removeFromZoho") === "true";

    if (removeFromZoho) {
      const charter = await prisma.charterRequest.findUnique({
        where: { id },
        select: { zohoId: true }
      });

      if (charter?.zohoId) {
        await deleteLeadFromZoho(charter.zohoId);
      }
    }

    await prisma.charterRequest.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Charter request deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}