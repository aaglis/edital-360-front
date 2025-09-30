"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CadastroCompletoSchema,
  cadastroCompletoSchema,
} from "@/core/schemas/cadastro-completo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { userService, type CadastroUsuarioData } from "@/core/services/userService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    const dadosIniciais = localStorage.getItem("dadosIniciais");
    if (dadosIniciais) {
      try {
        const dados = JSON.parse(dadosIniciais);

        form.setValue("nome", dados.nomeCompleto || "");
        form.setValue("cpf", dados.cpf || "");
        form.setValue("cep", dados.cep || "");

        if (dados.endereco) {
          form.setValue("uf", dados.endereco.uf || "");
          form.setValue("cidade", dados.endereco.cidade || "");
          form.setValue("bairro", dados.endereco.bairro || "");
          form.setValue("logradouro", dados.endereco.logradouro || "");
        }

        localStorage.removeItem("dadosIniciais");
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      }
    }
  }, [form]);

  const onSubmit = async (data: CadastroCompletoSchema) => {
    setIsSubmitting(true);

    const cleanData = (
      rawData: CadastroCompletoSchema
    ): CadastroUsuarioData => {
      return {
        cpf: rawData.cpf.replace(/\D/g, ""),
        nomeCompleto: rawData.nome.trim(),
        dataNascimento: rawData.dataNascimento,
        sexo: rawData.sexo,
        nomePai: rawData.nomePai.trim(),
        nomeMae: rawData.nomeMae.trim(),
        escolaridade: rawData.escolaridade,

        identidade: rawData.documentoIdentidade.replace(/\D/g, ""),
        ufIdentidade: rawData.ufIdentidade,

        cep: rawData.cep.replace(/\D/g, ""),
        uf: rawData.uf,
        cidade: rawData.cidade.trim(),
        bairro: rawData.bairro.trim(),
        logradouro: rawData.logradouro.trim(),
        complemento: (rawData.complemento || "").trim(),
        numeroCasa: rawData.numero,

        telefoneDdd: rawData.dddTelefone.replace(/\D/g, ""),
        telefoneNumero: rawData.telefone.replace(/\D/g, ""),
        celularDdd: rawData.dddCelular.replace(/\D/g, ""),
        celularNumero: rawData.celular.replace(/\D/g, ""),
        email: rawData.email.toLowerCase().trim(),
        confirmarEmail: rawData.confirmarEmail.toLowerCase().trim(),
        senha: rawData.senha,
        confirmarSenha: rawData.confirmarSenha,
      };
    };

    const mappedData = cleanData(data);

    try {
      const result = await userService.cadastrar(mappedData);

      if (result.success) {
        toast({
          title: "Cadastro realizado com sucesso! 🎉",
          description: "Redirecionando para a página de login...",
          variant: "default",
          duration: 3000,
        });

        router.push("/login?cadastro=sucesso");
      } else {
        toast({
          title: "Erro no cadastro",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error("Erro inesperado:", error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const senha = form.watch("senha");
  const confirmarSenha = form.watch("confirmarSenha");

  const passwordsMatch = useMemo(() => {
    return senha && confirmarSenha && senha.length > 0 && confirmarSenha.length > 0 && senha === confirmarSenha;
  }, [senha, confirmarSenha]);

  const canSubmit = useMemo(() => {
    return passwordsMatch && form.formState.isValid;
  }, [passwordsMatch, form.formState.isValid]);

  return (
    <div className="flex flex-col items-center py-8 px-4 min-h-screen bg-gray-50">
      <div className="w-full" style={{ maxWidth: '1289px' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cadastro
          </h1>
          <p className="text-gray-600">
            Para prosseguir com seu cadastro, preencha os campos corretamente
          </p>
        </div>
        
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="space-y-8">
                
                {/* Informações pessoais */}
                <div>
                  <h2 className="text-black mb-6" style={{
                    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                    fontWeight: 600,
                    fontSize: '30px',
                    lineHeight: '100%',
                    letterSpacing: '-1%',
                    verticalAlign: 'middle'
                  }}>
                    Informações pessoais
                  </h2>
                   {/* 1ª fileira: CPF, Documento de identidade, Órgão expedidor */}
                  <div className="flex gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">CPF *</FormLabel>
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
                                  {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => 
                                    <Input {...inputProps} className="h-9 w-[320px]" />
                                  }
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
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Documento de identidade *</FormLabel>
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
                                  {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => 
                                    <Input {...inputProps} className="h-9 w-[320px]" />
                                  }
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
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Órgão expedidor de documentos *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: SP"
                              className="h-9 w-[320px]"
                              {...field}
                              maxLength={2}
                              onChange={(e) => {
                                const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 2ª fileira: Nome, Sexo, Data nascimento, Escolaridade */}
                  <div className="flex gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Nome *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite seu nome completo"
                              className="h-9 w-[320px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sexo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Sexo *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-9 w-[320px]">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MASCULINO">Masculino</SelectItem>
                              <SelectItem value="FEMININO">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dataNascimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Data de nascimento *</FormLabel>
                          <FormControl>
                            <Input type="date" className="max-h-8 w-full max-w-[165px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="escolaridade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Escolaridade *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-9 w-[320px]">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="FUNDAMENTAL_INCOMPLETO">Fundamental Incompleto</SelectItem>
                              <SelectItem value="FUNDAMENTAL_COMPLETO">Fundamental Completo</SelectItem>
                              <SelectItem value="MEDIO_INCOMPLETO">Médio Incompleto</SelectItem>
                              <SelectItem value="MEDIO_COMPLETO">Médio Completo</SelectItem>
                              <SelectItem value="SUPERIOR_INCOMPLETO">Superior Incompleto</SelectItem>
                              <SelectItem value="SUPERIOR_COMPLETO">Superior Completo</SelectItem>
                              <SelectItem value="POS_GRADUACAO">Pós-graduação</SelectItem>
                              <SelectItem value="MESTRADO">Mestrado</SelectItem>
                              <SelectItem value="DOUTORADO">Doutorado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 3ª fileira: Nome da mãe, Nome do pai */}
                  <div className="flex gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="nomeMae"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Nome da mãe *</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o nome da mãe" className="h-9 w-[320px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nomePai"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Nome do pai *</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o nome do pai" className="h-9 w-[320px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Endereço e contato */}
                <div>
                  <h2 className="text-black mb-6" style={{
                    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                    fontWeight: 600,
                    fontSize: '30px',
                    lineHeight: '100%',
                    letterSpacing: '-1%',
                    verticalAlign: 'middle'
                  }}>
                    Endereço e contato
                  </h2>
                  
                  {/* 1ª fileira: CEP, UF, Cidade, Bairro */}
                  <div className="flex gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="cep"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">CEP *</FormLabel>
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
                                  {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => 
                                    <Input {...inputProps} className="h-9 w-[320px]" />
                                  }
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
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">UF *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: SP"
                              className="max-h-9 w-full max-w-[100px]"
                              {...field}
                              maxLength={2}
                              onChange={(e) => {
                                const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
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
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Cidade *</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite a cidade" className="h-9 w-[320px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bairro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Bairro *</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o bairro" className="h-9 w-[320px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 2ª fileira: Logradouro, Complemento, Número */}
                  <div className="flex gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="logradouro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Logradouro *</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o logradouro" className="h-9 w-[320px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="complemento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Complemento</FormLabel>
                          <FormControl>
                            <Input placeholder="Apto, bloco..." className="h-9 w-[320px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="numero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Número *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123"
                              className="h-9 w-[320px]"
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

                  {/* 3ª fileira: Email, Confirmar email, DDD, Celular */}
                  <div className="flex gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">E-mail *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="seuemail@exemplo.com"
                              className="h-9 w-[320px]"
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
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Confirmar e-mail *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="seuemail@exemplo.com"
                              className="h-9 w-[320px]"
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
                      name="dddCelular"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">DDD *</FormLabel>
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
                                  {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => 
                                    <Input {...inputProps} className="max-h-9 w-full max-w-[100px]" />
                                  }
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
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Celular *</FormLabel>
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
                                  {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => 
                                    <Input {...inputProps} className="h-9 w-[320px]" />
                                  }
                                </InputMask>
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 4ª fileira: DDD, Telefone */}
                  <div className="flex gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="dddTelefone"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">DDD Telefone</FormLabel>
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
                                  {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => 
                                    <Input {...inputProps} className="max-h-9 w-full max-w-[100px]" />
                                  }
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
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Telefone</FormLabel>
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
                                  {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => 
                                    <Input {...inputProps} className="h-9 w-[320px]" />
                                  }
                                </InputMask>
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Dados de acesso */}
                <div>
                  <h2 className="text-black mb-6" style={{
                    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                    fontWeight: 600,
                    fontSize: '30px',
                    lineHeight: '100%',
                    letterSpacing: '-1%',
                    verticalAlign: 'middle'
                  }}>
                    Dados de acesso
                  </h2>
                  
                  {/* 1ª fileira: Senha e confirmar senha */}
                  <div className="flex gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Senha *</FormLabel>
                          <FormControl>
                            <div className="relative p-0 max-w-[320px]">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite sua senha"
                                className="h-9 pr-10 w-[320px]"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                              >
                                {showPassword ? (
                                  <EyeOffIcon className="w-4 h-4" />
                                ) : (
                                  <EyeIcon className="w-4 h-4" />
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
                      name="confirmarSenha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Confirmar senha *</FormLabel>
                          <FormControl>
                            <div className="relative p-0 max-w-[320px]">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirme sua senha"
                                className="h-9 pr-10 w-[320px]"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex={-1}
                              >
                                {showConfirmPassword ? (
                                  <EyeOffIcon className="w-4 h-4" />
                                ) : (
                                  <EyeIcon className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Requisitos da senha */}
                  <div className="relative p-4 rounded-lg mb-6 bg-transparent border border-blue-500 max-w-[650px]">
                    {/* Borda verde animada que "preenche" da esquerda para direita */}
                    <div 
                      className="absolute top-0 left-0 h-full border-l border-t border-b border-green-500 rounded-l-lg transition-all duration-500 ease-out"
                      style={{
                        width: (() => {
                          if (!senha || senha.length === 0) return '0%';
                          const requirements = [
                            senha.length >= 8,
                            /[A-Z]/.test(senha),
                            /[a-z]/.test(senha),
                            /\d/.test(senha),
                            senha && confirmarSenha && senha.length > 0 && confirmarSenha.length > 0 && senha === confirmarSenha
                          ];
                          const fulfilled = requirements.filter(Boolean).length;
                          return `${(fulfilled / requirements.length) * 100}%`;
                        })()
                      }}
                    />
                    
                    {/* Borda verde top e bottom que acompanha */}
                    <div 
                      className="absolute top-0 left-0 border-t border-green-500 transition-all duration-500 ease-out"
                      style={{
                        width: (() => {
                          if (!senha || senha.length === 0) return '0%';
                          const requirements = [
                            senha.length >= 8,
                            /[A-Z]/.test(senha),
                            /[a-z]/.test(senha),
                            /\d/.test(senha),
                            senha && confirmarSenha && senha.length > 0 && confirmarSenha.length > 0 && senha === confirmarSenha
                          ];
                          const fulfilled = requirements.filter(Boolean).length;
                          return `${(fulfilled / requirements.length) * 100}%`;
                        })()
                      }}
                    />
                    
                    <div 
                      className="absolute bottom-0 left-0 border-b border-green-500 transition-all duration-500 ease-out"
                      style={{
                        width: (() => {
                          if (!senha || senha.length === 0) return '0%';
                          const requirements = [
                            senha.length >= 8,
                            /[A-Z]/.test(senha),
                            /[a-z]/.test(senha),
                            /\d/.test(senha),
                            senha && confirmarSenha && senha.length > 0 && confirmarSenha.length > 0 && senha === confirmarSenha
                          ];
                          const fulfilled = requirements.filter(Boolean).length;
                          return `${(fulfilled / requirements.length) * 100}%`;
                        })()
                      }}
                    />
                    
                    {/* Borda verde direita aparece quando 100% */}
                    <div 
                      className={`absolute top-0 right-0 h-full border-r border-green-500 rounded-r-lg transition-opacity duration-300 ${
                        (() => {
                          if (!senha || senha.length === 0) return 'opacity-0';
                          const requirements = [
                            senha.length >= 8,
                            /[A-Z]/.test(senha),
                            /[a-z]/.test(senha),
                            /\d/.test(senha),
                            senha && confirmarSenha && senha.length > 0 && confirmarSenha.length > 0 && senha === confirmarSenha
                          ];
                          const fulfilled = requirements.filter(Boolean).length;
                          return fulfilled === requirements.length ? 'opacity-100' : 'opacity-0';
                        })()
                      }`}
                    />
                    
                    {/* Conteúdo */}
                    <div className="relative z-10">
                      <div className="text-sm text-gray-600 mb-3">Sua senha deve conter:</div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div
                          className={`flex items-center transition-colors duration-300 ${
                            senha && senha.length >= 8 ? "text-green-600" : "text-blue-600"
                          }`}
                        >
                          <span className="mr-2">
                            {senha && senha.length >= 8 ? "✓" : "ⓘ"}
                          </span>{" "}
                          Mínimo 8 caracteres
                        </div>
                        <div
                          className={`flex items-center transition-colors duration-300 ${
                            senha && /[A-Z]/.test(senha) ? "text-green-600" : "text-blue-600"
                          }`}
                        >
                          <span className="mr-2">
                            {senha && /[A-Z]/.test(senha) ? "✓" : "ⓘ"}
                          </span>{" "}
                          Uma letra maiúscula
                        </div>
                        <div
                          className={`flex items-center transition-colors duration-300 ${
                            senha && /[a-z]/.test(senha) ? "text-green-600" : "text-blue-600"
                          }`}
                        >
                          <span className="mr-2">
                            {senha && /[a-z]/.test(senha) ? "✓" : "ⓘ"}
                          </span>{" "}
                          Uma letra minúscula
                        </div>
                        <div
                          className={`flex items-center transition-colors duration-300 ${
                            senha && /\d/.test(senha) ? "text-green-600" : "text-blue-600"
                          }`}
                        >
                          <span className="mr-2">
                            {senha && /\d/.test(senha) ? "✓" : "ⓘ"}
                          </span>{" "}
                          Um número
                        </div>
                        <div
                          className={`flex items-center transition-colors duration-300 col-span-2 ${
                            passwordsMatch ? "text-green-600" : "text-blue-600"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordsMatch ? "✓" : "ⓘ"}
                          </span>{" "}
                          A senha e a confirmação de senha devem ser iguais
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão de submit */}
                <div className="pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
                    disabled={!canSubmit || isSubmitting}
                    onClick={(e) => {
                      if (!canSubmit) {
                        e.preventDefault();
                        focusFirstError();
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Finalizando cadastro...
                      </>
                    ) : (
                      "Finalizar Cadastro"
                    )}
                  </Button>
                  
                  {!passwordsMatch && senha && confirmarSenha && (
                    <p className="text-sm text-red-600 text-center mt-3">
                      As senhas devem ser iguais para finalizar o cadastro
                    </p>
                  )}

                  {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 text-center font-medium">
                        ⚠️ {errorMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
