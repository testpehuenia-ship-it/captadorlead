import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ShieldAlert, Mail, MapPin } from "lucide-react";

const activities = [
  { id: 1, title: "Auditoría SEO completada", desc: "Tech Solutions Inc. detectado con WordPress obsoleto.", time: "Hace 10 min", icon: ShieldAlert, color: "text-red-400", bg: "bg-red-400/10" },
  { id: 2, title: "Nuevos Leads (Apify)", desc: "Se encontraron 45 restaurantes en Neuquén.", time: "Hace 1 hora", icon: MapPin, color: "text-primary", bg: "bg-primary/10" },
  { id: 3, title: "Campaña de Email #1 enviada", desc: "Secuencia iniciada para 120 leads inmobiliarios.", time: "Hace 3 horas", icon: Mail, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { id: 4, title: "Lead calificado", desc: "Global Marketing tiene un Lead Score de 85 (HOT).", time: "Ayer", icon: Search, color: "text-green-400", bg: "bg-green-400/10" },
];

export function RecentActivity() {
  return (
    <Card className="glass-panel border-border/40 bg-card/40 h-[380px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${activity.bg}`}>
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.desc}</p>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
