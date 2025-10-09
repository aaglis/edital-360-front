// app/not-found.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-6">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <div>
        <h1 className="text-3xl font-bold mb-2">Página não encontrada</h1>
        <p className="text-muted-foreground">
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="default" onClick={() => router.push("/")}>
          Voltar para o início
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar para a página anterior
        </Button>
      </div>
    </div>
  );
}
