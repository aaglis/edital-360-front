"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResetPasswordRequest from "@/components/ResetPasswordRequest";
import userService from "@/core/services/userService";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [valid, setValid] = useState<boolean | null>(null);
  const { validateRecoverPasswordToken } = userService;

  const verifyToken = useCallback(async () => {
    try {
      const response = await validateRecoverPasswordToken(token || "");
      const valid = response?.data?.valid ?? response?.valid;

      if (valid) {
        setValid(true);
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("Erro ao validar token:", error);
      router.replace("/");
    }
  }, [token, router, validateRecoverPasswordToken]);

  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }

    verifyToken();
  }, [token, router, verifyToken]);
  if (valid === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Verificando token...</p>
      </div>
    );
  }

  if (!valid) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ResetPasswordRequest token={token} />
    </div>
  );
}
