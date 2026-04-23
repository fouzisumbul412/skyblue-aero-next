import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { deleteFile, uploadImage } from "@/lib/uploads";
import z from "zod";
import { prisma } from "@/lib/prisma";

const falconSchema = z.object({
  title: z.string().min(1, "Title is required").default("DASSAULT FALCON"),
  planeModel: z.string().min(1, "Model is required").default("900EX"),
  subtitle: z.string().min(1, "Subtitle is required").default("LONG-RANGE PRIVATE AIRCRAFT"),
  description: z.string().min(1, "Description is required"),
  leftGridTitle: z.string().min(1, "Left grid title is required").default("FEATURES"),
  rightGridTitle: z.string().min(1, "Right grid title is required").default("NSOP"),
  gridItems: z.array(z.object({
    side: z.enum(["LEFT", "RIGHT"]),
    label: z.string().min(1),
    value: z.string().min(1),
    order: z.number().default(0)
  }))
});

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    
    const rawGridItems = formData.get("gridItems") as string;
    const parsedGridItems = rawGridItems ? JSON.parse(rawGridItems) : [];

    const validation = falconSchema.safeParse({
      title: formData.get("title"),
      planeModel: formData.get("planeModel"),
      subtitle: formData.get("subtitle"),
      description: formData.get("description"),
      leftGridTitle: formData.get("leftGridTitle"),
      rightGridTitle: formData.get("rightGridTitle"),
      gridItems: parsedGridItems,
    });

    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const data = validation.data;

    const existingSection = await prisma.homeFalconSection.findFirst();

    let backgroundPath: string | undefined;
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      if (existingSection?.backgroundImage) {
        await deleteFile(existingSection.backgroundImage);
      }
      backgroundPath = await uploadImage(imageFile, "home");
    }

    let section;

    // update
    if (existingSection) {
        section = await prisma.homeFalconSection.update({
            where: { id: existingSection.id },
            data: {
                title: data.title,
                planeModel: data.planeModel,
                subtitle: data.subtitle,
                description: data.description,
                leftGridTitle: data.leftGridTitle,
                rightGridTitle: data.rightGridTitle,
                ...(backgroundPath && { backgroundImage: backgroundPath }),
            },
        });
    } 
    // create
    else {
        if (!backgroundPath) {
          return NextResponse.json({ success: false, message: "Background image is required" }, { status: 400 });
        }
        
        section = await prisma.homeFalconSection.create({
          data: {
            title: data.title,
            planeModel: data.planeModel,
            subtitle: data.subtitle,
            description: data.description,
            leftGridTitle: data.leftGridTitle,
            rightGridTitle: data.rightGridTitle,
            backgroundImage: backgroundPath,
          },
        });
    }

    await prisma.falconGridItem.deleteMany({ where: { sectionId: section.id } });
      
    await prisma.falconGridItem.createMany({
        data: data.gridItems.map((item) => ({
            sectionId: section.id,
            side: item.side,
            label: item.label,
            value: item.value,
            order: item.order,
        })),
    });

    return NextResponse.json({ success: true, message: "Falcon section updated successfully" }, { status: 200 });

  } catch {
    return NextResponse.json( { success: false, message: "Internal Server Error" }, { status: 500 } );
  }
}