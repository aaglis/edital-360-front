"use client";

import { getInitials } from "@/core/helpers/formatters";
import ExemptionRequestsTable from "./components/ExemptionRequestsTable";
import EnrollmentsTable from "./components/EnrollmentsTable";
import EditProfileForm from "./components/EditProfileForm";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Edit2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import userService from "@/core/services/userService";
import type { UserData } from "@/core/types/user.interface";
import { escolaridadeMap, sexoMap } from "@/core/helpers/mappers";



export default function PerfilOverviewPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getProfile();
        setUserData(data);
      } catch (error) {
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar seus dados.",
          variant: "destructive",
        });
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [toast]);

  // 💡 Enquanto carrega, renderiza skeletons elegantes
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 💡 Se ainda assim userData for null, mostra fallback
  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-muted-foreground">Erro ao carregar dados do perfil</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Visão Geral do Perfil</h1>

      {/* Cabeçalho do Perfil */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-2 border-primary/10">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary/5">
                  {getInitials(userData?.nomeCompleto || "")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">{userData?.nomeCompleto}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {userData?.email}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{sexoMap[userData?.sex || "O"]}</Badge>
                  <Badge variant="outline">
                    {escolaridadeMap[userData?.escolaridade || "ENSINO_MEDIO_COMPLETO"]}
                  </Badge>
                </div>
              </div>
            </div>

            <Button variant="outline">
              <Edit2 className="h-4 w-4 mr-1" /> Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs principais */}
      <Tabs defaultValue="my-profile" className="w-full" >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-profile">Meu Perfil</TabsTrigger>
          <TabsTrigger value="personal-data">Dados Pessoais</TabsTrigger>
        </TabsList>

        <TabsContent value="my-profile" className="mt-4 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <ExemptionRequestsTable />
            <EnrollmentsTable />
          </div>
        </TabsContent>

        <TabsContent value="personal-data" className="mt-4">
          <EditProfileForm user={userData} onProfileUpdated={(updated) => setUserData(updated)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
