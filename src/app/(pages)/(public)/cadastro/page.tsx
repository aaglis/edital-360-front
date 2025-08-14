"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputMask from "react-input-mask";
import { Loader2 } from "lucide-react";

import { registerSchema, RegisterSchema } from "@/core/schemas/register.schema";
import { verificacaoService } from "@/services/verificacaoService";
import { useToast } from "@/hooks/use-toast";

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

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      cpf: "",
      cep: "",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    setIsVerifying(true);

    try {
      const result = await verificacaoService.verificarCadastro({
        cpf: data.cpf,
        cep: data.cep,
      });

      if (
        !result.success &&
        (result.message.includes("Erro ao verificar dados") ||
          result.message.includes("Erro de autorização"))
      ) {
        const cpfLimpo = data.cpf.replace(/\D/g, "");
        const cepLimpo = data.cep.replace(/\D/g, "");

        if (cpfLimpo.length === 11 && cepLimpo.length === 8) {
          toast({
            title: "Dados verificados localmente! ✅",
            description: "API temporariamente indisponível. Redirecionando...",
            variant: "default",
          });

          localStorage.setItem(
            "dadosIniciais",
            JSON.stringify({
              ...data,
              endereco: null,
            })
          );

          router.push("/finalizar-cadastro");

          return;
        } else {
          toast({
            title: "Dados inválidos",
            description: "Verifique se o CPF e CEP estão corretos.",
            variant: "destructive",
          });
          return;
        }
      }

      if (result.success && result.data) {
        const { cpfValido, cepValido, endereco } = result.data;

        if (cpfValido && cepValido) {
          toast({
            title: "Dados verificados com sucesso! ✅",
            description: "Redirecionando para finalizar cadastro...",
            variant: "default",
          });

          localStorage.setItem(
            "dadosIniciais",
            JSON.stringify({
              ...data,
              endereco: endereco || null,
            })
          );

          router.push("/finalizar-cadastro");
        } else {
          let errorMessage = "Dados inválidos: ";
          if (!cpfValido) errorMessage += "CPF inválido. ";
          if (!cepValido) errorMessage += "CEP inválido.";

          toast({
            title: "Erro na verificação",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erro na verificação",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <div className="max-w-96 mx-auto mt-20 bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center justify-center gap-2 pb-3">
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <span className="text-zinc-500">Informe seus dados iniciais</span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cpf"
              render={() => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Controller
                      name="cpf"
                      control={form.control}
                      render={({ field }) => (
                        <InputMask
                          mask="999.999.999-99"
                          placeholder="000.000.000-00"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          {(
                            inputProps: React.InputHTMLAttributes<HTMLInputElement>
                          ) => <Input {...inputProps} />}
                        </InputMask>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cep"
              render={() => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Controller
                      name="cep"
                      control={form.control}
                      render={({ field }) => (
                        <InputMask
                          mask="99999-999"
                          placeholder="00000-000"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          {(
                            inputProps: React.InputHTMLAttributes<HTMLInputElement>
                          ) => <Input {...inputProps} />}
                        </InputMask>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verificando...
                </>
              ) : (
                "Avançar"
              )}
            </Button>

            <div className="text-center text-sm text-zinc-500 mt-4">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </div>
          </form>
        </Form>
      </div>
      <div className="mx-auto">
        <p className="text-center text-sm text-zinc-500 mt-4">
          Ao criar uma conta, você concorda com nossos{" "}
          <Link
            href="/termos-de-servico"
            className="text-primary hover:underline"
          >
            Termos de Serviço
          </Link>{" "}
          e nossa{" "}
          <Link
            href="/politica-de-privacidade"
            className="text-primary hover:underline"
          >
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </>
  );
}
