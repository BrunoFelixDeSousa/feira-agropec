"use client"

import { Eye, EyeOff, Save, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getSession, updateUserProfile } from "@/lib/auth-actions"

export default function PerfilPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [user, setUser] = useState<{
    userId: string
    name: string
    email: string
    role: string
  } | null>(null)
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const sessionData = await getSession()
        if (!sessionData) {
          router.push("/admin/login")
          return
        }
        setUser(sessionData)
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error)
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados do usuário."
        })
      }
    }

    fetchUser()
  }, [router, toast])

  const handleSubmit = async (formData: FormData) => {
    setFormError("")

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!name || !email) {
      setFormError("Nome e email são obrigatórios")
      return
    }

    if (newPassword && newPassword !== confirmPassword) {
      setFormError("A nova senha e a confirmação não coincidem")
      return
    }

    startTransition(async () => {
      try {
        const result = await updateUserProfile({
          userId: user?.userId || "",
          name,
          email,
          currentPassword,
          newPassword: newPassword || undefined
        })
        
        if (result?.error) {
          setFormError(result.error)
        } else if (result?.success) {
          toast({
            title: "Perfil atualizado",
            description: "Seus dados foram atualizados com sucesso!"
          })
          
          // Atualizar dados do usuário na tela
          if (user) {
            setUser({
              ...user,
              name,
              email
            })
          }
          
          // Limpar campos de senha
          const passwordInputs = document.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>
          passwordInputs.forEach(input => input.value = "")
          
          router.refresh()
        } else {
          setFormError("Resposta inesperada do servidor")
        }
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error)
        setFormError("Erro de conexão com o servidor")
      }
    })
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Carregando dados do usuário...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Informações da Conta</CardTitle>
          <CardDescription>Atualize seus dados pessoais e credenciais de acesso</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dados Pessoais</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome completo"
                    className="pl-10"
                    defaultValue={user.name}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  defaultValue={user.email}
                  required
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Alterar Senha</h3>
              <p className="text-sm text-muted-foreground">Deixe em branco se não quiser alterar sua senha</p>
              
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    placeholder="Digite sua senha atual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground"
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Digite sua nova senha"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pr-10"
                    placeholder="Confirme sua nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground"
                    aria-label={showConfirmPassword ? "Esconder confirmação" : "Mostrar confirmação"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            
            {formError && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {formError}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Salvando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-xs text-muted-foreground">
            {user.role === "ADMIN" ? "Administrador" : "Editor"} • Última atualização: {new Date().toLocaleDateString()}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
