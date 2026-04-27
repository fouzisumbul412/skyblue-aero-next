import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage, deleteFile } from "@/lib/uploads";
import { dynamicPageSchema } from "./validation";

export async function POST( req: NextRequest,  { params }: { params: Promise<{ slug: string }> } ) {
  try {
    const admin = await getAdmin();
    if (!admin){
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const formData = await req.formData();
    
    const pageDataString = formData.get("pageData") as string || "{}";
    const parsedData = JSON.parse(pageDataString);

    const validation = dynamicPageSchema.safeParse(parsedData);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const data = validation.data;
    const existingPage = await prisma.dynamicPage.findUnique({
      where: { slug },
      include: { sections: { include: { items: true } } }
    });

    let heroImagePath = data.heroImage || "";
    const heroFile = formData.get("heroImage") as File | null;
    if (heroFile && heroFile.size > 0) {
      heroImagePath = await uploadImage(heroFile, `pages/${slug}`);
    }

    for (let sIndex = 0; sIndex < data.sections.length; sIndex++) {
      const section = data.sections[sIndex];
      
      const sectionFile = formData.get(`section_${sIndex}_image`) as File | null;
      if (sectionFile && sectionFile.size > 0) {
        section.image = await uploadImage(sectionFile, `pages/${slug}/sections`);
      }

      for (let iIndex = 0; iIndex < section.items.length; iIndex++) {
        const item = section.items[iIndex];
        const itemFile = formData.get(`item_${sIndex}_${iIndex}_image`) as File | null;
        if (itemFile && itemFile.size > 0) {
          item.image = await uploadImage(itemFile, `pages/${slug}/items`);
        }
      }
    }

    if (existingPage) {
      const oldImages = [
        existingPage.heroImage,
        ...existingPage.sections.map(s => s.image),
        ...existingPage.sections.flatMap(s => s.items.map(i => i.image))
      ].filter(Boolean) as string[];

      const newImages = [
        heroImagePath,
        ...data.sections.map(s => s.image),
        ...data.sections.flatMap(s => s.items.map(i => i.image))
      ].filter(Boolean) as string[];

      const imagesToDelete = oldImages.filter(oldImg => !newImages.includes(oldImg));
      for (const imgUrl of imagesToDelete) {
        await deleteFile(imgUrl);
      }
    }

    await prisma.$transaction(async (tx) => {
      const page = await tx.dynamicPage.upsert({
        where: { slug },
        update: { 
          heroTitle: data.heroTitle, heroSubtitle: data.heroSubtitle, 
          heroDesc: data.heroDesc, heroImage: heroImagePath 
        },
        create: { 
          slug, heroTitle: data.heroTitle, heroSubtitle: data.heroSubtitle, 
          heroDesc: data.heroDesc, heroImage: heroImagePath 
        },
      });

      await tx.pageSection.deleteMany({ where: { pageId: page.id } });

      for (const sec of data.sections) {
        await tx.pageSection.create({
          data: {
            pageId: page.id,
            type: sec.type,
            order: sec.order,
            title: sec.title, subtitle: sec.subtitle, description: sec.description,
            image: sec.image, badgeIcon: sec.badgeIcon, badgeTitle: sec.badgeTitle,
            badgeDesc: sec.badgeDesc, buttonText: sec.buttonText, buttonLink: sec.buttonLink,
            tags: sec.tags && sec.tags.length > 0 ? sec.tags : undefined,
            items: {
              create: sec.items.map(item => ({
                order: item.order, title: item.title, subtitle: item.subtitle,
                description: item.description, icon: item.icon, image: item.image,
                bullets: item.bullets && item.bullets.length > 0 ? item.bullets : undefined,
                extraData: item.extraData ? JSON.stringify(item.extraData) : undefined,
              })),
            },
          },
        });
      }
    });

    return NextResponse.json({ success: true, message: "Page saved successfully!" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}