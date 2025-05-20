import { notFound } from "next/navigation"
import { ExhibitorForm } from "@/components/admin/exhibitor-form"
import { exhibitors } from "@/lib/mock-data"

export default function EditExhibitorPage({ params }: { params: { id: string } }) {
  // Se for "novo", retornamos um formulário vazio
  if (params.id === "novo") {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Novo Expositor</h2>
        <ExhibitorForm />
      </div>
    )
  }

  // Caso contrário, buscamos o expositor pelo ID
  const exhibitor = exhibitors.find((e) => e.id === params.id)

  if (!exhibitor) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Editar Expositor</h2>
      <ExhibitorForm defaultValues={exhibitor} />
    </div>
  )
}
