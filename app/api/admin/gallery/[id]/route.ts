import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { deleteFile } from "@/lib/uploads";
import { prisma } from "@/lib/prisma";
import z from "zod";

const gallerySchema = z.object({
  order: z.preprocess((val) => Number(val), z.number().int().default(0)),
});

export async function PATCH( req: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id: imageId } = await params;
    const body = await req.json();

    const validation = gallerySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json( { success: false, message: validation.error.issues[0].message }, { status: 400 } );
    }

    const image = await prisma.galleryImage.findUnique({ where: { id: imageId } });
    if (!image) {
      return NextResponse.json( { success: false, message: "Image not found" }, { status: 404 } );
    }

    await prisma.galleryImage.update({
      where: { id: imageId },
      data: { order: validation.data.order },
    });

    return NextResponse.json( { success: true, message: "Order updated successfully" }, { status: 200 } );
  } catch {
    return NextResponse.json( { success: false, message: "Internal Server Error" }, { status: 500 } );
  }
}

export async function DELETE( req: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  try {
    const admin = await getAdmin();
    if (!admin){
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id: imageId } = await params;

    const image = await prisma.galleryImage.findUnique({ where: { id: imageId } });
    if (!image) {
      return NextResponse.json({ success: false, message: "Image not found" }, { status: 404 });
    }

    await deleteFile(image.url);

    await prisma.galleryImage.delete({ where: { id: imageId } });

    return NextResponse.json({ success: true, message: "Image deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}