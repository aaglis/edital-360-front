"use client"

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
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import userService from "@/core/services/userService";

type DashboardHeaderProps = {
  currentPageLabel: string;
}

const DashboardHeader = ({ currentPageLabel }: DashboardHeaderProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    await userService.logout();
    router.push("/login");
  };

  return (
    <>
    <header className="flex w-full justify-between py-2">
      <div className="flex gap-4 w-full">
        <Separator orientation="vertical"/>
        <div className="flex w-full items-center justify-between">
          <span>{currentPageLabel}</span>
          <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
    </header>
    </>
  );
}

export default DashboardHeader;