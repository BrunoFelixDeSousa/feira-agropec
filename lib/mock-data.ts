import type { Event, Exhibitor, Notification } from "./types"

export const eventStartDate = new Date("2025-08-09T19:00:00Z").toISOString()
export const eventEndDate = new Date("2023-08-20T18:00:00Z").toISOString()

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Cerimônia de Abertura",
    description: "Cerimônia oficial de abertura da Feira Agropecuária de Paragominas com autoridades locais.",
    date: "15/08/2023",
    time: "19:00",
    endTime: "21:00",
    location: "Palco Principal",
    type: "Cerimônia",
    featured: true,
    image: null,
    tags: ["abertura", "cerimônia", "oficial"],
    createdAt: new Date("2023-07-01T10:00:00Z"),
    updatedAt: new Date("2023-07-15T14:30:00Z"),
  },
  {
    id: "2",
    title: "Leilão de Gado Nelore",
    description: "Leilão de gado da raça Nelore com exemplares de alta qualidade genética.",
    date: "16/08/2023",
    time: "14:00",
    endTime: "17:00",
    location: "Pavilhão de Leilões",
    type: "Leilão",
    featured: true,
    image: null,
    tags: ["leilão", "gado", "nelore", "genética"],
    createdAt: new Date("2023-07-01T10:00:00Z"),
    updatedAt: new Date("2023-07-15T14:30:00Z"),
  },
  {
    id: "3",
    title: "Palestra: Tecnologias para Agricultura de Precisão",
    description: "Palestra sobre as mais recentes tecnologias aplicadas à agricultura de precisão.",
    date: "16/08/2023",
    time: "10:00",
    endTime: "12:00",
    location: "Auditório Central",
    type: "Palestra",
    featured: false,
    image: null,
    tags: ["palestra", "tecnologia", "agricultura", "precisão"],
    createdAt: new Date("2023-07-01T10:00:00Z"),
    updatedAt: new Date("2023-07-15T14:30:00Z"),
  },
  {
    id: "4",
    title: "Workshop: Manejo Sustentável de Pastagens",
    description: "Workshop prático sobre técnicas de manejo sustentável de pastagens.",
    date: "17/08/2023",
    time: "09:00",
    endTime: "12:00",
    location: "Sala de Treinamento 2",
    type: "Workshop",
    featured: false,
    image: null,
    tags: ["workshop", "manejo", "sustentável", "pastagens"],
    createdAt: new Date("2023-07-01T10:00:00Z"),
    updatedAt: new Date("2023-07-15T14:30:00Z"),
  },
  {
    id: "5",
    title: "Show Musical - Artista Nacional",
    description: "Show com grande artista do cenário musical nacional.",
    date: "17/08/2023",
    time: "21:00",
    endTime: "23:30",
    location: "Arena de Shows",
    type: "Show",
    featured: true,
    image: null,
    tags: ["show", "música", "artista", "nacional"],
    createdAt: new Date("2023-07-01T10:00:00Z"),
    updatedAt: new Date("2023-07-15T14:30:00Z"),
  },
  {
    id: "6",
    title: "Exposição de Máquinas Agrícolas",
    description: "Demonstração das mais modernas máquinas e implementos agrícolas do mercado.",
    date: "18/08/2023",
    time: "10:00",
    endTime: "18:00",
    location: "Área Externa",
    type: "Exposição",
    featured: false,
    image: null,
    tags: ["exposição", "máquinas", "agrícolas", "implementos"],
    createdAt: new Date("2023-07-01T10:00:00Z"),
    updatedAt: new Date("2023-07-15T14:30:00Z"),
  },
  {
    id: "7",
    title: "Concurso Leiteiro",
    description: "Competição entre produtores para premiar os animais com maior produção de leite.",
    date: "18/08/2023",
    time: "15:00",
    endTime: "17:00",
    location: "Pavilhão da Pecuária",
    type: "Concurso",
    featured: false,
    image: null,
    tags: ["concurso", "leiteiro", "produção", "leite"],
    createdAt: new Date("2023-07-01T10:00:00Z"),
    updatedAt: new Date("2023-07-15T14:30:00Z"),
  },
  {
    id: "8",
    title: "Rodeio - Final",
    description: "Grande final do rodeio com os melhores competidores da região.",
    date: "19/08/2023",
    time: "20:00",
    endTime: "22:30",
    location: "Arena de Rodeio",
    type: "Rodeio",
    featured: true,
    image: null,
    tags: ["rodeio", "final", "competição", "região"],
    createdAt: new Date("2023-07-01T10:00:00Z"),
    updatedAt: new Date("2023-07-15T14:30:00Z"),
  },
  {
    id: "9",
    title: "Dia de Campo: Cultivo de Soja",
    description: "Demonstração prática de técnicas de cultivo de soja adaptadas à região.",
    date: "19/08/2023",
    time: "09:00",
    endTime: "12:00",
    location: "Área de Demonstração",
    type: "Dia de Campo",
    featured: false,
    image: null,
    tags: ["dia de campo", "cultivo", "soja", "demonstração"],
    createdAt: new Date("2023-07-01T10:00:00Z"),
    updatedAt: new Date("2023-07-15T14:30:00Z"),
  },
  {
    id: "10",
    title: "Encerramento e Premiação",
    description: "Cerimônia de encerramento e premiação dos concursos realizados durante a feira.",
    date: "20/08/2023",
    time: "18:00",
    endTime: "20:00",
    location: "Palco Principal",
    type: "Cerimônia",
    featured: true,
    image: null,
    tags: ["encerramento", "premiação", "cerimônia", "concursos"],
    createdAt: new Date("2023-07-01T10:00:00Z"),
    updatedAt: new Date("2023-07-15T14:30:00Z"),
  },
]

export const mockExhibitors: Exhibitor[] = [
  {
    id: "1",
    name: "Agro Máquinas Brasil",
    description: "Empresa especializada em máquinas e implementos agrícolas de alta tecnologia.",
    category: "Máquinas Agrícolas",
    booth: "A-01",
    location: "pavilhao-a",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://example.com/agromaquinas",
    phone: "(91) 98765-4321",
    email: "contato@agromaquinas.com",
    featured: false,
    mapPosition: { x: 150, y: 200 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Sementes Premium",
    description: "Fornecedor de sementes de alta qualidade para diversas culturas agrícolas.",
    category: "Insumos",
    booth: "A-05",
    location: "pavilhao-a",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://example.com/sementespremium",
    phone: "(91) 98888-7777",
    email: "vendas@sementespremium.com",
    featured: false,
    mapPosition: { x: 250, y: 200 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Nutrição Animal Forte",
    description: "Produtos para nutrição animal com foco em suplementação mineral e rações.",
    category: "Nutrição Animal",
    booth: "A-10",
    location: "pavilhao-a",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://example.com/nutricaoanimal",
    phone: "(91) 97777-6666",
    email: "contato@nutricaoanimal.com",
    featured: false,
    mapPosition: { x: 350, y: 200 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Banco Rural",
    description: "Instituição financeira especializada em crédito rural e financiamento para o agronegócio.",
    category: "Serviços Financeiros",
    booth: "B-03",
    location: "pavilhao-b",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://example.com/bancorural",
    phone: "(91) 96666-5555",
    email: "atendimento@bancorural.com",
    featured: false,
    mapPosition: { x: 150, y: 400 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Genética Bovina Elite",
    description: "Empresa especializada em melhoramento genético de bovinos de corte e leite.",
    category: "Genética Animal",
    booth: "B-07",
    location: "pavilhao-b",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://example.com/geneticabovina",
    phone: "(91) 95555-4444",
    email: "vendas@geneticabovina.com",
    featured: false,
    mapPosition: { x: 250, y: 400 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Irrigação Tecnológica",
    description: "Sistemas de irrigação de alta eficiência para diversas culturas agrícolas.",
    category: "Irrigação",
    booth: "B-12",
    location: "pavilhao-b",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://example.com/irrigacao",
    phone: "(91) 94444-3333",
    email: "contato@irrigacaotec.com",
    featured: false,
    mapPosition: { x: 350, y: 400 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    name: "Tratores Unidos",
    description: "Concessionária de tratores e máquinas agrícolas de diversas marcas.",
    category: "Máquinas Agrícolas",
    booth: "E-01",
    location: "area-externa",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://example.com/tratores",
    phone: "(91) 93333-2222",
    email: "vendas@tratoresunidos.com",
    featured: false,
    mapPosition: { x: 500, y: 300 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    name: "Defensivos Agrícolas Seguros",
    description: "Empresa de defensivos agrícolas com foco em produtos de baixo impacto ambiental.",
    category: "Insumos",
    booth: "A-15",
    location: "pavilhao-a",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://example.com/defensivos",
    phone: "(91) 92222-1111",
    email: "contato@defensivosseguros.com",
    featured: false,
    mapPosition: { x: 450, y: 200 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    name: "Consultoria Agropecuária",
    description: "Serviços de consultoria técnica para produtores rurais e empresas do agronegócio.",
    category: "Serviços",
    booth: "B-18",
    location: "pavilhao-b",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://example.com/consultoria",
    phone: "(91) 91111-0000",
    email: "contato@consultoriaagro.com",
    featured: false,
    mapPosition: { x: 450, y: 400 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    name: "Energia Solar Rural",
    description: "Soluções de energia solar fotovoltaica para propriedades rurais.",
    category: "Energia",
    booth: "E-05",
    location: "area-externa",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://example.com/energiasolar",
    phone: "(91) 90000-9999",
    email: "vendas@energiasolarrural.com",
    featured: false,
    mapPosition: { x: 600, y: 300 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Alteração na Programação",
    message: "O leilão de gado Nelore foi transferido para 17/08 às 10:00.",
    type: "SCHEDULE_CHANGE",
    createdAt: new Date("2025-08-15T08:00:00Z"),
    updatedAt: new Date("2025-08-15T08:30:00Z"),
    timestamp: new Date("2025-08-15T08:30:00Z"),
    read: false,
    targetGroup: null,
  },
  {
    id: "2",
    title: "Evento em Destaque",
    message: "Não perca o show nacional hoje às 21:00 na Arena de Shows!",
    type: "REMINDER",
    createdAt: new Date("2025-08-17T14:00:00Z"),
    updatedAt: new Date("2025-08-17T15:00:00Z"),
    timestamp: new Date("2025-08-17T15:00:00Z"),
    read: false,
    targetGroup: null,
  },
  {
    id: "3",
    title: "Alerta de Chuva",
    message: "Previsão de chuva forte hoje. Algumas atividades externas podem ser canceladas.",
    type: "URGENT",
    createdAt: new Date("2025-08-18T09:00:00Z"),
    updatedAt: new Date("2025-08-18T09:15:00Z"),
    timestamp: new Date("2025-08-18T09:15:00Z"),
    read: false,
    targetGroup: null,
  },
]

export const mockNotificationEvents = [
  {
    id: "1",
    title: "Abertura da Feira",
    description: "A feira será aberta amanhã às 9h. Não perca!",
    type: "info",
    date: "2023-07-10T09:00:00",
    sent: true,
  },
  {
    id: "2",
    title: "Alteração no Horário do Leilão",
    description: "O leilão de gado foi alterado para 14h no Pavilhão Central",
    type: "warning",
    date: "2023-07-11T14:00:00",
    sent: true,
  },
  {
    id: "3",
    title: "Palestra sobre Agricultura Sustentável",
    description: "Não perca a palestra sobre técnicas de agricultura sustentável no Auditório 2",
    type: "info",
    date: "2023-07-12T15:30:00",
    sent: false,
  },
  {
    id: "4",
    title: "Encerramento da Feira",
    description: "A feira será encerrada hoje às 18h. Agradecemos sua participação!",
    type: "info",
    date: "2023-07-15T18:00:00",
    sent: false,
  },
  {
    id: "5",
    title: "Alerta de Chuva",
    description: "Previsão de chuva forte para hoje à tarde. Eventos ao ar livre podem ser afetados.",
    type: "alert",
    date: "2023-07-13T13:00:00",
    sent: true,
  },
]
