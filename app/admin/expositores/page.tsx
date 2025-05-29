import { ExhibitorDataTable } from "@/components/admin/exhibitor-data-table"
import { Button } from "@/components/ui/button"
import { paths } from "@/lib/paths"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ExhibitorsPage() {
  return (
    <div className="flex-1 w-full flex flex-col min-h-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Expositores</h2>
        <Button asChild className="w-full sm:w-auto">
          <Link href={`${paths.admin.expositores}/novo`}>
            <Plus className="mr-2 h-4 w-4" /> Novo Expositor
          </Link>
        </Button>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <ExhibitorDataTable />
      </div>
    </div>
  )
}
