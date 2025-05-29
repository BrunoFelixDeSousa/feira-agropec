"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getAllEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    })
    return { success: true, data: events }
  } catch (error) {
    console.error("Erro ao buscar eventos:", error)
    return { success: false, error: "Falha ao buscar eventos" }
  }
}

export async function getEventById(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
    })
    return { success: true, data: event }
  } catch (error) {
    console.error(`Erro ao buscar evento ${id}:`, error)
    return { success: false, error: "Falha ao buscar evento" }
  }
}

export async function createEvent(data: any) {
  try {
    const event = await prisma.event.create({
      data,
    })
    revalidatePath("/programacao")
    revalidatePath("/admin/eventos")
    return { success: true, data: event }
  } catch (error) {
    console.error("Erro ao criar evento:", error)
    return { success: false, error: "Falha ao criar evento" }
  }
}

export async function updateEvent(id: string, data: any) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data,
    })
    revalidatePath("/programacao")
    revalidatePath("/admin/eventos")
    revalidatePath(`/admin/eventos/${id}`)
    return { success: true, data: event }
  } catch (error) {
    console.error(`Erro ao atualizar evento ${id}:`, error)
    return { success: false, error: "Falha ao atualizar evento" }
  }
}

export async function deleteEvent(id: string) {
  try {
    await prisma.event.delete({
      where: { id },
    })
    revalidatePath("/programacao")
    revalidatePath("/admin/eventos")
    return { success: true }
  } catch (error) {
    console.error(`Erro ao excluir evento ${id}:`, error)
    return { success: false, error: "Falha ao excluir evento" }
  }
}


