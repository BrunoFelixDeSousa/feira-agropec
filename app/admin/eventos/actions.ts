"use server"

import { createEvent, updateEvent, deleteEvent } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createEventAction(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = new Date(formData.get("date") as string)
  const startTime = formData.get("startTime") as string
  const endTime = (formData.get("endTime") as string) || undefined
  const location = formData.get("location") as string
  const category = formData.get("category") as string
  const featured = formData.get("featured") === "on"
  const image = (formData.get("image") as string) || undefined
  const capacity = (formData.get("capacity") as string) || undefined
  const speaker = (formData.get("speaker") as string) || undefined
  const ticketRequired = formData.get("ticketRequired") === "on"
  const ticketPrice = (formData.get("ticketPrice") as string) || undefined
  const tagsString = formData.get("tags") as string
  const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []

  await createEvent({
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    category,
    featured,
    image,
    capacity,
    speaker,
    ticketRequired,
    ticketPrice,
    tags,
  })

  revalidatePath("/admin/eventos")
  revalidatePath("/programacao")
  redirect("/admin/eventos")
}

export async function updateEventAction(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = new Date(formData.get("date") as string)
  const startTime = formData.get("startTime") as string
  const endTime = (formData.get("endTime") as string) || undefined
  const location = formData.get("location") as string
  const category = formData.get("category") as string
  const featured = formData.get("featured") === "on"
  const image = (formData.get("image") as string) || undefined
  const capacity = (formData.get("capacity") as string) || undefined
  const speaker = (formData.get("speaker") as string) || undefined
  const ticketRequired = formData.get("ticketRequired") === "on"
  const ticketPrice = (formData.get("ticketPrice") as string) || undefined
  const tagsString = formData.get("tags") as string
  const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []

  await updateEvent(id, {
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    category,
    featured,
    image,
    capacity,
    speaker,
    ticketRequired,
    ticketPrice,
    tags,
  })

  revalidatePath("/admin/eventos")
  revalidatePath("/programacao")
  revalidatePath(`/admin/eventos/${id}`)
  redirect("/admin/eventos")
}

export async function deleteEventAction(id: string) {
  await deleteEvent(id)

  revalidatePath("/admin/eventos")
  revalidatePath("/programacao")
}
