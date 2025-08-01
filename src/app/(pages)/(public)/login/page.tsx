"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputMask from "react-input-mask"
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { loginSchema, LoginSchema } from "@/core/schemas/login.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cpf: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchema) => {
    console.log("Dados enviados:", data);
  };

  return (
    <div className="max-w-96 mx-auto mt-20 bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col items-center justify-center gap-2 pb-3">
        <h1 className="text-2xl font-bold">Entrar na sua conta</h1>
        <span className="text-zinc-500">Acesse sua área do candidato</span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="cpf"
            //eslint-disable-next-line
            render={({ field }) => (
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2.5 text-gray-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex justify-end">
            <a href="/recuperar-senha" className="text-sm text-primary hover:underline">
              Esqueci minha senha
            </a>
          </div>  

          <Button type="submit" className="w-full">
            Entrar
          </Button>

          <div className="text-center text-sm text-zinc-500 mt-4">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
