import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const lead = await prisma.company.findUnique({
      where: { id }
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    if (!lead.website) {
      return NextResponse.json({ error: "El lead no tiene página web para auditar" }, { status: 400 });
    }

    // Asegurarse de que el protocolo está presente
    let targetUrl = lead.website;
    if (!targetUrl.startsWith("http")) {
      targetUrl = "https://" + targetUrl;
    }

    // 1. Simular Análisis de Enriquecimiento (Tecnologías, CMS, etc.)
    // En producción aquí integrarías Wappalyzer o APIs de escaneo reales
    const enrichmentData = {
      emails: ["contacto@" + new URL(targetUrl).hostname.replace("www.", "")],
      forms: { contact: true, newsletter: false },
      techStack: { wordpress: true, version: "6.4", plugins: ["yoast-seo", "elementor"] },
      ssl: targetUrl.startsWith("https"),
      cms: "WordPress",
      framework: "PHP",
    };

    const enrichment = await prisma.enrichment.create({
      data: {
        companyId: lead.id,
        ...enrichmentData,
        forms: JSON.stringify(enrichmentData.forms),
        techStack: JSON.stringify(enrichmentData.techStack),
      }
    });

    // 2. Simular Auditoría SEO/GEO
    // En producción llamarías a PageSpeed Insights API, extractores de Schema, etc.
    const auditData = {
      type: "FULL" as const,
      seoScore: Math.floor(Math.random() * 40) + 40, // 40-80 random para mock
      https: targetUrl.startsWith("https"),
      lcp: 2.5 + Math.random() * 2, // 2.5s - 4.5s
      inp: 100 + Math.random() * 150, // 100ms - 250ms
      cls: Math.random() * 0.2, // 0 - 0.2
      hasSitemap: true,
      hasRobots: true,
      geoScore: Math.floor(Math.random() * 50) + 20, // 20-70 random
      hasSchema: false,
      schemaTypes: [],
      eeatScore: Math.floor(Math.random() * 50),
      allowsAiBots: true,
      wordpressVersion: "6.4.2",
      outdatedPlugins: 3,
    };

    const audit = await prisma.audit.create({
      data: {
        companyId: lead.id,
        ...auditData,
      }
    });

    // Update Lead Score based on findings (Hot si tiene web antigua)
    await prisma.company.update({
      where: { id: lead.id },
      data: {
        aiScore: 75,
        leadScore: "WARM"
      }
    });

    return NextResponse.json({ 
      success: true, 
      enrichment, 
      audit 
    });

  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json({ error: "Error interno al auditar" }, { status: 500 });
  }
}
