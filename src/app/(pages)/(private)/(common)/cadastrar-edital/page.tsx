"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cadastrarEditalSchema, CadastrarEditalSchema } from "@/core/schemas/cadastrar-edital.schema";
import { cadastrarEditalService } from "@/core/services/cadastrar-edital-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Componente para checkbox de tipo de prova
function TipoProvaCheckbox({ 
  tipo, 
  field 
}: { 
  tipo: { value: string; label: string }; 
  field: { value: string[]; onChange: (value: string[]) => void } 
}) {
  return (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value?.includes(tipo.value as "objetiva" | "discursiva" | "testes_fisicos" | "psicologicos" | "pericias" | "entrevistas")}
          onCheckedChange={(checked) => {
            if (checked) {
              field.onChange([...field.value, tipo.value]);
            } else {
              field.onChange(field.value?.filter((value: string) => value !== tipo.value));
            }
          }}
        />
      </FormControl>
      <FormLabel className="font-normal">
        {tipo.label}
      </FormLabel>
    </FormItem>
  );
}

// Componente do Stepper
function StepIndicator({ currentStep }: { currentStep: number }) {
  const getStepClasses = (current: number, step: number) => {
    if (current > step) return 'bg-green-500 border-green-500 text-white';
    if (current === step) return 'bg-blue-500 border-blue-500 text-white';
    return 'bg-gray-200 border-gray-300 text-gray-500';
  };

  const steps = [
    { number: 1, title: "Informações Básicas" },
    { number: 2, title: "Requisitos e Detalhes" },
    { number: 3, title: "Cronograma e Documentos" }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                getStepClasses(currentStep, step.number)
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-semibold">{step.number}</span>
                )}
              </div>
              <span className={`mt-2 text-xs text-center max-w-24 ${
                currentStep >= step.number ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CadastrarEditalPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função auxiliar para validar e converter data
  const handleDateChange = (dateString: string, onChange: (date: Date | undefined) => void) => {
    if (!dateString) {
      onChange(undefined);
      return;
    }
    
    try {
      const date = new Date(dateString);
      // Verificar se a data é válida
      if (!isNaN(date.getTime())) {
        onChange(date);
      } else {
        // Se a data não é válida, não fazer nada (manter o valor anterior)
        console.warn('Data inválida:', dateString);
      }
    } catch (error) {
      console.warn('Erro ao processar data:', error);
    }
  };
  
  const form = useForm({
    resolver: zodResolver(cadastrarEditalSchema),
    mode: "onChange" as const,
    reValidateMode: "onChange" as const,
    defaultValues: {
      titulo: "",
      descricao: "",
      tipoProva: [],
      cargos: [{ nomeCargo: "", numeroVagas: 1 }],
      taxaInscricao: 0,
      documentosExigidos: [""],
      cronograma: [{ data: new Date(), evento: "", observacoes: "" }],
      cotas: {
        pcd: 0,
        negros: 0,
        indigenas: 0,
        outras: ""
      }
    }
  } as const);

  const { fields: cargosFields, append: appendCargo, remove: removeCargo } = useFieldArray({
    control: form.control,
    name: "cargos"
  });

  const { fields: cronogramaFields, append: appendCronograma, remove: removeCronograma } = useFieldArray({
    control: form.control,
    name: "cronograma"
  });

  // Função para gerenciar documentos manualmente
  const documentosExigidos = form.watch("documentosExigidos") || [""];
  
  const addDocumento = () => {
    const current = form.getValues("documentosExigidos") || [""];
    form.setValue("documentosExigidos", [...current, ""]);
  };
  
  const removeDocumento = (index: number) => {
    const current = form.getValues("documentosExigidos") || [""];
    if (current.length > 1) {
      const newDocs = current.filter((_, i) => i !== index);
      form.setValue("documentosExigidos", newDocs);
    }
  };

  const onSubmit = async (data: CadastrarEditalSchema) => {
    console.log("🚀 onSubmit executado!");
    console.log("📋 Dados do formulário:", data);
    console.log("✅ Validação passou!");
    
    setIsSubmitting(true);
    
    try {
      toast.loading("Cadastrando edital...", { id: "cadastrar-edital" });
      
      const result = await cadastrarEditalService.cadastrar(data);
      
      if (result.success) {
        toast.success(result.message, { 
          id: "cadastrar-edital",
          description: "O edital foi cadastrado com sucesso e está disponível para consulta."
        });
        
        // Resetar o formulário
        form.reset();
        setCurrentStep(1);
        
        // Opcional: redirecionar para lista de editais
        // router.push('/concursos');
        
      } else {
        toast.error(result.message, { 
          id: "cadastrar-edital",
          description: "Verifique os dados e tente novamente."
        });
      }
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro inesperado ao cadastrar edital", { 
        id: "cadastrar-edital",
        description: "Tente novamente em alguns instantes."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para mostrar erros de validação
  const showValidationErrors = (errors: Record<string, { message?: string }>) => {
    const fieldNames: Record<string, string> = {
      dataInicioInscricoes: "Data de início",
      dataFimInscricoes: "Data de fim", 
      dataProva: "Data da prova",
      titulo: "Título",
      descricao: "Descrição",
      tipoProva: "Tipo de prova",
      cargos: "Cargos",
      escolaridadeMinima: "Escolaridade",
      documentosExigidos: "Documentos",
      cronograma: "Cronograma",
      arquivoEdital: "Arquivo"
    };
    
    const errorMessages = Object.entries(errors)
      .filter(([, error]) => error?.message)
      .map(([field, error]) => {
        const fieldName = fieldNames[field] || field;
        return `${fieldName}: ${error.message}`;
      });
    
    if (errorMessages.length > 0) {
      toast.error("Corrija os erros antes de continuar:", {
        description: errorMessages.join(" • ")
      });
    } else {
      toast.error("Há campos obrigatórios não preenchidos", {
        description: "Verifique todos os campos marcados com * e tente novamente."
      });
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof CadastrarEditalSchema)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["titulo", "descricao", "dataInicioInscricoes", "dataFimInscricoes", "dataProva"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["tipoProva", "cargos", "taxaInscricao", "escolaridadeMinima", "documentosExigidos"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["cronograma", "arquivoEdital"];
    }
    
    console.log("🔍 Validando campos:", fieldsToValidate);
    
    // Validar apenas os campos da etapa atual
    const isValid = await form.trigger(fieldsToValidate);
    
    if (currentStep === 1) {
      // Para a primeira etapa, validar também as regras de data manualmente
      const values = form.getValues();
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      let hasDateError = false;
      
      // Verificar se data de início é hoje ou futura
      if (values.dataInicioInscricoes) {
        const dataInicio = new Date(values.dataInicioInscricoes);
        dataInicio.setHours(0, 0, 0, 0);
        if (dataInicio < hoje) {
          form.setError("dataInicioInscricoes", {
            message: "Data de início das inscrições deve ser hoje ou futura"
          });
          hasDateError = true;
        }
      }
      
      // Verificar se data fim é posterior à data início
      if (values.dataInicioInscricoes && values.dataFimInscricoes) {
        if (values.dataFimInscricoes <= values.dataInicioInscricoes) {
          form.setError("dataFimInscricoes", {
            message: "Data de fim das inscrições deve ser posterior à data de início"
          });
          hasDateError = true;
        }
      }
      
      // Verificar se data da prova é posterior à data fim
      if (values.dataFimInscricoes && values.dataProva) {
        if (values.dataProva <= values.dataFimInscricoes) {
          form.setError("dataProva", {
            message: "Data da prova deve ser posterior ao fim das inscrições"
          });
          hasDateError = true;
        }
      }
      
      if (hasDateError) {
        const errors = form.formState.errors;
        showValidationErrors(errors);
        return;
      }
    }
    
    console.log("📋 Resultado da validação:", { isValid, errors: form.formState.errors });
    
    if (!isValid) {
      showValidationErrors(form.formState.errors);
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const tiposProva = [
    { value: "objetiva", label: "Objetiva" },
    { value: "discursiva", label: "Discursiva" },
    { value: "testes_fisicos", label: "Testes Físicos" },
    { value: "psicologicos", label: "Psicológicos" },
    { value: "pericias", label: "Perícias" },
    { value: "entrevistas", label: "Entrevistas" }
  ];

  const escolaridades = [
    { value: "fundamental_incompleto", label: "Fundamental Incompleto" },
    { value: "fundamental_completo", label: "Fundamental Completo" },
    { value: "medio_incompleto", label: "Médio Incompleto" },
    { value: "medio_completo", label: "Médio Completo" },
    { value: "superior_incompleto", label: "Superior Incompleto" },
    { value: "superior_completo", label: "Superior Completo" },
    { value: "pos_graduacao", label: "Pós-graduação" },
    { value: "mestrado", label: "Mestrado" },
    { value: "doutorado", label: "Doutorado" }
  ];

  return (
    <div className="flex flex-col items-center mt-20 mx-8 min-h-screen">
      <div className="w-full max-w-[843px]">
        <h1 className="text-3xl font-bold text-center mb-8">Cadastrar Novo Edital</h1>
        
        <StepIndicator currentStep={currentStep} />
        
        <Form {...form}>
          <form 
            onSubmit={(e) => {
              console.log("📝 Form submit iniciado!");
              console.log("🔍 Event:", e);
              form.handleSubmit(onSubmit, (errors) => {
                console.error("❌ Erros de validação:", errors);
                console.error("🔍 Detalhes dos erros:");
                Object.entries(errors).forEach(([field, error]) => {
                  console.error(`  - ${field}:`, error);
                });
                toast.error("Há campos obrigatórios não preenchidos", {
                  description: "Verifique todos os campos marcados com * e tente novamente."
                });
              })(e);
            }} 
            className="space-y-8"
          >
            
            {/* ETAPA 1 - Informações Básicas */}
            {currentStep === 1 && (
              <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
                <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
                  Etapa 1 - Informações Básicas
                </h2>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Título do Edital *</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o título do edital" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Descrição *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva detalhadamente o edital" 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataInicioInscricoes"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Data de Início das Inscrições *</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value ? field.value.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleDateChange(e.target.value, field.onChange)}
                          />
                        </FormControl>
                        <p className="text-xs text-gray-600">
                          Deve ser hoje ou uma data futura
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataFimInscricoes"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Data de Fim das Inscrições *</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value ? field.value.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleDateChange(e.target.value, field.onChange)}
                          />
                        </FormControl>
                        <p className="text-xs text-gray-600">
                          Deve ser posterior à data de início
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataProva"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Data da Prova/Avaliação *</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value ? field.value.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleDateChange(e.target.value, field.onChange)}
                          />
                        </FormControl>
                        <p className="text-xs text-gray-600">
                          Deve ser posterior ao fim das inscrições
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* ETAPA 2 - Requisitos e Detalhes */}
            {currentStep === 2 && (
              <div className="space-y-8">
                
                {/* Detalhes da Prova */}
                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
                  <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
                    Detalhes da Prova
                  </h2>
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    
                    <FormField
                      control={form.control}
                      name="tipoProva"
                      render={() => (
                        <FormItem className="col-span-2">
                          <FormLabel>Tipo de Prova * (selecione uma ou mais)</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            {tiposProva.map((tipo) => (
                              <FormField
                                key={tipo.value}
                                control={form.control}
                                name="tipoProva"
                                render={({ field }) => (
                                  <TipoProvaCheckbox key={tipo.value} tipo={tipo} field={field} />
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Seção de Cargos */}
                    <div className="col-span-2 space-y-4">
                      <FormLabel>Cargos e Vagas *</FormLabel>
                      {cargosFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                          <FormField
                            control={form.control}
                            name={`cargos.${index}.nomeCargo`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-7">
                                <FormLabel>Nome do Cargo</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Ex: Analista, Técnico, Professor..." 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`cargos.${index}.numeroVagas`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-3">
                                <FormLabel>Nº Vagas</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1"
                                    placeholder="1" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeCargo(index)}
                            disabled={cargosFields.length === 1}
                            className="md:col-span-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => appendCargo({ nomeCargo: "", numeroVagas: 1 })}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Cargo
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name="taxaInscricao"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Taxa de Inscrição (R$) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              min="0"
                              placeholder="0.00" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Requisitos para Candidatos */}
                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
                  <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
                    Requisitos para Candidatos
                  </h2>
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    
                    <FormField
                      control={form.control}
                      name="escolaridadeMinima"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Escolaridade Mínima *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a escolaridade mínima" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {escolaridades.map((escolaridade) => (
                                <SelectItem key={escolaridade.value} value={escolaridade.value}>
                                  {escolaridade.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="idadeMinima"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Idade Mínima</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="16" 
                              max="100"
                              placeholder="16" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="idadeMaxima"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Idade Máxima</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="16" 
                              max="100"
                              placeholder="100" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="outrosRequisitos"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Outros Requisitos</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva outros requisitos específicos para o cargo" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Cotas e Reservas de Vagas */}
                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
                  <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
                    Cotas e Reservas de Vagas
                  </h2>
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                    
                    <FormField
                      control={form.control}
                      name="cotas.pcd"
                      render={({ field }) => (
                        <FormItem className="col-span-3 md:col-span-1">
                          <FormLabel>Vagas PCD</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="0" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cotas.negros"
                      render={({ field }) => (
                        <FormItem className="col-span-3 md:col-span-1">
                          <FormLabel>Vagas para Negros</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="0" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cotas.indigenas"
                      render={({ field }) => (
                        <FormItem className="col-span-3 md:col-span-1">
                          <FormLabel>Vagas para Indígenas</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="0" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cotas.outras"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>Outras Cotas</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Descreva outras cotas específicas" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Documentos Exigidos */}
                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
                  <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
                    Documentos Exigidos
                  </h2>
                  <div className="space-y-4">
                    {documentosExigidos.map((doc, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <div key={index} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`documentosExigidos.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input 
                                  placeholder="Ex: CPF, RG, Comprovante de escolaridade..." 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeDocumento(index)}
                          disabled={documentosExigidos.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addDocumento}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Documento
                    </Button>
                  </div>
                </div>
                
              </div>
            )}

            {/* ETAPA 3 - Cronograma e Documentos */}
            {currentStep === 3 && (
              <div className="space-y-8">
                
                {/* Cronograma */}
                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
                  <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
                    Cronograma Detalhado
                  </h2>
                  <div className="space-y-4">
                    {cronogramaFields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                        <FormField
                          control={form.control}
                          name={`cronograma.${index}.data`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-3">
                              <FormLabel>Data</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                  onChange={(e) => handleDateChange(e.target.value, field.onChange)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`cronograma.${index}.evento`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-7">
                              <FormLabel>Evento</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: Resultado preliminar, Recursos, Prova..." 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCronograma(index)}
                          disabled={cronogramaFields.length === 1}
                          className="md:col-span-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendCronograma({ data: new Date(), evento: "", observacoes: "" })}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Item ao Cronograma
                    </Button>
                  </div>
                </div>

                {/* Upload do Edital */}
                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
                  <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
                    Upload do Edital
                  </h2>
                  <FormField
                    control={form.control}
                    name="arquivoEdital"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Arquivo do Edital (PDF) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="file" 
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onChange(file);
                            }}
                            {...field}
                            value=""
                          />
                        </FormControl>
                        <p className="text-sm text-gray-600 mt-1">
                          O arquivo PDF do edital completo é obrigatório para o cadastro.
                        </p>
                        {value && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ Arquivo selecionado: {value.name}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Resumo dos Documentos Exigidos */}
                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
                  <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-2 mb-6">
                    Resumo dos Documentos Exigidos
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Documentos que serão solicitados:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {form.watch("documentosExigidos")?.filter(doc => doc.trim() !== "").map((doc, index) => (
                        <li key={`doc-${index}-${doc}`} className="text-sm">{doc}</li>
                      ))}
                    </ul>
                    {form.watch("documentosExigidos")?.filter(doc => doc.trim() !== "").length === 0 && (
                      <p className="text-sm text-gray-500 italic">Nenhum documento especificado ainda</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Botões de Navegação */}
            <div className="w-full max-w-[843px] mt-6">
              <div className="flex gap-4 justify-between pt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Voltar
                </Button>
                
                <div className="flex gap-2">
                  {currentStep < 3 ? (
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="min-w-24"
                    >
                      Próximo
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto" 
                      disabled={isSubmitting}
                      onClick={() => {
                        console.log("🔘 Botão submit clicado!");
                        console.log("📝 Estado do formulário:", {
                          isValid: form.formState.isValid,
                          errors: form.formState.errors,
                          isSubmitting: form.formState.isSubmitting
                        });
                      }}
                    >
                      {isSubmitting ? "Cadastrando..." : "Cadastrar Edital"}
                    </Button>
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