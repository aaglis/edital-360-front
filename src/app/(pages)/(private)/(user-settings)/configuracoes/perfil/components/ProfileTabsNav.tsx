"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = { current: "overview" | "dados" };

export default function ProfileTabsNav({ current }: Props) {
  const router = useRouter();

  return (
    <Tabs
      value={current}
      onValueChange={(v) => router.push(v === "overview" ? "/configuracoes/perfil" : "/configuracoes/perfil/dados")}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Meu Perfil</TabsTrigger>
        <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
