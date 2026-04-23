import { getFeatures } from "@/app/actions/AsanaActions"
import { NextRequest,NextResponse } from "next/server"
export const GET = async (req: NextRequest) => {
    const response = await getFeatures();
    return NextResponse.json(response);
}