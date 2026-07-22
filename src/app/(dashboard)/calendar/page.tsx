"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Video, Plus, Link as LinkIcon } from "lucide-react";

export default function CalendarPage() {
  const upcomingMeetings = [
    { id: 1, title: "Auditoría SEO - Tech Solutions", date: "Hoy, 14:00", platform: "Google Meet", link: "meet.google.com/xyz", client: "Tech Solutions Inc." },
    { id: 2, title: "Presentación de Propuesta", date: "Mañana, 10:30", platform: "Zoom", link: "zoom.us/j/123", client: "Global Marketing" },
    { id: 3, title: "Discovery Call", date: "Viernes, 16:00", platform: "Calendly", link: "calendly.com/adnqn", client: "Inmobiliaria Sur" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Agenda y Reuniones</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus llamadas de cierre y sesiones de discovery.</p>
        </div>
        <Button className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/80 shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Agendar Reunión
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-panel border-border/40 bg-card/40 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#F0C05A]" />
              Próximas Llamadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map(meet => (
                <div key={meet.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50 hover:border-[#00E5FF]/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-[#00E5FF]/10 text-[#00E5FF]">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{meet.title}</h4>
                      <p className="text-sm text-muted-foreground">{meet.date} • {meet.client}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-[#F0C05A]/30 text-[#F0C05A] hover:bg-[#F0C05A]/10">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Unirse
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/40 bg-card/40">
          <CardHeader>
            <CardTitle className="text-lg">Integraciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border border-border/50 bg-background/30 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">C</span>
              </div>
              <h4 className="font-medium">Calendly</h4>
              <p className="text-xs text-muted-foreground">Sincroniza tus eventos automáticamente.</p>
              <Button variant="secondary" className="w-full text-xs">Conectar Cuenta</Button>
            </div>
            
            <div className="p-4 rounded-xl border border-border/50 bg-background/30 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center">
                <Video className="text-green-600 w-6 h-6" />
              </div>
              <h4 className="font-medium">Google Meet</h4>
              <p className="text-xs text-muted-foreground">Genera links automáticamente en el CRM.</p>
              <Button variant="secondary" className="w-full text-xs">Conectar Workspace</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
