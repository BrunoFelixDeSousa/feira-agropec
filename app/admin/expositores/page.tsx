import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExhibitorDataTable } from "@/components/admin/exhibitor-data-table"
import { Plus } from "lucide-react"

export default function ExhibitorsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Expositores</h2>
        <Button asChild>
          <Link href="/admin/expositores/novo">
            <Plus className="mr-2 h-4 w-4" /> Novo Expositor
          </Link>
        </Button>
      </div>
      <ExhibitorDataTable />
    </div>
  )
}
