import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { renderToStream } from "@react-pdf/renderer";
import { ProposalPDF } from "@/components/proposals/ProposalPDF";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!proposal) {
      return NextResponse.json({ error: "Propuesta no encontrada" }, { status: 404 });
    }

    // Generar el stream del PDF usando react-pdf
    const stream = await renderToStream(
      <ProposalPDF companyName={proposal.company.name} content={proposal.content} />
    );

    // Convertir NodeJS Readable Stream a Web ReadableStream para Next.js App Router
    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      }
    });

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Propuesta_${proposal.company.name.replace(/\s+/g, "_")}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Error generando PDF:", error);
    return NextResponse.json({ error: "Error interno al generar PDF" }, { status: 500 });
  }
}
