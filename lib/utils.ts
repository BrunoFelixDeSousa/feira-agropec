import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Faz parse seguro de uma data no formato YYYY-MM-DD evitando problemas de fuso horário
 * @param dateString - String da data no formato YYYY-MM-DD
 * @returns Date object no fuso horário local
 */
export function parseEventDate(dateString: string): Date {
  if (!dateString) {
    return new Date();
  }

  // Se a data está no formato YYYY-MM-DD, fazer parse manual
  if (dateString.includes("-") && dateString.length === 10) {
    const [year, month, day] = dateString.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Se for ISO string completa, extrair apenas a parte da data
  if (dateString.includes("T")) {
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Fallback
  return new Date(dateString);
}
