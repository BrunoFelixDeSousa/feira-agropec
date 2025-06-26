import { NotificationForm } from "@/components/admin/notification-form"
import { getNotificationById } from "@/lib/db"
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

  try {
    // Caso contrário, buscamos a notificação pelo ID
    const notification = await getNotificationById(id)

  if (!notification) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Editar Notificação</h2>
      <NotificationForm defaultValues={notification} />
    </div>
  )
  } catch (error) {
    console.error("Erro ao buscar notificação:", error)
    notFound()
  }
  
}
