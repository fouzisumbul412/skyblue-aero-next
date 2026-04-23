import { getFaqs } from "@/app/actions/AsanaActions";
import { NextRequest, NextResponse } from "next/server";
export const GET = async (req: NextRequest) => {
    const response = await getFaqs();
    return NextResponse.json(response);
};