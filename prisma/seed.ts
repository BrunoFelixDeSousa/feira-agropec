import { PrismaClient, NotificationType, UserRole } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Criar usuário admin
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@feira.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@feira.com",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  })

  console.log("Usuário admin criado:", admin)

  // Criar eventos
  const events = [
    {
      title: "Abertura Oficial",
      description: "Cerimônia de abertura oficial da feira com autoridades locais e convidados especiais.",
      date: "10/06/2023",
      time: "09:00",
      endTime: "10:30",
      location: "Palco Principal",
      type: "Cerimônia",
      featured: true,
      tags: ["abertura", "oficial", "cerimônia"],
    },
    {
      title: "Exposição de Gado Leiteiro",
      description: "Apresentação das melhores raças de gado leiteiro da região.",
      date: "10/06/2023",
      time: "11:00",
      endTime: "17:00",
      location: "Pavilhão 2",
      type: "Exposição",
      featured: true,
      tags: ["gado", "leiteiro", "exposição"],
    },
    {
      title: "Workshop de Agricultura Sustentável",
      description: "Aprenda técnicas modernas de agricultura sustentável com especialistas do setor.",
      date: "11/06/2023",
      time: "14:00",
      endTime: "16:00",
      location: "Sala de Conferências A",
      type: "Workshop",
      featured: false,
      tags: ["agricultura", "sustentável", "workshop"],
    },
    {
      title: "Concurso de Queijos Artesanais",
      description: "Degustação e premiação dos melhores queijos artesanais produzidos na região.",
      date: "12/06/2023",
      time: "10:00",
      endTime: "12:00",
      location: "Pavilhão Gastronômico",
      type: "Concurso",
      featured: true,
      tags: ["queijo", "artesanal", "concurso", "gastronomia"],
    },
    {
      title: "Leilão de Gado de Corte",
      description: "Leilão com as melhores ofertas de gado de corte da região.",
      date: "12/06/2023",
      time: "15:00",
      endTime: "18:00",
      location: "Arena Central",
      type: "Leilão",
      featured: true,
      tags: ["leilão", "gado", "corte"],
    },
  ]

  for (const event of events) {
    await prisma.event.upsert({
      where: { id: event.title.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: event.title.toLowerCase().replace(/\s+/g, "-"),
        ...event,
      },
    })
  }

  console.log("Eventos criados")

  // Criar expositores
  const exhibitors = [
    {
      name: "Agro Tech Solutions",
      description: "Empresa especializada em soluções tecnológicas para o agronegócio.",
      category: "Tecnologia",
      location: "Pavilhão 1",
      booth: "A12",
      website: "https://agrotechsolutions.com",
      phone: "(11) 98765-4321",
      email: "contato@agrotechsolutions.com",
      featured: true,
      mapPosition: { x: 120, y: 80 },
    },
    {
      name: "Laticínios Vale Verde",
      description: "Produção de queijos e derivados do leite com alta qualidade.",
      category: "Laticínios",
      location: "Pavilhão 2",
      booth: "B05",
      website: "https://laticiniosvaleverde.com",
      phone: "(11) 91234-5678",
      email: "contato@valeverde.com",
      featured: true,
      mapPosition: { x: 200, y: 150 },
    },
    {
      name: "Tratores & Cia",
      description: "Venda e manutenção de tratores e implementos agrícolas.",
      category: "Maquinário",
      location: "Área Externa",
      booth: "E03",
      website: "https://tratoresecia.com",
      phone: "(11) 97777-8888",
      email: "vendas@tratoresecia.com",
      featured: false,
      mapPosition: { x: 350, y: 220 },
    },
    {
      name: "Sementes Ouro",
      description: "Sementes de alta qualidade para diversas culturas.",
      category: "Insumos",
      location: "Pavilhão 1",
      booth: "A08",
      website: "https://sementesouro.com",
      phone: "(11) 95555-6666",
      email: "contato@sementesouro.com",
      featured: false,
      mapPosition: { x: 150, y: 120 },
    },
    {
      name: "Nutrição Animal Premium",
      description: "Rações e suplementos para nutrição animal de alta performance.",
      category: "Nutrição Animal",
      location: "Pavilhão 3",
      booth: "C15",
      website: "https://nutricaopremium.com",
      phone: "(11) 94444-3333",
      email: "vendas@nutricaopremium.com",
      featured: true,
      mapPosition: { x: 280, y: 180 },
    },
  ]

  for (const exhibitor of exhibitors) {
    await prisma.exhibitor.upsert({
      where: { id: exhibitor.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: exhibitor.name.toLowerCase().replace(/\s+/g, "-"),
        ...exhibitor,
      },
    })
  }

  console.log("Expositores criados")

  // Criar notificações
  const notifications = [
    {
      title: "Alteração no horário do Leilão",
      message: "O leilão de gado de corte foi adiado para às 16h devido a problemas técnicos.",
      type: NotificationType.SCHEDULE_CHANGE,
      targetGroup: "all",
    },
    {
      title: "Palestra Especial Confirmada",
      message: "Nova palestra sobre mercado internacional de commodities confirmada para amanhã às 14h.",
      type: NotificationType.INFO,
      targetGroup: "all",
    },
    {
      title: "Alerta de Chuva",
      message: "Previsão de chuva forte para hoje à tarde. Eventos ao ar livre podem ser afetados.",
      type: NotificationType.ALERT,
      targetGroup: "all",
    },
  ]

  for (const notification of notifications) {
    await prisma.notification.create({
      data: notification,
    })
  }

  console.log("Notificações criadas")

  // Criar slides do carrossel
  const carouselSlides = [
    {
      title: "Bem-vindo à Feira Agropecuária 2023",
      description: "O maior evento do agronegócio da região",
      image: "/images/carousel/slide1.jpg",
      link: "/sobre",
      order: 1,
      active: true,
    },
    {
      title: "Exposição de Gado Leiteiro",
      description: "Conheça as melhores raças de gado leiteiro",
      image: "/images/carousel/slide2.jpg",
      link: "/programacao",
      order: 2,
      active: true,
    },
    {
      title: "Workshops e Palestras",
      description: "Aprenda com os melhores especialistas do setor",
      image: "/images/carousel/slide3.jpg",
      link: "/programacao",
      order: 3,
      active: true,
    },
  ]

  for (const slide of carouselSlides) {
    await prisma.carouselSlide.create({
      data: slide,
    })
  }

  console.log("Slides do carrossel criados")

  // Criar configurações do site
  await prisma.siteSettings.create({
    data: {
      siteName: "Feira Agropecuária 2023",
      eventStartDate: "10/06/2023",
      eventEndDate: "15/06/2023",
      contactEmail: "contato@feiraagropecuaria.com",
      contactPhone: "(11) 3333-4444",
      address: "Parque de Exposições, Av. Principal, 1000 - Cidade",
      socialFacebook: "https://facebook.com/feiraagro",
      socialInstagram: "https://instagram.com/feiraagro",
      socialTwitter: "https://twitter.com/feiraagro",
    },
  })

  console.log("Configurações do site criadas")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
