"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { editUserSchema } from "@/core/schemas/user.schema";
import userService from "@/core/services/userService";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Save, X } from "lucide-react";
import type { UserData } from "@/core/types/user.interface";
import { formatDate } from "@/core/helpers/formatters";

type FormData = z.infer<typeof editUserSchema>;

interface EditProfileFormProps {
  user: UserData;
  onProfileUpdated?: (updatedUser: UserData) => void;
}

export default function EditProfileForm({ user, onProfileUpdated }: EditProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(editUserSchema),
    mode: "onBlur",
    defaultValues: user,
  });

  const { handleSubmit, control, reset } = form;

  const watchedValues = useWatch({ control });

  useEffect(() => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasDiff = Object.keys(user).some( (key) => (watchedValues as any)[key] !== (user as any)[key]);
    setHasChanges(hasDiff);
  }, [watchedValues, user]);

  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasChanges) {
        event.preventDefault();
        event.returnValue = ""; // necessário para que o aviso apareça no Chrome e Edge
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);

  const onSubmit = async (data: FormData) => {
    if (!hasChanges) {
      toast.error("Nenhuma alteração detectada", {
        description: "Altere algum campo antes de salvar.",
        position: "top-right",
        closeButton: true,
      });
      return;
    }
  
    setSaving(true);
    try {
      const updated = await userService.editProfile(data);
  
      toast.success("Perfil atualizado", {
        description: "Alterações salvas com sucesso!",
        position: "top-right",
        closeButton: true,
      });

      onProfileUpdated?.(updated);
  
      reset(updated);
      setHasChanges(false);
    } catch {
      toast.error("Erro ao salvar", {
        description: "Não foi possível atualizar o perfil.",
        position: "top-right",
        closeButton: true,
      });
    } finally {
      setSaving(false);
    }
  };
  

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>
              Altere apenas os campos permitidos. Os demais exibem um aviso.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* CAMPOS NÃO EDITÁVEIS */}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Nome Completo", value: user.nomeCompleto },
                { label: "Data de Nascimento", value: formatDate(user.dataNascimento) },
                { label: "Sexo", value: user.sex },
                { label: "CPF", value: user.cpf },
              ].map((item) => (
                <div key={item.label}>
                  <FormLabel>{item.label}</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm bg-muted p-2 rounded-md">
                        {item.value || "—"}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Este campo não é editável</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>

            {/* CAMPOS EDITÁVEIS */}
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <Input type="email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="escolaridade"
              render={() => (
                <FormItem>
                  <FormLabel>Escolaridade</FormLabel>
                  <Controller
                    control={control}
                    name="escolaridade"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FUNDAMENTAL_INCOMPLETO">
                            Fundamental Incompleto
                          </SelectItem>
                          <SelectItem value="FUNDAMENTAL_COMPLETO">
                            Fundamental Completo
                          </SelectItem>
                          <SelectItem value="MEDIO_INCOMPLETO">
                            Médio Incompleto
                          </SelectItem>
                          <SelectItem value="MEDIO_COMPLETO">
                            Médio Completo
                          </SelectItem>
                          <SelectItem value="SUPERIOR_INCOMPLETO">
                            Superior Incompleto
                          </SelectItem>
                          <SelectItem value="SUPERIOR_COMPLETO">
                            Superior Completo
                          </SelectItem>
                          <SelectItem value="POS_GRADUACAO">
                            Pós-Graduação
                          </SelectItem>
                          <SelectItem value="MESTRADO">Mestrado</SelectItem>
                          <SelectItem value="DOUTORADO">Doutorado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="uf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <Input {...field} maxLength={2} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="logradouro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="numeroCasa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="complemento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={control}
                    name="telefoneDdd"
                    render={({ field }) => (
                      <Input {...field} placeholder="DDD" className="w-20" />
                    )}
                  />
                  <FormField
                    control={control}
                    name="telefoneNumero"
                    render={({ field }) => (
                      <Input {...field} placeholder="Número" />
                    )}
                  />
                </div>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Celular</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={control}
                    name="celularDdd"
                    render={({ field }) => (
                      <Input {...field} placeholder="DDD" className="w-20" />
                    )}
                  />
                  <FormField
                    control={control}
                    name="celularNumero"
                    render={({ field }) => (
                      <Input {...field} placeholder="Número" />
                    )}
                  />
                </div>
                <FormMessage />
              </FormItem>
            </div>

            {/* AÇÕES */}
            <div className="flex justify-end gap-3 pt-4">
              {hasChanges && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset(user);
                    setHasChanges(false);
                  }}
                >
                  <X className="h-4 w-4 mr-1" /> Cancelar
                </Button>
              )}
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
