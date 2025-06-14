import { EventForm } from "@/components/admin/event-form"
import { mockEvents } from "@/lib/mock-data"
import { notFound } from "next/navigation"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Se for "novo", retornamos um formulário vazio
  if (id === "novo") {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Novo Evento</h2>
        <EventForm />
      </div>
    )
  }

  // Caso contrário, buscamos o evento pelo ID
  const event = mockEvents.find((e) => e.id === id)

  if (!event) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Editar Evento</h2>
      <EventForm event={event} />
    </div>
  )
}
