"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Calendar, DollarSign } from "lucide-react";

// Types
export type DealStage = "LEAD" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST";

interface Deal {
  id: string;
  companyName: string;
  stage: DealStage;
  value: number;
  probability: number;
}

const initialData: Record<DealStage, Deal[]> = {
  LEAD: [
    { id: "d1", companyName: "Tech Solutions Inc.", stage: "LEAD", value: 1500, probability: 10 },
    { id: "d2", companyName: "Global Marketing", stage: "LEAD", value: 3000, probability: 15 },
  ],
  CONTACTED: [
    { id: "d3", companyName: "Innovatech", stage: "CONTACTED", value: 4500, probability: 30 },
  ],
  QUALIFIED: [],
  PROPOSAL: [
    { id: "d4", companyName: "Design Studio V", stage: "PROPOSAL", value: 2000, probability: 60 },
  ],
  NEGOTIATION: [
    { id: "d5", companyName: "Retail Group Z", stage: "NEGOTIATION", value: 8500, probability: 80 },
  ],
  WON: [],
  LOST: []
};

const stages: { id: DealStage; label: string }[] = [
  { id: "LEAD", label: "Nuevos Leads" },
  { id: "CONTACTED", label: "Contactados" },
  { id: "QUALIFIED", label: "Calificados" },
  { id: "PROPOSAL", label: "Propuesta Enviada" },
  { id: "NEGOTIATION", label: "En Negociación" },
];

export function KanbanBoard() {
  const [data, setData] = useState(initialData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStage = source.droppableId as DealStage;
    const destStage = destination.droppableId as DealStage;

    const sourceCol = [...data[sourceStage]];
    const destCol = sourceStage === destStage ? sourceCol : [...data[destStage]];

    const [removed] = sourceCol.splice(source.index, 1);
    removed.stage = destStage; // Update the stage internally
    destCol.splice(destination.index, 0, removed);

    setData({
      ...data,
      [sourceStage]: sourceCol,
      ...(sourceStage !== destStage ? { [destStage]: destCol } : {})
    });
    
    // Aquí iría el fetch() para actualizar el stage en la DB (Supabase)
  };

  if (!mounted) return null; // Prevenir hidratación mismatch de dnd

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {stages.map((stage) => (
          <div key={stage.id} className="min-w-[320px] max-w-[320px] flex flex-col gap-3">
            {/* Header de la columna */}
            <div className="flex items-center justify-between px-1">
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                {stage.label}
                <Badge variant="secondary" className="bg-secondary/50 rounded-full px-2 py-0.5 text-xs">
                  {data[stage.id].length}
                </Badge>
              </h3>
              <div className="text-xs text-muted-foreground font-medium">
                ${data[stage.id].reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
              </div>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={stage.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 rounded-xl p-2 transition-colors min-h-[150px] ${
                    snapshot.isDraggingOver ? "bg-primary/10 border-2 border-primary/20 border-dashed" : "bg-card/20 border border-border/30"
                  }`}
                >
                  {data[stage.id].map((deal, index) => (
                    <Draggable key={deal.id} draggableId={deal.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <Card className={`glass-panel border-border/50 bg-card/60 backdrop-blur-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all ${
                            snapshot.isDragging ? "shadow-[0_0_20px_rgba(124,58,237,0.3)] rotate-2 scale-105 z-50" : "shadow-sm"
                          }`}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-sm truncate pr-2">{deal.companyName}</h4>
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground shrink-0 cursor-pointer hover:text-foreground" />
                              </div>
                              <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1 font-medium text-green-400/80">
                                  <DollarSign className="w-3.5 h-3.5" />
                                  {deal.value.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                                  {deal.probability}% Prob
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
