import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pushLeadToZoho } from "@/lib/zoho";
import z from "zod";

const quoteSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = quoteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const { fullName, phone, email, message } = validation.data;

    const quote = await prisma.quoteRequest.create({ data: { fullName, phone, email, message } });

    const nameParts = fullName.trim().split(" ");
    const lastName = nameParts.length > 1 ? nameParts.pop() : fullName;
    const firstName = nameParts.length > 0 ? nameParts.join(" ") : "";

    const zohoPayload = {
      First_Name: firstName,
      Last_Name: lastName,
      Email: email,
      Phone: phone,
      Company: "Individual",
      Description: message,
      Lead_Source: "Website Contact Form"
    };

    const isSynced = await pushLeadToZoho(zohoPayload);

    if (isSynced) {
      await prisma.quoteRequest.update({ where: { id: quote.id }, data: { zohoSynced: true } });
    }

    return NextResponse.json({ success: true, message: "Quote requested successfully" }, { status: 201 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}