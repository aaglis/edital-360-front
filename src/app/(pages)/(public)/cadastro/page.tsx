"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputMask from "react-input-mask";

import { registerSchema, RegisterSchema } from "@/core/schemas/register.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nomeCompleto: "",
      cpf: "",
      cep: "",
    },
  });

  const onSubmit = (data: RegisterSchema) => {
    console.log("Cadastro parcial:", data);
    router.push("/cadastro-completo"); // rota de completar cadastro
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
              name="nomeCompleto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                          {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => <Input {...inputProps} />}
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
                          {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => <Input {...inputProps} />}
                        </InputMask>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Avançar
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
          <Link href="/termos-de-servico" className="text-primary hover:underline">
            Termos de Serviço
          </Link>{" "}
          e nossa{" "}
          <Link href="/politica-de-privacidade" className="text-primary hover:underline">
            Política de Privacidade
          </Link>.
        </p>
      </div>
    </>
  );
}
