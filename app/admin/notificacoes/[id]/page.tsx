import { NotificationForm } from "@/components/admin/notification-form"
import { mockNotifications } from "@/lib/mock-data"
import { notFound } from "next/navigation"

export default async function EditNotificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Se for "nova", retornamos um formulário vazio
  if (id === "nova") {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Nova Notificação</h2>
        <NotificationForm />
      </div>
    )
  }

  // Caso contrário, buscamos a notificação pelo ID
  const notification = mockNotifications.find((n) => n.id === id)

  if (!notification) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Editar Notificação</h2>
      <NotificationForm defaultValues={notification} />
    </div>
  )
}
