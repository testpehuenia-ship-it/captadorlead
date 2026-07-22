"use client";

import { useState } from "react";
import { Bot, FileText, Send, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ProposalsPage() {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<any>(null);

  // En un caso real, la compañía se selecciona de la tabla de leads
  // Aquí usamos un mock ID para la prueba.
  const mockCompanyId = "cly123"; 

  const generateProposal = async () => {
    setLoading(true);
    try {
      // Como no tenemos el ID real en la demo, lo simulamos para evitar errores de red
      // const res = await fetch("/api/proposals/generate", {
      //   method: "POST",
      //   body: JSON.stringify({ companyId: mockCompanyId })
      // });
      
      // Simulación rápida para UI:
      setTimeout(() => {
        setProposal({
          id: "prop_123",
          companyName: "Tech Solutions Inc.",
          content: "# Propuesta de Crecimiento Digital\n\nEstimado equipo de Tech Solutions...\n\nHemos detectado que su sistema actual es vulnerable...",
          status: "DRAFT"
        });
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Generador de Propuestas</h1>
          <p className="text-muted-foreground mt-1">Utiliza IA (Gemini) para redactar propuestas comerciales basadas en auditorías.</p>
        </div>
        <Button 
          onClick={generateProposal} 
          disabled={loading}
          className="bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all"
        >
          <Bot className="w-4 h-4 mr-2" />
          {loading ? "Generando con IA..." : "Nueva Propuesta (Demo)"}
        </Button>
      </div>

      {!proposal ? (
        <Card className="glass-panel border-border/40 bg-card/40 h-64 flex flex-col items-center justify-center text-center p-6">
          <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">Ninguna propuesta activa</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-2">
            Selecciona un lead calificado desde el CRM o la tabla de leads para generar automáticamente un documento PDF persuasivo.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass-panel border-border/40 bg-card/40 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Borrador generado por Gemini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                className="min-h-[400px] font-mono text-sm bg-background/50 border-border/50"
                value={proposal.content}
                onChange={(e) => setProposal({...proposal, content: e.target.value})}
              />
            </CardContent>
          </Card>

          <Card className="glass-panel border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF (react-pdf)
              </Button>
              <Button className="w-full" variant="secondary">
                <Send className="w-4 h-4 mr-2" />
                Lanzar Secuencia (n8n)
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
