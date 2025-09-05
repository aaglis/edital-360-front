"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { resetPasswordSchema, type ResetPasswordSchema } from "@/core/schemas/reset-password.schema";
import { userService } from "@/core/services/userService";
import { Loader2Icon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const ResetPasswordRequest = ({
  nextStep,
  goToRequest,
  cooldownTime,
}: {
  nextStep?: () => void;
  goToRequest: () => void;
  cooldownTime: number;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { recoverPasswordConfirm } = userService;
  const router = useRouter();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      channel: "EMAIL",
      senha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    setIsLoading(true);
    recoverPasswordConfirm(data)
      .then(() => {
        toast.success("Senha redefinida com sucesso! Você será redirecionado para a tela de login.", {
          duration: 5000,
          position: "top-right",
        });

        setTimeout(() => {
          router.push("/login");
        })

        form.reset();
        if (nextStep) nextStep();
      })
      .catch((error) => {
        toast.error("Erro ao redefinir a senha", {
          description: error?.message,
          duration: 5000,
          position: "top-right",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="max-w-96">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
          <CardDescription>
            Insira o código recebido e defina uma nova senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Código */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o código recebido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Nova senha */}
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Digite sua nova senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Confirmar nova senha */}
              <FormField
                control={form.control}
                name="confirmarSenha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirme sua nova senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2Icon className="animate-spin w-5 h-5 mr-2" />}
                Redefinir Senha
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-zinc-500">
            {cooldownTime > 0 ? (
              `Aguarde ${cooldownTime}s para solicitar novamente`
            ) : (
              <button
                onClick={goToRequest}
                className="text-blue-500 underline"
              >
                Não recebeu o código? Solicite novamente
              </button>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordRequest;