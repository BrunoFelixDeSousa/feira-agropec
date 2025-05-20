import { prisma } from "./prisma"
import type { Event, Exhibitor, Notification, User, SiteSettings } from "@prisma/client"

// Funções para Events
export async function getAllEvents() {
  return prisma.event.findMany({
    orderBy: { date: "asc" },
  })
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
  })
}

export async function createEvent(data: Omit<Event, "id" | "createdAt" | "updatedAt">) {
  return prisma.event.create({
    data,
  })
}

export async function updateEvent(id: string, data: Partial<Omit<Event, "id" | "createdAt" | "updatedAt">>) {
  return prisma.event.update({
    where: { id },
    data,
  })
}

export async function deleteEvent(id: string) {
  return prisma.event.delete({
    where: { id },
  })
}

export async function getFeaturedEvents() {
  return prisma.event.findMany({
    where: { featured: true },
    orderBy: { date: "asc" },
  })
}

// Funções para Exhibitors
export async function getAllExhibitors() {
  return prisma.exhibitor.findMany({
    orderBy: { name: "asc" },
  })
}

export async function getExhibitorById(id: string) {
  return prisma.exhibitor.findUnique({
    where: { id },
  })
}

export async function createExhibitor(data: Omit<Exhibitor, "id" | "createdAt" | "updatedAt">) {
  return prisma.exhibitor.create({
    data,
  })
}

export async function updateExhibitor(id: string, data: Partial<Omit<Exhibitor, "id" | "createdAt" | "updatedAt">>) {
  return prisma.exhibitor.update({
    where: { id },
    data,
  })
}

export async function deleteExhibitor(id: string) {
  return prisma.exhibitor.delete({
    where: { id },
  })
}

// Funções para Notifications
export async function getAllNotifications() {
  return prisma.notification.findMany({
    orderBy: { timestamp: "desc" },
  })
}

export async function getNotificationById(id: string) {
  return prisma.notification.findUnique({
    where: { id },
  })
}

export async function createNotification(data: Omit<Notification, "id" | "createdAt" | "updatedAt">) {
  return prisma.notification.create({
    data,
  })
}

export async function updateNotification(
  id: string,
  data: Partial<Omit<Notification, "id" | "createdAt" | "updatedAt">>,
) {
  return prisma.notification.update({
    where: { id },
    data,
  })
}

export async function deleteNotification(id: string) {
  return prisma.notification.delete({
    where: { id },
  })
}

export async function markNotificationAsRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  })
}

// Funções para Users
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">) {
  return prisma.user.create({
    data,
  })
}

// Funções para CarouselSlides
export async function getActiveCarouselSlides() {
  return prisma.carouselSlide.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  })
}

export async function getAllCarouselSlides() {
  return prisma.carouselSlide.findMany({
    orderBy: { order: "asc" },
  })
}

// Funções para SiteSettings
export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst()
  if (!settings) {
    // Criar configurações padrão se não existirem
    return prisma.siteSettings.create({
      data: {
        siteName: "Feira Agropecuária",
      },
    })
  }
  return settings
}

export async function updateSiteSettings(data: Partial<Omit<SiteSettings, "id" | "updatedAt">>) {
  const settings = await prisma.siteSettings.findFirst()
  if (settings) {
    return prisma.siteSettings.update({
      where: { id: settings.id },
      data,
    })
  }
  return prisma.siteSettings.create({
    data: {
      siteName: "Feira Agropecuária",
      ...data,
    },
  })
}
