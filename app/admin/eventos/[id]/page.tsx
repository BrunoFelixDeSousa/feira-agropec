import { notFound } from "next/navigation"
import { EventForm } from "@/components/admin/event-form"
import { mockEvents } from "@/lib/mock-data"

export default function EditEventPage({ params }: { params: { id: string } }) {
  // Se for "novo", retornamos um formulário vazio
  if (params.id === "novo") {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Novo Evento</h2>
        <EventForm />
      </div>
    )
  }

  // Caso contrário, buscamos o evento pelo ID
  const event = mockEvents.find((e) => e.id === params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Editar Evento</h2>
      <EventForm defaultValues={event} />
    </div>
  )
}
