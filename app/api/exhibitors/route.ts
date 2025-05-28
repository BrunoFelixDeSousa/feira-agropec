import { getAllExhibitors } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const exhibitors = await getAllExhibitors();
    return NextResponse.json({ success: true, data: exhibitors });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Falha ao buscar expositores" }, { status: 500 });
  }
}
