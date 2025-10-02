"use client"

import Link from "next/link";
import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputMask from "react-input-mask"
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
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
import { userService } from "@/core/services/userService";
import ReCAPTCHA  from "react-google-recaptcha";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = userService;

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cpf: "",
      password: "",
      recaptchaResponse: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    login(data)
      .then((response: {token: string}) => {
        const { token } = response;
        sessionStorage.setItem("auth_token", token);
        Cookies.set("token", token, { expires: 1 }); // Store token in cookies for 7 days

        setIsLoading(false);
        recaptchaRef.current?.reset();
        router.push("/configuracoes");
      })
      .catch((error) => {
        toast.error("Erro ao realizar login: ", {
          description: error?.message,
          duration: 5000,
          position: "top-right",
        });
        setIsLoading(false);
      });
  };

  return (
    <div className="flex justify-center max-w-96 md:w-[500px] md:max-w-none mx-auto">
      <Card className="w-full shadow-lg rounded-3xl mx-2 md:mx-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Login Edital360
          </CardTitle>
          <CardDescription>
            Preencha os campos para fazer login
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 md:px-10">
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
                            placeholder="Digite seu CPF..."
                            value={field.value}
                            onChange={(e) => {
                              const onlyDigits = e.target.value.replace(/\D/g, "");
                              field.onChange(onlyDigits);
                            }}
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
                          placeholder="Digite sua senha..."
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2.5"
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
                <Link href="/recuperar-senha" className="text-sm text-primary underline">
                  Esqueci minha senha
                </Link>
              </div>

              <FormField
                control={form.control}
                name="recaptchaResponse"
                render={() => (
                  <FormItem className="w-full flex flex-col items-center justify-center py-4">
                    <FormControl>
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                        ref={recaptchaRef}
                        lang="pt-BR"
                        onChange={(token) => {
                          if(token) {
                            form.setValue("recaptchaResponse", token);
                          } else {
                            form.setError("recaptchaResponse", {
                              type: "manual",
                              message: "Verifique o reCAPTCHA",
                            });
                          }
                        }}
                        hl="pt-BR"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full text-white"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2Icon className="animate-spin w-5 h-5 mr-2" />}
                  Entrar
                </Button>
                <Link href="/">
                  <Button 
                    type="button" 
                    variant={"outline"}
                    className="w-full"
                  >
                    Voltar
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-zinc-500">
            Não possui uma conta? Faça seu{" "}
            <Link href="/cadastro" className="text-primary underline">
              Cadastro
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
