import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { uploadImage, deleteFile } from "@/lib/uploads";
import z from "zod";
import { prisma } from "@/lib/prisma";

const aboutSchema = z.object({
  heroTitle: z.string().min(1, "Hero title is required").default("Built on Trust. Driven by Excellence."),
  heroSubtitle: z.string().min(1, "Hero subtitle is required").default("About Us"),
  title: z.string().min(1, "Story title is required").default("Our Story"),
  storyHeading: z.string().min(1, "Story heading is required").default("Aviation Expertise,\nDelivered with Precision."),
  content: z.string().min(1, "Story content is required"),
  counters: z.array(z.object({
    label: z.string().min(1),
    endValue: z.number().int(),
    suffix: z.string().optional().nullable(),
    order: z.number().default(0)
  })).length(4, "The Bento Grid requires exactly 4 counter cards"),
  values: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    order: z.number().default(0)
  })).length(3, "The Bento Grid requires exactly 3 value cards")
});

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    
    const counters = JSON.parse(formData.get("counters") as string || "[]");
    const values = JSON.parse(formData.get("values") as string || "[]");

    const validation = aboutSchema.safeParse({
      heroTitle: formData.get("heroTitle"),
      heroSubtitle: formData.get("heroSubtitle"),
      title: formData.get("title"),
      content: formData.get("content"),
      counters,
      values,
    });

    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const data = validation.data;
    const existing = await prisma.aboutPage.findFirst();

    let heroImagePath = existing?.heroImage;
    let storyImagePath = existing?.image;

    const heroFile = formData.get("heroImage") as File | null;
    const storyFile = formData.get("storyImage") as File | null;

    if (heroFile && heroFile.size > 0) {
      if (existing?.heroImage) await deleteFile(existing.heroImage);
      heroImagePath = await uploadImage(heroFile, "about");
    }

    if (storyFile && storyFile.size > 0) {
      if (existing?.image) await deleteFile(existing.image);
      storyImagePath = await uploadImage(storyFile, "about");
    }

    let page;

    // update
    if (existing){
        page = await prisma.aboutPage.update({
            where: { id: existing.id },
            data: {
                heroTitle: data.heroTitle,
                heroSubtitle: data.heroSubtitle,
                heroImage: heroImagePath!,
                title: data.title,
                content: data.content,
                image: storyImagePath!,
            }
        });
    }
    // create
    else{
        page = await prisma.aboutPage.create({
            data: {
              heroTitle: data.heroTitle,
              heroSubtitle: data.heroSubtitle,
              heroImage: heroImagePath || "",
              title: data.title,
              content: data.content,
              image: storyImagePath || "",
            }
        });
    }

    await prisma.aboutCounter.deleteMany({ where: { aboutPageId: page.id } });
    await prisma.aboutCounter.createMany({
        data: data.counters.map(c => ({ ...c, aboutPageId: page.id }))
    });

    await prisma.aboutValue.deleteMany({ where: { aboutPageId: page.id } });
    await prisma.aboutValue.createMany({
        data: data.values.map(v => ({ ...v, aboutPageId: page.id }))
    });

    return NextResponse.json({ success: true, message: "About page updated successfully" }, { status: 200 });
  } catch {
     return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}