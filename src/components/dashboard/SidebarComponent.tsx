import * as React from "react"
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
} from "@/components/ui/sidebar"
import Logo from "../Logo"
import { User, Settings, FileText, CalendarCheck, Bell, BarChart2, CreditCard } from "lucide-react";

const SidebarComponent = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const items = [
    {
      groupTitle: "Conta",
      items: [
        { title: "Meu Perfil", url: "/perfil", icon: User },
        { title: "Configurações", url: "/configuracoes", icon: Settings },
      ],
    },
    {
      groupTitle: "Concursos",
      items: [
        { title: "Meus Concursos", url: "/concursos/meus", icon: FileText },
        { title: "Inscrições", url: "/concursos/inscricoes", icon: CreditCard },
        { title: "Calendário", url: "/concursos/calendario", icon: CalendarCheck },
        { title: "Resultados", url: "/concursos/resultados", icon: BarChart2 },
        { title: "Cadastrar um concurso", url: "/cadastrar-edital", icon: FileText },
      ],
    },
    {
      groupTitle: "Notificações",
      items: [
        { title: "Avisos", url: "/notificacoes", icon: Bell },
      ],
    },
  ]

  return (
    <Sidebar collapsible="none" {...props} className="bg-white h-screen pl-2">
      <SidebarHeader className="pt-9">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        {items.map((group) => (
          <SidebarGroup key={group.groupTitle}>
            <SidebarGroupLabel>{group.groupTitle}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export default SidebarComponent;
