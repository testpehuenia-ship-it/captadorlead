import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { companyId } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Falta configurar GEMINI_API_KEY" }, { status: 500 });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { audits: true, enrichments: true },
    });

    if (!company) {
      return NextResponse.json({ error: "Empresa no encontrada" }, { status: 404 });
    }

    // Preparar el contexto para la IA
    const latestAudit = company.audits[company.audits.length - 1];
    const latestEnrichment = company.enrichments[company.enrichments.length - 1];

    const context = `
      Empresa: ${company.name}
      Rubro: ${company.rubro}
      Localidad: ${company.localidad}
      Website: ${company.website || "No tiene"}
      
      Datos de Auditoría Reciente:
      - Score SEO: ${latestAudit?.seoScore || "N/A"}
      - HTTPs Seguro: ${latestAudit?.https ? "Sí" : "No"}
      - Score de IA (GEO): ${latestAudit?.geoScore || "N/A"}
      
      Tecnologías Detectadas:
      - CMS: ${latestEnrichment?.cms || "Desconocido"}
      
      Eres un experto Estratega de Ventas (Proposal Strategist) de la agencia ADNQN.
      Tu objetivo es redactar un borrador de propuesta comercial altamente persuasiva, 
      destacando las vulnerabilidades encontradas y proponiendo soluciones.
      
      Formato esperado (Markdown):
      1. Título de la propuesta
      2. Resumen Ejecutivo (Win Themes principales)
      3. Hallazgos Críticos (basados en los datos de auditoría)
      4. Plan de Acción (Nuestra Solución)
      5. Retorno de Inversión Estimado
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(context);
    const responseText = result.response.text();

    // Guardar la propuesta en la BD
    const proposal = await prisma.proposal.create({
      data: {
        companyId: company.id,
        content: responseText,
        winThemes: JSON.stringify(["Mejora de SEO", "Modernización Web"]),
        status: "DRAFT"
      }
    });

    return NextResponse.json({ success: true, proposal });

  } catch (error) {
    console.error("Error generando propuesta:", error);
    return NextResponse.json({ error: "Error interno al generar propuesta con IA" }, { status: 500 });
  }
}
