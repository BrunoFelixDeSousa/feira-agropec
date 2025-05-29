import { getAllNotifications } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const notifications = await getAllNotifications()
    return NextResponse.json({ success: true, data: notifications })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
