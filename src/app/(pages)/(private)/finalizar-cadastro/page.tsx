"use client";
import { useState, useMemo } from "react";
import {
  CadastroCompletoSchema,
  cadastroCompletoSchema,
} from "@/core/schemas/cadastro-completo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function RegisterComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fieldOrder = [
    "nome",
    "dataNascimento",
    "sexo",
    "nomePai",
    "nomeMae",
    "escolaridade",
    "cpf",
    "documentoIdentidade",
    "ufIdentidade",
    "cep",
    "uf",
    "cidade",
    "bairro",
    "logradouro",
    "complemento",
    "numero",
    "dddTelefone",
    "telefone",
    "dddCelular",
    "celular",
    "email",
    "confirmarEmail",
    "senha",
    "confirmarSenha",
  ];

  const focusElementWithMessage = (fieldName: string, message: string) => {
    const element = document.querySelector(
      `[name="${fieldName}"]`
    ) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 5000);
      return true;
    }
    return false;
  };

  const focusFirstError = () => {
    const errors = form.formState.errors;
    const formValues = form.getValues();

    if (!passwordsMatch && formValues.senha && formValues.confirmarSenha) {
      focusElementWithMessage(
        "confirmarSenha",
        "As senhas devem ser iguais para finalizar o cadastro"
      );
      return;
    }

    for (const field of fieldOrder) {
      const fieldError = errors[field as keyof CadastroCompletoSchema];
      if (fieldError) {
        const message = `Por favor, corrija o campo "${getFieldLabel(
          field
        )}": ${fieldError.message}`;
        if (focusElementWithMessage(field, message)) break;
      }
    }

    for (const field of fieldOrder) {
      const value = formValues[field as keyof CadastroCompletoSchema];
      const isEmpty =
        !value || (typeof value === "string" && value.trim() === "");
      if (isEmpty) {
        const message = `Por favor, preencha o campo obrigatório: "${getFieldLabel(
          field
        )}"`;
        if (focusElementWithMessage(field, message)) break;
      }
    }
  };

  const getFieldLabel = (fieldName: string): string => {
    const labels: Record<string, string> = {
      nome: "Nome",
      dataNascimento: "Data de Nascimento",
      sexo: "Sexo",
      nomePai: "Nome do Pai",
      nomeMae: "Nome da Mãe",
      escolaridade: "Escolaridade",
      cpf: "CPF",
      documentoIdentidade: "Documento de Identidade",
      ufIdentidade: "UF do Documento",
      cep: "CEP",
      uf: "UF",
      cidade: "Cidade",
      bairro: "Bairro",
      logradouro: "Logradouro",
      complemento: "Complemento",
      numero: "Número",
      dddTelefone: "DDD Telefone",
      telefone: "Telefone",
      dddCelular: "DDD Celular",
      celular: "Celular",
      email: "E-mail",
      confirmarEmail: "Confirmar E-mail",
      senha: "Senha",
      confirmarSenha: "Confirmar Senha",
    };
    return labels[fieldName] || fieldName;
  };

  const form = useForm<CadastroCompletoSchema>({
    resolver: zodResolver(cadastroCompletoSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      nome: "",
      dataNascimento: "",
      sexo: undefined,
      nomePai: "",
      nomeMae: "",

      escolaridade: undefined,

      cpf: "",
      documentoIdentidade: "",
      ufIdentidade: "",

      cep: "",
      uf: "",
      cidade: "",
      bairro: "",
      logradouro: "",
      complemento: "",
      numero: "",

      dddTelefone: "",
      telefone: "",
      dddCelular: "",
      celular: "",
      email: "",
      confirmarEmail: "",

      senha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit = (data: CadastroCompletoSchema) => {
    console.log("Dados do cadastro:", data);
  };

  const calculatePasswordStrength = (
    password: string
  ): { score: number; percentage: number; color: string; text: string } => {
    let score = 0;

    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (/[a-z]/.test(password)) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/\d/.test(password)) score += 20;
    if (/[^a-zA-Z0-9]/.test(password)) score += 10;

    let color = "bg-red-500";
    let text = "Muito fraca";

    if (score >= 80) {
      color = "bg-green-500";
      text = "Muito forte";
    } else if (score >= 60) {
      color = "bg-yellow-500";
      text = "Forte";
    } else if (score >= 40) {
      color = "bg-orange-500";
      text = "Moderada";
    } else if (score >= 20) {
      color = "bg-red-400";
      text = "Fraca";
    }

    return { score, percentage: score, color, text };
  };

  const senha = form.watch("senha");
  const confirmarSenha = form.watch("confirmarSenha");

  const passwordsMatch = useMemo(() => {
    return senha && confirmarSenha && senha === confirmarSenha;
  }, [senha, confirmarSenha]);

  const canSubmit = useMemo(() => {
    return passwordsMatch && form.formState.isValid;
  }, [passwordsMatch, form.formState.isValid]);

  return (
    <div className="flex flex-col items-center mt-20 mx-8 min-h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >
          <div className="w-full max-w-[843px] bg-white shadow-md rounded-lg p-6 border border-gray-300">
            <h1 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
              Dados pessoais
            </h1>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="col-span-2 ">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite seu nome completo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataNascimento"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sexo"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nomePai"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Nome do Pai</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do pai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nomeMae"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Nome do Mãe</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do Mãe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="escolaridade"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Escolaridade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a escolaridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fundamental">Fundamental</SelectItem>
                        <SelectItem value="medio">Médio</SelectItem>
                        <SelectItem value="superior-incompleto">
                          Superior Incompleto
                        </SelectItem>
                        <SelectItem value="superior-completo">
                          Superior Completo
                        </SelectItem>
                        <SelectItem value="pos-graduacao">
                          Pós-graduação
                        </SelectItem>
                        <SelectItem value="mestrado">Mestrado</SelectItem>
                        <SelectItem value="doutorado">Doutorado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-full max-w-[843px] bg-white shadow-md rounded-lg p-6 border border-gray-300 mt-8">
            <h1 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
              Documentos
            </h1>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <FormField
                control={form.control}
                name="cpf"
                render={() => (
                  <FormItem className="col-span-2 md:col-span-1">
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
                name="documentoIdentidade"
                render={() => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Documento de Identidade</FormLabel>
                    <FormControl>
                      <Controller
                        name="documentoIdentidade"
                        control={form.control}
                        render={({ field }) => (
                          <InputMask
                            mask="99.999.999-*"
                            placeholder="00.000.000-0"
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
                name="ufIdentidade"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>UF do Documento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: SP"
                        {...field}
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z]/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-full max-w-[843px] bg-white shadow-md rounded-lg p-6 border border-gray-300 mt-8">
            <h1 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
              Endereços
            </h1>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
              <FormField
                control={form.control}
                name="cep"
                render={() => (
                  <FormItem className="col-span-2 md:col-span-1">
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
              <FormField
                control={form.control}
                name="uf"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>UF</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: SP"
                        {...field}
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z]/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logradouro"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-2">
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o logradouro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complemento"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o complemento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o número"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-full max-w-[843px] bg-white shadow-md rounded-lg p-6 border border-gray-300 mt-8">
            <h1 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
              Contatos
            </h1>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
              <FormField
                control={form.control}
                name="dddTelefone"
                render={() => (
                  <FormItem className="col-span-4 md:col-span-1">
                    <FormLabel>DDD Telefone</FormLabel>
                    <FormControl>
                      <Controller
                        name="dddTelefone"
                        control={form.control}
                        render={({ field }) => (
                          <InputMask
                            mask="99"
                            placeholder="11"
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
                name="telefone"
                render={() => (
                  <FormItem className="col-span-4 md:col-span-1">
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Controller
                        name="telefone"
                        control={form.control}
                        render={({ field }) => (
                          <InputMask
                            mask="9999-9999"
                            placeholder="0000-0000"
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
                name="dddCelular"
                render={() => (
                  <FormItem className="col-span-4 md:col-span-1">
                    <FormLabel>DDD Celular</FormLabel>
                    <FormControl>
                      <Controller
                        name="dddCelular"
                        control={form.control}
                        render={({ field }) => (
                          <InputMask
                            mask="99"
                            placeholder="11"
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
                name="celular"
                render={() => (
                  <FormItem className="col-span-4 md:col-span-1">
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <Controller
                        name="celular"
                        control={form.control}
                        render={({ field }) => (
                          <InputMask
                            mask="99999-9999"
                            placeholder="00000-0000"
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
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Digite seu e-mail"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().trim();
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmarEmail"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Confirmar E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Confirme seu e-mail"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().trim();
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-full max-w-[843px] bg-white shadow-md rounded-lg p-6 border border-gray-300 mt-8">
            <h1 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
              Senha de Acesso
            </h1>
            <div className="space-y-6">
              
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => {
                  const strength = calculatePasswordStrength(field.value || "");
                  const getStrengthColor = (percentage: number) => {
                    if (percentage >= 80) return "text-green-600";
                    if (percentage >= 60) return "text-yellow-600";
                    return "text-red-600";
                  };

                  return (
                    <FormItem className="col-span-2">
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
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

                      {field.value && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Força da senha:
                            </span>
                            <span
                              className={`text-sm font-medium ${getStrengthColor(
                                strength.percentage
                              )}`}
                            >
                              {strength.text}
                            </span>
                          </div>
                          <Progress
                            value={strength.percentage}
                            className="h-2"
                          />
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>Sua senha deve conter:</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div
                                className={`flex items-center ${
                                  field.value.length >= 8
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                <span className="mr-1">
                                  {field.value.length >= 8 ? "✓" : "○"}
                                </span>{" "}
                                Mínimo 8 caracteres
                              </div>
                              <div
                                className={`flex items-center ${
                                  /[A-Z]/.test(field.value)
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                <span className="mr-1">
                                  {/[A-Z]/.test(field.value) ? "✓" : "○"}
                                </span>{" "}
                                Uma letra maiúscula
                              </div>
                              <div
                                className={`flex items-center ${
                                  /[a-z]/.test(field.value)
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                <span className="mr-1">
                                  {/[a-z]/.test(field.value) ? "✓" : "○"}
                                </span>{" "}
                                Uma letra minúscula
                              </div>
                              <div
                                className={`flex items-center ${
                                  /\d/.test(field.value)
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                <span className="mr-1">
                                  {/\d/.test(field.value) ? "✓" : "○"}
                                </span>{" "}
                                Um número
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="confirmarSenha"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirme sua senha"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>

                    {field.value && senha && (
                      <div
                        className={`text-sm flex items-center ${
                          passwordsMatch ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {passwordsMatch
                          ? "As senhas coincidem"
                          : "As senhas não coincidem"}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-full max-w-[843px] mt-6">
            <Button
              type="submit"
              className="w-full mb-6"
              onClick={(e) => {
                if (!canSubmit) {
                  e.preventDefault();
                  focusFirstError();
                }
              }}
            >
              Finalizar Cadastro
            </Button>
            {!passwordsMatch && senha && confirmarSenha && (
              <p className="text-sm text-red-600 text-center mt-2">
                As senhas devem ser iguais para finalizar o cadastro
              </p>
            )}

            {errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 text-center font-medium">
                  ⚠️ {errorMessage}
                </p>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
