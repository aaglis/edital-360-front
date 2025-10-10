"use client";

import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import userService from "@/core/services/userService";

const routeTitles: Record<string, string> = {
  "/": "Início",
  "/configuracoes": "Configurações",
  "/configuracoes/perfil": "Meu Perfil",
  "/configuracoes/gerenciar-editais": "Gerenciar editais",
  "/concursos/meus": "Meus Concursos",
  "/concursos/inscricoes": "Inscrições",
  "/concursos/calendario": "Calendário de Concursos",
  "/concursos/resultados": "Resultados",
  "/cadastrar-edital": "Cadastrar Concurso",
  "/notificacoes": "Notificações",
};

const DashboardHeader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await userService.logout();
    router.push("/login");
  };

  // obtém o nome legível da rota atual
  const currentLabel = routeTitles[pathname] || "Página";

  return (
    <header className="flex w-full justify-between py-2 border-b bg-white/60 backdrop-blur-md sticky top-0 z-50 px-4">
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center gap-3">
          <Separator orientation="vertical" />
          <span className="text-lg font-semibold">{currentLabel}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mr-2 mt-2">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push("/configuracoes/perfil")}>
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/configuracoes")}>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
