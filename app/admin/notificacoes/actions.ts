"use server"

import { deleteNotification } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function deleteNotificationAction(id: string) {
  await deleteNotification(id)

  revalidatePath("/admin/notificacoes")
  revalidatePath("/notificacoes")
}
