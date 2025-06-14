"use server"

import { getSiteSettings, updateSiteSettings } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    const settings = await getSiteSettings();
    return { success: true, data: settings };
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return { success: false, error: "Falha ao buscar configurações" };
  }
}

export async function updateSettings(data: any) {
  try {
    // Remove qualquer propriedade que pode não existir no esquema do banco de dados
    const safeData = { ...data };
    
    // Se houver incompatibilidade de esquema, esses campos podem causar problemas
    const settings = await updateSiteSettings(safeData);
    
    // Revalidar todas as páginas que podem depender dessas configurações
    revalidatePath("/");
    revalidatePath("/admin/configuracoes");
    
    return { success: true, data: settings };
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return { success: false, error: "Falha ao atualizar configurações" };
  }
}
