"use server"

import { createEvent, deleteEvent, updateEvent } from "@/lib/db"
import { mkdir, writeFile } from "fs/promises"
import { revalidatePath } from "next/cache"
import path from "path"

// Função para salvar arquivo de imagem
async function saveImageFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Gerar nome único para o arquivo
  const timestamp = Date.now()
  const extension = path.extname(file.name)
  const filename = `event-${timestamp}${extension}`
  
  // Caminho onde salvar o arquivo
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'events')
  const filepath = path.join(uploadDir, filename)
  
  // Criar diretório se não existir
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (error) {
    // Diretório já existe
  }
  
  // Salvar o arquivo
  await writeFile(filepath, buffer)
  
  // Retornar caminho público
  return `/uploads/events/${filename}`
}

export async function createEventAction(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = new Date(formData.get("date") as string).toISOString().split("T")[0] // 'YYYY-MM-DD'
  const time = formData.get("time") as string
  const endTime = (formData.get("endTime") as string) || null
  const location = formData.get("location") as string
  const type = formData.get("type") as string
  const featured = formData.get("featured") === "on"
  const tagsString = formData.get("tags") as string
  const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []
  
  // Lidar com imagem
  let image: string | null = null
  const imageFile = formData.get("imageFile") as File
  const imageUrl = formData.get("image") as string
  
  if (imageFile && imageFile.size > 0) {
    image = await saveImageFile(imageFile)
  } else if (imageUrl) {
    image = imageUrl
  }

  await createEvent({
    title,
    description,
    date,
    time,
    endTime,
    location,
    type,
    featured,
    image,
    tags,
  })

  revalidatePath("/admin/programacao")
  revalidatePath("/programacao")
}

export async function updateEventAction(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = new Date(formData.get("date") as string).toISOString().split("T")[0]
  const time = formData.get("time") as string
  const endTime = (formData.get("endTime") as string) || null
  const location = formData.get("location") as string
  const type = formData.get("type") as string
  const featured = formData.get("featured") === "on"
  const tagsString = formData.get("tags") as string
  const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []
  
  // Lidar com imagem
  let image: string | null = null
  const imageFile = formData.get("imageFile") as File
  const imageUrl = formData.get("image") as string
  
  if (imageFile && imageFile.size > 0) {
    image = await saveImageFile(imageFile)
  } else if (imageUrl) {
    image = imageUrl
  }

  await updateEvent(id, {
    title,
    description,
    date,
    time,
    endTime,
    location,
    type,
    featured,
    image,
    tags,
  })

  revalidatePath("/admin/programacao")
  revalidatePath("/programacao")
  revalidatePath(`/admin/programacao/${id}`)
}

export async function deleteEventAction(id: string) {
  await deleteEvent(id)

  revalidatePath("/admin/programacao")
  revalidatePath("/programacao")
}
