require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function test() {
  const token = process.env.APIFY_API_TOKEN;
  
  // Start a run
  console.log("Starting run...");
  const startReq = await fetch(
    `https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchStringsArray: ["alojamiento en Villa Pehuenia"],
        maxCrawledPlacesPerSearch: 3,
        language: "es",
        countryCode: "ar",
      }),
    }
  );
  
  const startData = await startReq.json();
  const runId = startData.data.id;
  console.log("Run ID:", runId);

  // Poll
  while (true) {
    const statusReq = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const statusData = await statusReq.json();
    const status = statusData.data.status;
    console.log("Status:", status);
    
    if (status === "SUCCEEDED") {
      const datasetId = statusData.data.defaultDatasetId;
      console.log("Fetching dataset:", datasetId);
      const datasetReq = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`);
      const results = await datasetReq.json();
      console.log("Got", results.length, "results");
      
      // Simulate DB mapping
      const savedLeads = [];
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const adapter = new PrismaPg(pool);
      const prisma = new PrismaClient({ adapter });

      for (const item of results) {
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
        console.log("Inserting:", companyData.name);
        try {
          const saved = await prisma.company.create({ data: companyData });
          savedLeads.push(saved.id);
        } catch (e) {
          console.error("PRISMA ERROR:", e);
        }
      }
      console.log("Done");
      process.exit(0);
    } else if (status === "FAILED") {
      console.log("Failed");
      process.exit(1);
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

test();
