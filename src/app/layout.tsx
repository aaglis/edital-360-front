import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edital 360",
  description: "A plataforma de editais mais completa do Brasil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
