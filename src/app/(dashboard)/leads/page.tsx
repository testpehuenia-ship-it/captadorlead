"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Loader2, ExternalLink, Globe, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LeadsPage() {
  const [keyword, setKeyword] = useState("Restaurantes");
  const [location, setLocation] = useState("Neuquén");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [auditingIds, setAuditingIds] = useState<Set<string>>(new Set());

  const handleAudit = async (leadId: string, website: string | null) => {
    if (!website) return;
    setAuditingIds(prev => new Set(prev).add(leadId));
    
    try {
      const res = await fetch(`/api/leads/${leadId}/audit`, { method: "POST" });
      const data = await res.json();
      
      if (data.success) {
        // Podríamos actualizar el estado local del lead, pero por simplicidad
        // mostramos una alerta y recargamos, o marcamos como auditado
        alert(`Auditoría completada para. Puntuación SEO: ${data.audit.seoScore}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAuditingIds(prev => {
        const next = new Set(prev);
        next.delete(leadId);
        return next;
      });
    }
  };

  // Polling para revisar el estado de Apify
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (runId && status !== "SUCCEEDED" && status !== "FAILED") {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/leads/search?runId=${runId}`);
          const data = await res.json();
          
          if (data.status === "SUCCEEDED") {
            setLeads(data.data || []);
            setStatus("SUCCEEDED");
            setLoading(false);
            clearInterval(interval);
          } else if (data.status === "FAILED") {
            setStatus("FAILED");
            setLoading(false);
            clearInterval(interval);
          } else {
            setStatus(data.status); // RUNNING, READY, etc.
          }
        } catch (error) {
          console.error(error);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [runId, status]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("INICIANDO...");
    setLeads([]);
    setRunId(null);

    try {
      const res = await fetch("/api/leads/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, location, limit: 10 }),
      });
      const data = await res.json();
      
      if (data.runId) {
        setRunId(data.runId);
        setStatus("RUNNING");
      } else {
        setStatus("ERROR");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setStatus("ERROR");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Captación de Leads</h1>
        <p className="text-muted-foreground mt-1">Busca empresas en Google Maps utilizando Apify.</p>
      </div>

      <Card className="glass-panel border-border/40 bg-card/40">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Nueva Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-muted-foreground">Rubro / Palabra Clave</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-9 bg-background/50" 
                  placeholder="Ej: Inmobiliarias"
                  required
                />
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-muted-foreground">Localidad</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-9 bg-background/50" 
                  placeholder="Ej: Neuquén, Argentina"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all hover:shadow-[0_0_25px_rgba(124,58,237,0.6)]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                "Buscar Leads"
              )}
            </Button>
          </form>
          
          {status && (
            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="font-medium text-muted-foreground">Estado de la extracción:</span>
              <Badge variant={status === "SUCCEEDED" ? "default" : status === "ERROR" || status === "FAILED" ? "destructive" : "secondary"}>
                {status}
              </Badge>
              {loading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      {leads.length > 0 && (
        <Card className="glass-panel border-border/40 bg-card/40 mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Resultados Encontrados ({leads.length})</span>
              <Button size="sm" variant="outline" className="h-8">Exportar CSV</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border/50">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead, i) => (
                    <TableRow key={lead.id || i} className="hover:bg-secondary/20">
                      <TableCell>
                        <div className="font-medium text-foreground">{lead.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {lead.address || lead.localidad}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          {lead.phone ? (
                            <span className="flex items-center gap-1 text-muted-foreground"><Phone className="w-3 h-3" /> {lead.phone}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Sin teléfono</span>
                          )}
                          {lead.website ? (
                            <a href={lead.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline"><Globe className="w-3 h-3" /> Website</a>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Sin web</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          lead.category === "CON_WEB" ? "border-green-500/50 text-green-400" :
                          lead.category === "SIN_WEB_CON_CONTACTO" ? "border-yellow-500/50 text-yellow-400" :
                          "border-red-500/50 text-red-400"
                        }>
                          {lead.category?.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Ver en Maps">
                            {lead.googleMapsUrl && (
                              <a href={lead.googleMapsUrl} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                              </a>
                            )}
                          </Button>
                          {lead.category === "CON_WEB" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-xs border-primary/50 text-primary hover:bg-primary/20"
                              onClick={() => handleAudit(lead.id, lead.website)}
                              disabled={auditingIds.has(lead.id)}
                            >
                              {auditingIds.has(lead.id) ? (
                                <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Auditando...</>
                              ) : "Auditar Web"}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
