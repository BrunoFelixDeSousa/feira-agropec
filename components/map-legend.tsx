import { Badge } from "@/components/ui/badge"

export function MapLegend() {
  const categories = [
    { name: "Máquinas Agrícolas", color: "bg-blue-600" },
    { name: "Insumos", color: "bg-green-600" },
    { name: "Nutrição Animal", color: "bg-amber-600" },
    { name: "Serviços Financeiros", color: "bg-purple-600" },
    { name: "Genética Animal", color: "bg-pink-600" },
    { name: "Irrigação", color: "bg-cyan-600" },
    { name: "Serviços", color: "bg-indigo-600" },
    { name: "Energia", color: "bg-orange-600" },
  ]

  const areas = [
    { name: "Pavilhão A", color: "border-blue-500 bg-blue-100 text-blue-800" },
    { name: "Pavilhão B", color: "border-purple-500 bg-purple-100 text-purple-800" },
    { name: "Área Externa", color: "border-green-500 bg-green-100 text-green-800" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Categorias de Expositores</h3>
        <div className="grid gap-2">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center gap-3">
              <div className={`${category.color} w-5 h-5 rounded-full`}></div>
              <span className="text-sm">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Áreas da Feira</h3>
        <div className="grid gap-2">
          {areas.map((area) => (
            <Badge key={area.name} variant="outline" className={`${area.color} justify-start`}>
              {area.name}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Símbolos</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
              <span className="text-xs font-bold">A1</span>
            </div>
            <span className="text-sm">Estande (código)</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center animate-pulse relative">
              <span className="absolute -inset-1 rounded-full border-2 border-blue-400 animate-ping opacity-75"></span>
              <span className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </span>
            </div>
            <span className="text-sm">Sua localização</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-300 text-gray-700 rounded-full px-3 py-1 text-xs flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Informação</span>
            </div>
            <span className="text-sm">Dica ou informação</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Como Usar o Mapa</h3>
        <ul className="text-sm space-y-2 list-disc pl-5">
          <li>Arraste para navegar pelo mapa</li>
          <li>Use os botões + e - para aumentar ou diminuir o zoom</li>
          <li>Toque em um estande para ver detalhes do expositor</li>
          <li>Use o botão de localização para encontrar onde você está</li>
          <li>Filtre por área usando as abas no topo</li>
        </ul>
      </div>
    </div>
  )
}
