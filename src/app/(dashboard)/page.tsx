import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Activity, Zap } from "lucide-react";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  const kpis = [
    { title: "Total Leads", value: "2,543", icon: Users, trend: "+12%" },
    { title: "Leads Calientes", value: "342", icon: Zap, trend: "+5%" },
    { title: "Auditorías SEO", value: "128", icon: Activity, trend: "+18%" },
    { title: "Propuestas Enviadas", value: "45", icon: Target, trend: "+2%" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen general de captación y estado del pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="glass-panel border-border/40 bg-card/40 hover:bg-card/60 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-primary/80 font-medium mt-1">
                {kpi.trend} este mes
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <PipelineChart />
        <RecentActivity />
      </div>
    </div>
  );
}
