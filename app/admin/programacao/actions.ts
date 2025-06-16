"use server"

import { createEvent, deleteEvent, updateEvent } from "@/lib/db"
import { paths } from "@/lib/paths"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createEventAction(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = new Date(formData.get("date") as string).toISOString().split("T")[0] // 'YYYY-MM-DD'
  const startTime = formData.get("startTime") as string
  const endTime = (formData.get("endTime") as string) || null
  const location = formData.get("location") as string
  const category = formData.get("category") as string
  const featured = formData.get("featured") === "on"
  const image = (formData.get("image") as string) || null
  const tagsString = formData.get("tags") as string
  const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []

  await createEvent({
    title,
    description,
    date,
    time: startTime,
    endTime,
    location,
    type: category,
    featured,
    image,
    tags,
  })

  revalidatePath(paths.admin.eventos)
  revalidatePath("/programacao")
  redirect(paths.admin.eventos)
}

export async function updateEventAction(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = new Date(formData.get("date") as string).toISOString().split("T")[0]
  const startTime = formData.get("startTime") as string
  const endTime = (formData.get("endTime") as string) || null
  const location = formData.get("location") as string
  const category = formData.get("category") as string
  const featured = formData.get("featured") === "on"
  const image = (formData.get("image") as string) || null
  const tagsString = formData.get("tags") as string
  const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []

  await updateEvent(id, {
    title,
    description,
    date,
    time: startTime,
    endTime,
    location,
    type: category,
    featured,
    image,
    tags,
  })

  revalidatePath(paths.admin.eventos)
  revalidatePath("/programacao")
  revalidatePath(`${paths.admin.eventos}/${id}`)
  redirect(paths.admin.eventos)
}

export async function deleteEventAction(id: string) {
  await deleteEvent(id)

  revalidatePath(paths.admin.eventos)
  revalidatePath("/programacao")
}
