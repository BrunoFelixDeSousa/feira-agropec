import type {
  Event,
  Exhibitor,
  Notification,
  NotificationType,
  User,
  UserRole,
  SiteSettings,
  CarouselSlide,
} from "@prisma/client"

// Re-exportar os tipos do Prisma
export type { Event, Exhibitor, Notification, NotificationType, User, UserRole, SiteSettings, CarouselSlide }

// Tipos adicionais que não estão no Prisma
export interface EventWithRelations extends Event {
  // Adicione relações aqui quando necessário
}

export interface ExhibitorWithRelations extends Exhibitor {
  // Adicione relações aqui quando necessário
}

export interface NotificationWithRelations extends Notification {
  // Adicione relações aqui quando necessário
}

export interface UserWithoutPassword extends Omit<User, "password"> {
  // Versão do usuário sem a senha para uso em APIs
}

// Tipos para autenticação
export interface Session {
  user: UserWithoutPassword
  expires: string
}

// Tipos para formulários
export interface LoginFormData {
  email: string
  password: string
}
