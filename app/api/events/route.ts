import { getAllEvents } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await getAllEvents();
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Falha ao buscar eventos" }, { status: 500 });
  }
}
