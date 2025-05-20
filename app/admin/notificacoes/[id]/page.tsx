import { notFound } from "next/navigation"
import { NotificationForm } from "@/components/admin/notification-form"
import { mockNotifications } from "@/lib/mock-data"

export default function EditNotificationPage({ params }: { params: { id: string } }) {
  // Se for "nova", retornamos um formulário vazio
  if (params.id === "nova") {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Nova Notificação</h2>
        <NotificationForm />
      </div>
    )
  }

  // Caso contrário, buscamos a notificação pelo ID
  const notification = mockNotifications.find((n) => n.id === params.id)

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
