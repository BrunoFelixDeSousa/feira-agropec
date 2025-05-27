import { HomeContent } from "@/components/home-content";
import { getAllEvents, getAllExhibitors, getSiteSettings } from "@/lib/db";

export async function HomeContentServer() {
  try {
    const [events, settings, exhibitors] = await Promise.all([
      getAllEvents(),
      getSiteSettings(),
      getAllExhibitors()
    ]);

    const stats = {
      totalEvents: events.length,
      totalExhibitors: exhibitors.length,
    }

    return (
      <>
        <HomeContent events={events} eventStartDate={settings.eventStartDate ?? ""} exhibitors={exhibitors} statsField={stats} />
      </>
    );
    } catch (error) {
    console.error("❌ Erro ao buscar dados:", error);
    throw new Error(`Erro ao buscar dados do servidor: ${error}`);
  }
}