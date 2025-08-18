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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

const RecoverPasswordRequestStep = ({ onSuccess }: { onSuccess: () => void }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { recoverPasswordRequest } = userService;

  const form = useForm<RecoverPasswordSchema>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      cpf: "",
      channel: "EMAIL",
      recaptchaToken: "",
    },
  });

  const onSubmit = async (data: RecoverPasswordSchema) => {
    setIsLoading(true);
    recoverPasswordRequest(data)
      .then((response) => {
        console.log('resposta da solicitacao de recuperacao de senha:', response);
        toast.success("Solicitação de recuperação de senha enviada com sucesso!");
        recaptchaRef.current?.reset();
        onSuccess(); // Navega para a próxima etapa
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

              {/* Canal de envio */}
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Como deseja receber a verificação?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid grid-cols-2 gap-3"
                      >
                        <div className="flex items-center space-x-2 border rounded-lg p-3">
                          <RadioGroupItem id="channel-email" value="EMAIL" />
                          <Label htmlFor="channel-email">E-mail</Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-3">
                          <RadioGroupItem id="channel-sms" value="SMS" />
                          <Label htmlFor="channel-sms">SMS</Label>
                        </div>
                      </RadioGroup>
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2Icon className="animate-spin w-5 h-5 mr-2" />}
                Enviar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RecoverPasswordRequestStep;