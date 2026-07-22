import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CRMPage() {
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">CRM Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona el estado de tus leads y haz seguimiento visual de tus negocios.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Negocio
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  );
}
