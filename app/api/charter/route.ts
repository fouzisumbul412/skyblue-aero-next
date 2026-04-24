import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pushLeadToZoho } from "@/lib/zoho";
import { z } from "zod";

const charterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone number required"),
  departure: z.string().min(1, "Departure city required"),
  arriving: z.string().min(1, "Arriving city required"),
  passengers: z.string().min(1, "Passenger count required"),
  departureDate: z.coerce.date(),
  returnDate: z.coerce.date().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = charterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json( { success: false, message: validation.error.issues[0].message }, { status: 400 } );
    }

    const { name, email, phone, departure, arriving, passengers, departureDate, returnDate } = validation.data;

    const charter = await prisma.charterRequest.create({
      data: { name, email, phone, departure, arriving, passengers, departureDate, returnDate }
    });

    const nameParts = name.trim().split(" ");
    const lastName = nameParts.length > 1 ? nameParts.pop() : name;
    const firstName = nameParts.length > 0 ? nameParts.join(" ") : "";

    const flightDetails = `
    --- CHARTER FLIGHT REQUEST ---
    Routing: ${departure} ✈️ ${arriving}
    Passengers: ${passengers}
    Departure Date: ${departureDate.toDateString()}
    Return Date: ${returnDate ? returnDate.toDateString() : 'One-Way'}
        `.trim();

    const zohoPayload = {
      First_Name: firstName,
      Last_Name: lastName,
      Email: email,
      Phone: phone,
      Company: "Individual",
      Description: flightDetails,
      Lead_Source: "Website Charter Form",
    };

    const zohoId = await pushLeadToZoho(zohoPayload);
    
    if (zohoId) {
      await prisma.charterRequest.update({ 
        where: { id: charter.id }, 
        data: { zohoSynced: true, zohoId } 
      });
    }

    return NextResponse.json( { success: true, message: "Charter request submitted successfully" }, { status: 201 } );

  } catch {
    return NextResponse.json( { success: false, message: "Internal Server Error" }, { status: 500 } );
  }
}