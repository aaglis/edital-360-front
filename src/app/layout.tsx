import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as ToasterSonner } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Edital 360",
  description: "A plataforma de editais mais completa do Brasil",
  icons: {
    icon: "/Favicon.svg",
    shortcut: "/Favicon.svg",
    apple: "/Favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${inter.className}`}>
      <body>
        {children}
        <Toaster />
        <ToasterSonner richColors />
      </body>
    </html>
  );
}
