import { NotificationDataTable } from "@/components/admin/notification-data-table"
import { Button } from "@/components/ui/button"
import { paths } from "@/lib/paths"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function NotificationsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Notificações</h2>
        <Button asChild>
          <Link href={`${paths.admin.notificacoes}/nova`}>
            <Plus className="mr-2 h-4 w-4" /> Nova Notificação
          </Link>
        </Button>
      </div>
      <NotificationDataTable />
    </div>
  )
}
