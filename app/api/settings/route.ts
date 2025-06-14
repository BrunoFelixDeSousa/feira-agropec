import { getSiteSettings } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Falha ao buscar configurações" },
      { status: 500 }
    );
  }
}
