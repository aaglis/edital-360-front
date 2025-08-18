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
    <div className="flex justify-center mt-20 w-96 mx-auto">
      <Card className="w-full shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Entrar na sua conta
          </CardTitle>
          <CardDescription>
            Acesse sua área do candidato
          </CardDescription>
        </CardHeader>

        <CardContent>
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

              <FormField
                control={form.control}
                name="recaptchaResponse"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                        ref={recaptchaRef}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-end">
                <Link href="/recuperar-senha" className="text-sm text-primary hover:underline">
                  Esqueci minha senha
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2Icon className="animate-spin w-5 h-5 mr-2" />}
                Entrar
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-zinc-500">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
