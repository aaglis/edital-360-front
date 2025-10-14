"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputMask from "react-input-mask";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
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
import { Loader2Icon } from "lucide-react";
import { recoverPasswordSchema, type RecoverPasswordSchema } from "@/core/schemas/forgot-password.schema";
import { userService } from "@/core/services/userService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

const RecoverPasswordRequestStep = ({ onSuccess }: { onSuccess: () => void }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { recoverPasswordRequest } = userService;

  const form = useForm<RecoverPasswordSchema>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      cpf: "",
      recaptchaToken: "",
    },
  });

  const onSubmit = async (data: RecoverPasswordSchema) => {
    setIsLoading(true);
    recoverPasswordRequest(data)
      .then((response) => {
        console.log('resposta da solicitacao de recuperacao de senha:', response);
        toast.success("Solicitação de recuperação de senha enviada com sucesso!", {
          position: "top-right",
          closeButton: true,
          duration: 5000,
        });
        recaptchaRef.current?.reset();
        onSuccess();
      })
      .catch((error) => {
        toast.error("Erro ao enviar solicitação de recuperação de senha", {
          description: error?.message,
          duration: 5000,
          position: "top-right",
        });
      }).finally(() => {
        setIsLoading(false);
        recaptchaRef.current?.reset();
      });
  };

  return (
    <div className="max-w-96">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
          <CardDescription>
            Informe seu CPF e escolha como deseja receber a verificação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* CPF */}
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
                            {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                              <Input {...inputProps} />
                            )}
                          </InputMask>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* reCAPTCHA */}
              <FormField
                control={form.control}
                name="recaptchaToken"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                        ref={recaptchaRef}
                        lang="pt-BR"
                        onChange={(token) => {
                          if (token) {
                            form.setValue("recaptchaToken", token);
                          } else {
                            form.setError("recaptchaToken", {
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2Icon className="animate-spin w-5 h-5 mr-2" />}
                  Enviar
                </Button>
                <Link href={'/'}>
                  <Button className="w-full" variant={'outline'}>
                    Voltar
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RecoverPasswordRequestStep;