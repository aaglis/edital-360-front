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
import {
  userService,
  type CadastroUsuarioData,
} from "@/core/services/userService";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RegisterComponent() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReloadWarning, setShowReloadWarning] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'confirmation'>('form');

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

  const focusElementWithMessage = (fieldName: string) => {
    const element = document.querySelector(
      `[name="${fieldName}"]`
    ) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      return true;
    }
    return false;
  };

  const focusFirstError = () => {
    const errors = form.formState.errors;
    const formValues = form.getValues();
    const camposOpcionais = ['complemento', 'dddTelefone', 'telefone'];

    // Primeiro, verifica se as senhas coincidem
    if (!passwordsMatch && formValues.senha && formValues.confirmarSenha) {
      focusElementWithMessage("confirmarSenha");
      return;
    }

    // Verifica erros de validação primeiro (campos com formato incorreto)
    for (const field of fieldOrder) {
      const fieldError = errors[field as keyof CadastroCompletoSchema];
      if (fieldError) {
        if (focusElementWithMessage(field)) return;
      }
    }

    // Depois verifica campos obrigatórios vazios
    for (const field of fieldOrder) {
      const value = formValues[field as keyof CadastroCompletoSchema];
      const isEmpty = !value || (typeof value === "string" && value.trim() === "");
      const isObrigatorio = !camposOpcionais.includes(field);
      
      if (isEmpty && isObrigatorio) {
        if (focusElementWithMessage(field)) return;
      }
    }
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        event.preventDefault();
        setShowReloadWarning(true);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message =
        "Você tem certeza que deseja sair? Todo o progresso do formulário será perdido.";
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    const handleUnload = () => {
      try {
        localStorage.setItem("redirectToCadastro", "true");
      } catch (error) {
        console.error("Erro ao salvar no localStorage:", error);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  useEffect(() => {
    const shouldRedirect = localStorage.getItem("redirectToCadastro");
    if (shouldRedirect === "true") {
      localStorage.removeItem("redirectToCadastro");
      router.push("/cadastro");
    }
  }, [router]);

  const handleConfirmReload = () => {
    setShowReloadWarning(false);
    router.push("/cadastro");
  };

  const handleCancelReload = () => {
    setShowReloadWarning(false);
  };

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
          title: "Cadastro realizado com sucesso!",
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
    return (
      senha &&
      confirmarSenha &&
      senha.length > 0 &&
      confirmarSenha.length > 0 &&
      senha === confirmarSenha
    );
  }, [senha, confirmarSenha]);

  const canSubmit = useMemo(() => {
    return passwordsMatch && form.formState.isValid;
  }, [passwordsMatch, form.formState.isValid]);

  return (
    <div
      className="flex flex-col items-center py-8 px-4 min-h-screen"
      style={{ backgroundColor: "#E5E5E5" }}
    >
      <div className="w-full" style={{ maxWidth: "1289px" }}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border p-8">
              <div className="space-y-8">
                
                {currentStep === 'form' && (
                  <>
                    {/* Título principal */}
                    <div className="text-left mb-12">
                      <h1
                        className="mb-2"
                        style={{
                          fontFamily:
                            "var(--font-geist-sans), system-ui, sans-serif",
                          fontWeight: 600,
                          fontSize: "48px",
                          lineHeight: "100%",
                          letterSpacing: "-1%",
                          textAlign: "left",
                          verticalAlign: "middle",
                          color: "black",
                        }}
                      >
                        Cadastro
                      </h1>
                      <p
                        style={{
                          fontFamily:
                            "var(--font-geist-sans), system-ui, sans-serif",
                          fontWeight: 600,
                          fontSize: "20px",
                          lineHeight: "120%",
                          letterSpacing: "-2%",
                          textAlign: "left",
                          verticalAlign: "middle",
                          color: "black",
                        }}
                      >
                        Para prosseguir com seu cadastro, preencha os campos
                        corretamente
                      </p>
                    </div>

                {/* Informações pessoais */}
                <div>
                  <h2
                    className="text-black mb-6"
                    style={{
                      fontFamily:
                        "var(--font-geist-sans), system-ui, sans-serif",
                      fontWeight: 600,
                      fontSize: "30px",
                      lineHeight: "100%",
                      letterSpacing: "-1%",
                      verticalAlign: "middle",
                    }}
                  >
                    Informações pessoais
                  </h2>
                  {/* 1ª fileira: CPF, Documento de identidade, Órgão expedidor */}
                  <div className="flex flex-col lg:flex-row gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={() => (
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            CPF <span className="asterisk">*</span>
                          </FormLabel>
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
                                  disabled={true}
                                >
                                  {(
                                    inputProps: React.InputHTMLAttributes<HTMLInputElement>
                                  ) => (
                                    <Input
                                      {...inputProps}
                                      className="form-input-disabled h-9 w-full "
                                    />
                                  )}
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
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Documento de identidade{" "}
                            <span className="asterisk">*</span>
                          </FormLabel>
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
                                  ) => (
                                    <Input
                                      {...inputProps}
                                      className="form-input-custom h-9 w-full"
                                    />
                                  )}
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
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Órgão expedidor de documentos{" "}
                            <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: SP"
                              className="form-input-custom h-9 w-full"
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

                  {/* 2ª fileira: Nome, Sexo, Data nascimento, Escolaridade */}
                  <div className="flex flex-col lg:flex-row gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem className="max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Nome <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite seu nome completo"
                              className="form-input-custom h-9 w-full"
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
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Sexo <span className="asterisk">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="form-input-custom h-9 w-full">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MASCULINO">
                                Masculino
                              </SelectItem>
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
                        <FormItem className="w-full max-w-[100%] lg:max-w-[165px]">
                          <FormLabel className="form-label-geist">
                            Data de nascimento{" "}
                            <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="form-input-custom max-h-8 w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="escolaridade"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Escolaridade <span className="asterisk">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="form-input-custom h-9 w-full">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
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
                                Pós-graduação
                              </SelectItem>
                              <SelectItem value="MESTRADO">Mestrado</SelectItem>
                              <SelectItem value="DOUTORADO">
                                Doutorado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 3ª fileira: Nome da mãe, Nome do pai */}
                  <div className="flex flex-col lg:flex-row gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="nomeMae"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Nome da mãe <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite o nome da mãe"
                              className="form-input-custom h-9 w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nomePai"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Nome do pai <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite o nome do pai"
                              className="form-input-custom h-9 w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Endereço e contato */}
                <div className="">
                  <h2
                    className="text-black mb-6 mt-16"
                    style={{
                      fontFamily:
                        "var(--font-geist-sans), system-ui, sans-serif",
                      fontWeight: 600,
                      fontSize: "30px",
                      lineHeight: "100%",
                      letterSpacing: "-1%",
                      verticalAlign: "middle",
                    }}
                  >
                    Endereço e contato
                  </h2>

                  {/* 1ª fileira: CEP, UF, Cidade, Bairro */}
                  <div className="flex flex-col lg:flex-row gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="cep"
                      render={() => (
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            CEP <span className="asterisk">*</span>
                          </FormLabel>
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
                                  ) => (
                                    <Input
                                      {...inputProps}
                                      className="form-input-custom h-9 w-full"
                                    />
                                  )}
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
                        <FormItem className="w-full max-w-[100%] lg:max-w-[100px]">
                          <FormLabel className="form-label-geist">
                            UF <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: SP"
                              className="form-input-custom max-h-9 w-full"
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
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Cidade <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite a cidade"
                              className="form-input-custom h-9 w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bairro"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Bairro <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite o bairro"
                              className="form-input-custom h-9 w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 2ª fileira: Logradouro, Complemento, Número */}
                  <div className="flex flex-col lg:flex-row gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="logradouro"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Logradouro <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite o logradouro"
                              className="form-input-custom h-9 w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="complemento"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Complemento
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Apto, bloco..."
                              className="form-input-custom h-9 w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numero"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Número <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123"
                              className="form-input-custom h-9 w-full"
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
                  <div className="flex flex-col lg:flex-row gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            E-mail <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="seuemail@exemplo.com"
                              className="form-input-custom h-9 w-full"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value
                                  .toLowerCase()
                                  .trim();
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
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Confirmar e-mail <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="seuemail@exemplo.com"
                              className="form-input-custom h-9 w-full"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value
                                  .toLowerCase()
                                  .trim();
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
                        <FormItem className="w-full max-w-[100%] lg:max-w-[100px]">
                          <FormLabel className="form-label-geist">
                            DDD <span className="asterisk">*</span>
                          </FormLabel>
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
                                  ) => (
                                    <Input
                                      {...inputProps}
                                      className="form-input-custom max-h-9 w-full"
                                    />
                                  )}
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
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Celular <span className="asterisk">*</span>
                          </FormLabel>
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
                                  ) => (
                                    <Input
                                      {...inputProps}
                                      className="form-input-custom h-9 w-full"
                                    />
                                  )}
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
                  <div className="flex flex-col lg:flex-row gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="dddTelefone"
                      render={() => (
                        <FormItem className="w-full max-w-[100%] lg:max-w-[100px]">
                          <FormLabel className="form-label-geist">
                            DDD Telefone
                          </FormLabel>
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
                                  ) => (
                                    <Input
                                      {...inputProps}
                                      className="form-input-custom max-h-9 w-full"
                                    />
                                  )}
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
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Telefone
                          </FormLabel>
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
                                  ) => (
                                    <Input
                                      {...inputProps}
                                      className="form-input-custom h-9 w-full"
                                    />
                                  )}
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
                  <h2
                    className="text-black mb-6 mt-16"
                    style={{
                      fontFamily:
                        "var(--font-geist-sans), system-ui, sans-serif",
                      fontWeight: 600,
                      fontSize: "30px",
                      lineHeight: "100%",
                      letterSpacing: "-1%",
                      verticalAlign: "middle",
                    }}
                  >
                    Dados de acesso
                  </h2>

                  {/* 1ª fileira: Senha e confirmar senha */}
                  <div className="flex flex-col lg:flex-row gap-3 mb-6">
                    <FormField
                      control={form.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Senha <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative p-0 max-w-[100%] lg:max-w-[320px]">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite sua senha"
                                className="form-input-custom h-9 pr-10 w-full"
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
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmarSenha"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[100%] lg:max-w-[320px]">
                          <FormLabel className="form-label-geist">
                            Confirmar senha <span className="asterisk">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative p-0 max-w-[100%] lg:max-w-[320px]">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirme sua senha"
                                className="form-input-custom h-9 pr-10 w-full"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
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
                          if (!senha || senha.length === 0) return "0%";
                          const requirements = [
                            senha.length >= 8,
                            /[A-Z]/.test(senha),
                            /[a-z]/.test(senha),
                            /\d/.test(senha),
                            senha &&
                              confirmarSenha &&
                              senha.length > 0 &&
                              confirmarSenha.length > 0 &&
                              senha === confirmarSenha,
                          ];
                          const fulfilled = requirements.filter(Boolean).length;
                          return `${(fulfilled / requirements.length) * 100}%`;
                        })(),
                      }}
                    />

                    {/* Borda verde top e bottom que acompanha */}
                    <div
                      className="absolute top-0 left-0 border-t border-green-500 transition-all duration-500 ease-out"
                      style={{
                        width: (() => {
                          if (!senha || senha.length === 0) return "0%";
                          const requirements = [
                            senha.length >= 8,
                            /[A-Z]/.test(senha),
                            /[a-z]/.test(senha),
                            /\d/.test(senha),
                            senha &&
                              confirmarSenha &&
                              senha.length > 0 &&
                              confirmarSenha.length > 0 &&
                              senha === confirmarSenha,
                          ];
                          const fulfilled = requirements.filter(Boolean).length;
                          return `${(fulfilled / requirements.length) * 100}%`;
                        })(),
                      }}
                    />

                    <div
                      className="absolute bottom-0 left-0 border-b border-green-500 transition-all duration-500 ease-out"
                      style={{
                        width: (() => {
                          if (!senha || senha.length === 0) return "0%";
                          const requirements = [
                            senha.length >= 8,
                            /[A-Z]/.test(senha),
                            /[a-z]/.test(senha),
                            /\d/.test(senha),
                            senha &&
                              confirmarSenha &&
                              senha.length > 0 &&
                              confirmarSenha.length > 0 &&
                              senha === confirmarSenha,
                          ];
                          const fulfilled = requirements.filter(Boolean).length;
                          return `${(fulfilled / requirements.length) * 100}%`;
                        })(),
                      }}
                    />

                    {/* Borda verde direita aparece quando 100% */}
                    <div
                      className={`absolute top-0 right-0 h-full border-r border-green-500 rounded-r-lg transition-opacity duration-300 ${(() => {
                        if (!senha || senha.length === 0) return "opacity-0";
                        const requirements = [
                          senha.length >= 8,
                          /[A-Z]/.test(senha),
                          /[a-z]/.test(senha),
                          /\d/.test(senha),
                          senha &&
                            confirmarSenha &&
                            senha.length > 0 &&
                            confirmarSenha.length > 0 &&
                            senha === confirmarSenha,
                        ];
                        const fulfilled = requirements.filter(Boolean).length;
                        return fulfilled === requirements.length
                          ? "opacity-100"
                          : "opacity-0";
                      })()}`}
                    />

                    {/* Conteúdo */}
                    <div className="relative z-10">
                      <div className="text-sm text-gray-600 mb-3">
                        Sua senha deve conter:
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div
                          className={`flex items-center transition-colors duration-300 ${
                            senha && senha.length >= 8
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          <span className="mr-2">
                            {senha && senha.length >= 8 ? "✓" : "ⓘ"}
                          </span>{" "}
                          Mínimo 8 caracteres
                        </div>
                        <div
                          className={`flex items-center transition-colors duration-300 ${
                            senha && /[A-Z]/.test(senha)
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          <span className="mr-2">
                            {senha && /[A-Z]/.test(senha) ? "✓" : "ⓘ"}
                          </span>{" "}
                          Uma letra maiúscula
                        </div>
                        <div
                          className={`flex items-center transition-colors duration-300 ${
                            senha && /[a-z]/.test(senha)
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          <span className="mr-2">
                            {senha && /[a-z]/.test(senha) ? "✓" : "ⓘ"}
                          </span>{" "}
                          Uma letra minúscula
                        </div>
                        <div
                          className={`flex items-center transition-colors duration-300 ${
                            senha && /\d/.test(senha)
                              ? "text-green-600"
                              : "text-blue-600"
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

                {/* Botões de navegação */}
                <div className="pt-6 border-t border-white">
                  <div className="flex justify-between items-center">
                    {/* Botão Voltar */}
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 w-full px-8 text-base font-medium text-gray-700 hover:text-gray-700 bg-white hover:bg-gray-50 max-w-[154px] max-h-[40px]"
                      style={{ borderColor: "#172554" }}
                      onClick={() => router.back()}
                    >
                      Voltar
                    </Button>

                    {/* Botão Avançar */}
                    <Button
                      type="button"
                      className="h-12 w-full px-8 text-base font-medium text-white hover:opacity-90 max-w-[154px] max-h-[40px]"
                      style={{ backgroundColor: "#172554" }}
                      disabled={isSubmitting}
                      onClick={(e) => {
                        e.preventDefault();
                        // Força a validação de todos os campos
                        form.trigger();
                        
                        if (!canSubmit) {
                          focusFirstError();
                        } else {
                          setCurrentStep('confirmation');
                        }
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Finalizando cadastro...
                        </>
                      ) : (
                        "Avançar"
                      )}
                    </Button>
                  </div>

                  {/* Removido o errorMessage - validações aparecem apenas nos campos individuais */}
                </div>
                    </>
                )}

                {currentStep === 'confirmation' && (
                  <>
                    {/* Título da confirmação */}
                    <div className="text-left mb-12">
                      <h1 className="mb-2" style={{
                        fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                        fontWeight: 600,
                        fontSize: '48px',
                        lineHeight: '100%',
                        letterSpacing: '-1%',
                        textAlign: 'left',
                        verticalAlign: 'middle',
                        color: 'black'
                      }}>
                        Cadastro
                      </h1>
                      <p style={{
                        fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                        fontWeight: 600,
                        fontSize: '20px',
                        lineHeight: '120%',
                        letterSpacing: '-2%',
                        textAlign: 'left',
                        verticalAlign: 'middle',
                        color: 'black'
                      }}>
                        Para finalizar seu cadastro, confira as informações com atenção
                      </p>
                    </div>
                    
                    {/* Conteúdo da confirmação */}
                    <div className="space-y-8">
                      {/* Informações Pessoais */}
                      <div>
                        <h3 className="text-black mb-4" style={{
                          fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                          fontWeight: 600,
                          fontSize: '30px',
                          lineHeight: '100%',
                          letterSpacing: '-1%',
                          verticalAlign: 'middle'
                        }}>
                          Informações pessoais
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">CPF:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('cpf')}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Identidade:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('documentoIdentidade')}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Nome:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('nome')}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Sexo:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('sexo')}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Data de Nascimento:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('dataNascimento')}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Escolaridade:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('escolaridade')}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Nome da Mãe:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('nomeMae')}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Nome do Pai:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('nomePai')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Endereço e Contato */}
                      <div>
                        <h3 className="text-black mb-4" style={{
                          fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                          fontWeight: 600,
                          fontSize: '30px',
                          lineHeight: '100%',
                          letterSpacing: '-1%',
                          verticalAlign: 'middle'
                        }}>
                          Endereço e contato
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">CEP:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('cep')}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Bairro:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('bairro')}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Logradouro:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('logradouro')}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Complemento:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('complemento') || 'Não informado'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Número:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('numero')}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="ml-2 text-gray-900">{form.getValues('email')}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Celular:</span>
                            <span className="ml-2 text-gray-900">({form.getValues('dddCelular')}) {form.getValues('celular')}</span>
                          </div>
                          {form.getValues('telefone') && (
                            <div>
                              <span className="font-medium text-gray-700">Telefone:</span>
                              <span className="ml-2 text-gray-900">({form.getValues('dddTelefone')}) {form.getValues('telefone')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Informação sobre a senha */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center text-blue-700">
                          <span className="mr-2">ⓘ</span>
                          <span className="text-sm">
                            Os dados só poderão ser alterados durante períodos de inscrição e novos dados não servem para inscrições anteriores. Deseja confirmar suas informações, declarando-as como verdadeiras?
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botões da confirmação */}
                    <div className="pt-6 border-t border-white">
                      <div className="flex justify-between items-center">
                        {/* Botão Voltar */}
                        <Button
                          type="button"
                          variant="outline"
                          className="h-12 w-full px-8 text-base font-medium text-gray-700 hover:text-gray-700 bg-white hover:bg-gray-50 max-w-[154px] max-h-[40px]"
                          style={{ borderColor: '#172554' }}
                          onClick={() => setCurrentStep('form')}
                        >
                          Voltar
                        </Button>

                        {/* Botão Finalizar */}
                        <Button
                          type="button"
                          className="h-12 w-full px-8 text-base font-medium text-white hover:opacity-90 max-w-[154px] max-h-[40px]"
                          style={{ backgroundColor: '#172554' }}
                          disabled={isSubmitting}
                          onClick={() => {
                            const formData = form.getValues();
                            onSubmit(formData);
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Finalizando...
                            </>
                          ) : (
                            'Finalizar'
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Modal de aviso para recarregamento da página */}
      <Dialog open={showReloadWarning} onOpenChange={setShowReloadWarning}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-amber-600 font-semibold">
              Aviso de Recarregamento
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              Você está prestes a recarregar a página. Todo o progresso do
              formulário será perdido.
              <br />
              <br />
              Deseja continuar? Você será redirecionado para a página inicial de
              cadastro.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={handleCancelReload}
              className="bg-white text-gray-700 hover:bg-gray-50"
              style={{ borderColor: "#172554" }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmReload}
              className="text-white hover:opacity-90"
              style={{ backgroundColor: "#dc2626" }}
            >
              Continuar e Perder Progresso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
