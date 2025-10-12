"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "../Logo";
import {
  User,
  Settings,
  FileText,
  CalendarCheck,
  Bell,
  BarChart2,
  CreditCard,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";

const SidebarComponent = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      groupTitle: "Conta",
      items: [
        { title: "Meu Perfil", url: "/configuracoes/perfil", icon: User },
      ],
    },
    {
      groupTitle: "Concursos",
      items: [
        { title: "Gerenciar editais", url: "/configuracoes/gerenciar-editais", icon: FileText},
      ],
    },
    // {
    //   groupTitle: "Notificações",
    //   items: [
    //     { title: "Avisos", url: "/notificacoes", icon: Bell },
    //   ],
    // },
  ];

  return (
    <Sidebar collapsible="icon" {...props} className="bg-white border-r">
      <SidebarHeader className="pt-8">
        <button onClick={() => router.push("/")} aria-label="Ir para o início">
          <Logo />
        </button>
      </SidebarHeader>

      <SidebarContent>
        {items.map((group) => (
          <SidebarGroup key={group.groupTitle}>
            <SidebarGroupLabel>{group.groupTitle}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    pathname.startsWith(item.url + "/");

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={() => router.push(item.url)}
                          className={clsx(
                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-white shadow-sm"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <item.icon
                            className={clsx(
                              "w-4 h-4",
                              isActive ? "text-white" : "text-gray-500"
                            )}
                          />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};

export default SidebarComponent;
