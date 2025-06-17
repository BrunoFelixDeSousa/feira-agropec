import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth-actions"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button variant="ghost" size="sm" type="submit">
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>
    </form>
  )
}