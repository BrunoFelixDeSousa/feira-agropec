import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-muted rounded-full">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Expositor não encontrado</h1>
            <p className="text-muted-foreground">
              O expositor que você está procurando não existe ou pode ter sido removido.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/expositores">
                <Search className="h-4 w-4 mr-2" />
                Ver Expositores
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
