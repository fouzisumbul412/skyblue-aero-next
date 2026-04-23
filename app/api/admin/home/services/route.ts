import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import z from "zod";
import { prisma } from "@/lib/prisma";

const servicesSchema = z.object({
  title: z.string().min(1, "Main section title is required").default("AVIATION SOLUTIONS, PRECISELY TAILORED TO EVERY JOURNEY"),
  cards: z.array(z.object({
    title: z.string().min(1, "Card title is required"),
    description: z.string().min(1, "Description is required"),
    order: z.number().int()
  })).length(5, "The Bento Grid requires exactly 5 service cards")
});

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const validation = servicesSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const { title, cards } = validation.data;

    const existingConfig = await prisma.homeServicesConfig.findFirst();

    let config;
    
    // update
    if (existingConfig) {
        config = await prisma.homeServicesConfig.update({ where: { id: existingConfig.id }, data: { title } });
    }
    // create
    else {
        config = await prisma.homeServicesConfig.create({ data: { title } });
    }

    await prisma.homeServiceCard.deleteMany({ where: { configId: config.id } });
    
    await prisma.homeServiceCard.createMany({
        data: cards.map((card) => ({
            configId: config.id,
            title: card.title,
            description: card.description,
            order: card.order,
        })),
    });

    return NextResponse.json({ success: true, message: "Services section updated successfully" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 }) };
}