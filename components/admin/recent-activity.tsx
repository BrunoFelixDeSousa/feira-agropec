import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Administrador</p>
          <p className="text-sm text-muted-foreground">Adicionou novo expositor: Agro Tech</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">Há 5 minutos</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Administrador</p>
          <p className="text-sm text-muted-foreground">Atualizou evento: Palestra sobre Agricultura Sustentável</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">Há 15 minutos</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Administrador</p>
          <p className="text-sm text-muted-foreground">Enviou notificação: Alteração no horário do evento</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">Há 30 minutos</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Administrador</p>
          <p className="text-sm text-muted-foreground">Atualizou mapa da feira</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">Há 1 hora</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Administrador</p>
          <p className="text-sm text-muted-foreground">Adicionou novo evento: Workshop de Pecuária</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">Há 2 horas</div>
      </div>
    </div>
  )
}
