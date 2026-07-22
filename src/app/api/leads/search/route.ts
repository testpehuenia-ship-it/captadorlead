import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Iniciar búsqueda en Apify
export async function POST(req: Request) {
  try {
    const { keyword, location, limit = 5 } = await req.json();
    const token = process.env.APIFY_API_TOKEN;

    if (!token) {
      return NextResponse.json({ error: "Missing APIFY_API_TOKEN" }, { status: 500 });
    }

    const searchQuery = `${keyword} en ${location}`;

    const apifyReq = await fetch(
      `https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchStringsArray: [searchQuery],
          maxCrawledPlacesPerSearch: limit,
          language: "es",
          countryCode: "ar",
        }),
      }
    );

    if (!apifyReq.ok) {
      const err = await apifyReq.text();
      console.error("Apify error:", err);
      return NextResponse.json({ error: "Error iniciando Apify" }, { status: 500 });
    }

    const data = await apifyReq.json();
    
    return NextResponse.json({ runId: data.data.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Consultar estado y resultados
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const runId = searchParams.get("runId");
  const token = process.env.APIFY_API_TOKEN;

  if (!runId || !token) {
    return NextResponse.json({ error: "Missing runId or token" }, { status: 400 });
  }

  try {
    // 1. Check status
    const statusReq = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${token}`,
      { cache: "no-store" }
    );
    const statusData = await statusReq.json();
    const status = statusData.data.status;

    if (status !== "SUCCEEDED") {
      return NextResponse.json({ status });
    }

    // 2. If succeeded, fetch dataset
    const datasetId = statusData.data.defaultDatasetId;
    const datasetReq = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`,
      { cache: "no-store" }
    );
    const results = await datasetReq.json();

    // 3. Save to database (only if they don't exist yet, we can check by googleMapsUrl or name)
    const savedLeads = [];
    for (const item of results) {
      // Map Apify output to our DB schema
      const companyData = {
        name: item.title || "Desconocido",
        rubro: item.categoryName || "Desconocido",
        localidad: item.city || "Desconocido",
        country: item.countryCode || "AR",
        phone: item.phoneUnformatted || item.phone || null,
        website: item.website || null,
        address: item.address || null,
        googleMapsUrl: item.url || null,
        googleRating: item.totalScore || null,
        googleReviews: item.reviewsCount || null,
        category: item.website ? "CON_WEB" : (item.phone ? "SIN_WEB_CON_CONTACTO" : "INSUFICIENTE"),
      };

      // Upsert into DB (using googleMapsUrl as unique identifier logic, but since it's not unique in Prisma schema, we find first)
      const existing = await prisma.company.findFirst({
        where: { name: companyData.name, address: companyData.address }
      });

      if (!existing) {
        const saved = await prisma.company.create({
          // @ts-ignore - LeadCategory enum issue workaround
          data: companyData
        });
        savedLeads.push(saved);
      } else {
        savedLeads.push(existing);
      }
    }

    return NextResponse.json({ status: "SUCCEEDED", data: savedLeads });
  } catch (error: any) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: error.message || "Error consultando Apify" }, { status: 500 });
  }
}
