"use client"


import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "@/lib/auth-actions"
import { paths } from "@/lib/paths"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setError("")

    startTransition(async () => {
      try {
        const result = await loginAction(formData)
        
        if (result?.error) {
          setError(result.error)
        } else if (result?.success) {
          router.push("/admin")
          router.refresh()
        } else {
          setError("Resposta inesperada do servidor")
        }
      } catch (error) {
        console.error("Erro na requisição:", error)
        setError("Erro de conexão com o servidor")
      }
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Link href={`${paths.site.home}`} className="absolute top-4 left-4 text-sm text-muted-foreground hover:text-foreground">
        ← Voltar ao site
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo-agropec.png?height=80&width=240"
            alt="Logo Feira Agropecuária"
            width={240}
            height={80}
            className="h-20 w-auto"
          />
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Área Administrativa</CardTitle>
            <CardDescription className="text-center">Entre com suas credenciais para acessar</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    required
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
              {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-muted-foreground">Área restrita aos administradores da Feira Agropecuária</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
