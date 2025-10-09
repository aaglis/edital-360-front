import SidebarComponent from "@/components/dashboard/SidebarComponent";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Separator } from "@/components/ui/separator";

export default function UserSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      {/* Sidebar fixa */}
      <SidebarComponent />

      {/* Conteúdo com efeito arredondado */}
      <SidebarInset>
        <div className="flex flex-col flex-1 rounded-3xl m-4 bg-white shadow-sm">
          <div className="w-full flex gap-4 items-center px-4 py-2">
            <SidebarTrigger />
            <DashboardHeader />
          </div>
          <Separator />
          <main className="p-6 flex-1">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
