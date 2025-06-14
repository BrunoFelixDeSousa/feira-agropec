"use server"

import {
  getActiveCarouselSlides,
  getAllCarouselSlides
} from "@/lib/db";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllSlides() {
  try {
    const slides = await getAllCarouselSlides();
    return { success: true, data: slides };
  } catch (error) {
    console.error("Erro ao buscar slides:", error);
    return { success: false, error: "Falha ao buscar slides" };
  }
}

export async function getActiveSlides() {
  try {
    const slides = await getActiveCarouselSlides();
    return { success: true, data: slides };
  } catch (error) {
    console.error("Erro ao buscar slides ativos:", error);
    return { success: false, error: "Falha ao buscar slides ativos" };
  }
}

export async function createSlide(data: any) {
  try {
    // Verificar a ordem máxima atual
    const maxOrderSlide = await prisma.carouselSlide.findFirst({
      orderBy: { order: 'desc' }
    });
    
    const order = maxOrderSlide ? maxOrderSlide.order + 1 : 1;
    
    const slide = await prisma.carouselSlide.create({
      data: {
        ...data,
        order
      }
    });
    
    revalidatePath("/");
    revalidatePath("/admin/carousel");
    
    return { success: true, data: slide };
  } catch (error) {
    console.error("Erro ao criar slide:", error);
    return { success: false, error: "Falha ao criar slide" };
  }
}

export async function updateSlide(id: string, data: any) {
  try {
    const slide = await prisma.carouselSlide.update({
      where: { id },
      data
    });
    
    revalidatePath("/");
    revalidatePath("/admin/carousel");
    
    return { success: true, data: slide };
  } catch (error) {
    console.error(`Erro ao atualizar slide ${id}:`, error);
    return { success: false, error: "Falha ao atualizar slide" };
  }
}

export async function deleteSlide(id: string) {
  try {
    await prisma.carouselSlide.delete({
      where: { id }
    });
    
    revalidatePath("/");
    revalidatePath("/admin/carousel");
    
    return { success: true };
  } catch (error) {
    console.error(`Erro ao excluir slide ${id}:`, error);
    return { success: false, error: "Falha ao excluir slide" };
  }
}

export async function updateSlidesOrder(orderedIds: string[]) {
  try {
    // Atualizar a ordem de todos os slides em uma transação
    await prisma.$transaction(
      orderedIds.map((id, index) => 
        prisma.carouselSlide.update({
          where: { id },
          data: { order: index + 1 }
        })
      )
    );
    
    revalidatePath("/");
    revalidatePath("/admin/carousel");
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao reordenar slides:", error);
    return { success: false, error: "Falha ao reordenar slides" };
  }
}
