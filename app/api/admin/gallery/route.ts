import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { uploadImage } from "@/lib/uploads";
import z from "zod";
import { prisma } from "@/lib/prisma";

const gallerySchema = z.object({
  order: z.preprocess((val) => Number(val), z.number().int().default(0)),
});

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    
    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ success: false, message: "Image is required" }, { status: 400 });
    }

    const validation = gallerySchema.safeParse({
      order: formData.get("order")
    });

    const order = validation.success ? validation.data.order : 0;

    const url = await uploadImage(imageFile, "gallery");

    await prisma.galleryImage.create({ data: { url, order } });

    return NextResponse.json({ success: true, message: "Image added to gallery" }, { status: 201 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}