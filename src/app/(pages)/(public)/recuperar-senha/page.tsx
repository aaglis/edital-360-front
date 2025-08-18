"use client";

import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import RecoverPasswordRequestStep from "../../../../components/RecoverPasswordRequest";
import ResetPasswordRequest from "../../../../components/ResetPasswordRequest";
import { toast } from "sonner";

export default function RecoverPasswordPage() {
  const [activeTab, setActiveTab] = useState("recoverRequest");
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    const savedCooldown = localStorage.getItem("resetPasswordCooldown");
    if (savedCooldown) {
      const remainingTime = parseInt(savedCooldown, 10) - Date.now();
      if (remainingTime > 0) {
        setCooldownTime(Math.ceil(remainingTime / 1000));
        setActiveTab("password");
        const interval = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              localStorage.removeItem("resetPasswordCooldown");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(interval);
      } else {
        localStorage.removeItem("resetPasswordCooldown");
      }
    }
  }, []);

  const startCooldown = () => {
    const cooldownDuration = 60000; // 1 minuto
    const endTime = Date.now() + cooldownDuration;
    localStorage.setItem("resetPasswordCooldown", endTime.toString());
    setCooldownTime(cooldownDuration / 1000);

    const interval = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("resetPasswordCooldown");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSuccess = () => {
    setActiveTab("password");
    startCooldown();
  };

  const handleTabChange = (tab: string) => {
    if (tab === "recoverRequest" && cooldownTime > 0) {
      toast("Aguarde o tempo de espera antes de solicitar novamente.");
      return;
    }
    setActiveTab(tab);
  };

  const goToRequest = () => {
    if (cooldownTime > 0) {
      toast("Aguarde o tempo de espera antes de solicitar novamente.");
      return;
    }
    setActiveTab("recoverRequest");
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 mx-auto py-11">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recoverRequest" disabled={cooldownTime > 0}>
            {cooldownTime > 0 ? `Aguarde ${cooldownTime}s` : "Solicitar recuperação"}
          </TabsTrigger>
          <TabsTrigger value="password" disabled={activeTab !== "password"}>
            Alterar senha
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recoverRequest">
          <RecoverPasswordRequestStep onSuccess={handleSuccess} />
        </TabsContent>
        <TabsContent value="password">
          <ResetPasswordRequest goToRequest={goToRequest} cooldownTime={cooldownTime} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
