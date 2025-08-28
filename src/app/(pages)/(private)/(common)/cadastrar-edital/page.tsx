"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cadastrarEditalSchema, CadastrarEditalSchema } from "@/core/schemas/cadastrar-edital.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";

// Componente do Stepper
function StepIndicator({ currentStep }: { currentStep: number }) {
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
                currentStep > step.number
                  ? 'bg-green-500 border-green-500 text-white'
                  : currentStep === step.number
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-gray-200 border-gray-300 text-gray-500'
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
  
  const form = useForm<CadastrarEditalSchema>({
    resolver: zodResolver(cadastrarEditalSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      titulo: "",
      descricao: "",
      tipoProva: [],
      numeroVagas: 1,
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
  });

  const { fields: documentosFields, append: appendDocumento, remove: removeDocumento } = useFieldArray({
    control: form.control,
    name: "documentosExigidos"
  });

  const { fields: cronogramaFields, append: appendCronograma, remove: removeCronograma } = useFieldArray({
    control: form.control,
    name: "cronograma"
  });

  const onSubmit = (data: CadastrarEditalSchema) => {
    console.log(data);
    // Aqui você implementa o envio dos dados
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof CadastrarEditalSchema)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["titulo", "descricao", "dataInicioInscricoes", "dataFimInscricoes", "dataProva"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["tipoProva", "numeroVagas", "taxaInscricao", "escolaridadeMinima", "documentosExigidos"];
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid && currentStep < 3) {
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
    <div className="flex flex-col items-center justify-center mt-20 mx-8 min-h-screen">
      <div className="w-full max-w-[1200px] bg-white shadow-md rounded-lg p-8 border border-gray-300">
        <h1 className="text-3xl font-bold text-center mb-8">Cadastrar Novo Edital</h1>
        
        <StepIndicator currentStep={currentStep} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* ETAPA 1 - Informações Básicas */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Etapa 1 - Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
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
                      <FormItem>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="dataInicioInscricoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Início das Inscrições *</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              value={field.value ? field.value.toISOString().split('T')[0] : ''}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dataFimInscricoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Fim das Inscrições *</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              value={field.value ? field.value.toISOString().split('T')[0] : ''}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dataProva"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Prova/Avaliação *</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              value={field.value ? field.value.toISOString().split('T')[0] : ''}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ETAPA 2 - Requisitos e Detalhes */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Etapa 2 - Requisitos e Detalhes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Tipo de Prova */}
                  <FormField
                    control={form.control}
                    name="tipoProva"
                    render={() => (
                      <FormItem>
                        <FormLabel>Tipo de Prova * (selecione uma ou mais)</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {tiposProva.map((tipo) => (
                            <FormField
                              key={tipo.value}
                              control={form.control}
                              name="tipoProva"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={tipo.value}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(tipo.value as "objetiva" | "discursiva" | "testes_fisicos" | "psicologicos" | "pericias" | "entrevistas")}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, tipo.value])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== tipo.value
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {tipo.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="numeroVagas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Vagas *</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="taxaInscricao"
                      render={({ field }) => (
                        <FormItem>
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

                  {/* Requisitos para Candidatos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Requisitos para Candidatos</h3>
                    
                    <FormField
                      control={form.control}
                      name="escolaridadeMinima"
                      render={({ field }) => (
                        <FormItem>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="idadeMinima"
                        render={({ field }) => (
                          <FormItem>
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
                          <FormItem>
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
                    </div>

                    <FormField
                      control={form.control}
                      name="outrosRequisitos"
                      render={({ field }) => (
                        <FormItem>
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

                  {/* Cotas e Reservas de Vagas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Cotas e Reservas de Vagas</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="cotas.pcd"
                        render={({ field }) => (
                          <FormItem>
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
                          <FormItem>
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
                          <FormItem>
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
                    </div>

                    <FormField
                      control={form.control}
                      name="cotas.outras"
                      render={({ field }) => (
                        <FormItem>
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

                  {/* Documentos Exigidos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Documentos Exigidos</h3>
                    
                    {documentosFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
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
                          disabled={documentosFields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendDocumento("")}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Documento
                    </Button>
                  </div>
                  
                </CardContent>
              </Card>
            )}

            {/* ETAPA 3 - Cronograma e Documentos */}
            {currentStep === 3 && (
              <div className="space-y-8">
                {/* Cronograma */}
                <Card>
                  <CardHeader>
                    <CardTitle>Etapa 3 - Cronograma Detalhado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                                  onChange={(e) => field.onChange(new Date(e.target.value))}
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
                  </CardContent>
                </Card>

                {/* Upload do Edital */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upload do Edital</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="arquivoEdital"
                      render={({ field: { onChange, ...field } }) => (
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
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Resumo dos Documentos Exigidos */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo dos Documentos Exigidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Documentos que serão solicitados:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {form.watch("documentosExigidos")?.filter(doc => doc.trim() !== "").map((doc, index) => (
                          <li key={index} className="text-sm">{doc}</li>
                        ))}
                      </ul>
                      {form.watch("documentosExigidos")?.filter(doc => doc.trim() !== "").length === 0 && (
                        <p className="text-sm text-gray-500 italic">Nenhum documento especificado ainda</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Botões de Navegação */}
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
                  <Button type="button" onClick={nextStep}>
                    Próximo
                  </Button>
                ) : (
                  <Button type="submit">
                    Cadastrar Edital
                  </Button>
                )}
              </div>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}