import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ADNQN Lead Intelligence Platform",
  description: "Plataforma SaaS para captación de leads, CRM y automatización",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark h-full">
      <body
        className={cn(
          "min-h-full font-sans antialiased bg-background text-foreground",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
