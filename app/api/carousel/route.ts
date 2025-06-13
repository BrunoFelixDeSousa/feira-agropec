import { getAllCarouselSlides } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const slides = await getAllCarouselSlides();
    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Falha ao buscar slides" },
      { status: 500 }
    );
  }
}
