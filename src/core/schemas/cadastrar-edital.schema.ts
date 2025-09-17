import z from "zod";

export const cadastrarEditalSchema = z.object({
 
  titulo: z.string().min(5, "Título deve ter pelo menos 5 caracteres").max(200, "Título deve ter no máximo 200 caracteres"),
  
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres").max(2000, "Descrição deve ter no máximo 2000 caracteres"),


  dataInicioInscricoes: z.date({
    message: "Data de início das inscrições é obrigatória"
  }),
  dataFimInscricoes: z.date({
    message: "Data de fim das inscrições é obrigatória"
  }),
  dataProva: z.date({
    message: "Data da prova é obrigatória"
  }),
  
 
  tipoProva: z.array(z.enum([
    "objetiva",
    "discursiva", 
    "testes_fisicos",
    "psicologicos",
    "pericias",
    "entrevistas"
  ])).min(1, "Selecione pelo menos um tipo de prova"),
  
  // Cargos
  cargos: z.array(z.object({
    nomeCargo: z.string().min(2, "Nome do cargo deve ter pelo menos 2 caracteres").max(100, "Nome do cargo deve ter no máximo 100 caracteres"),
    numeroVagas: z.number().min(1, "Número de vagas deve ser maior que zero").int("Número de vagas deve ser um número inteiro")
  })).min(1, "Adicione pelo menos um cargo"),
  
  
  escolaridadeMinima: z.enum([
    "fundamental_incompleto",
    "fundamental_completo",
    "medio_incompleto", 
    "medio_completo",
    "superior_incompleto",
    "superior_completo",
    "pos_graduacao",
    "mestrado",
    "doutorado"
  ]),
  
  idadeMinima: z.number()
    .min(16, "Idade mínima deve ser pelo menos 16 anos")
    .max(100, "Idade máxima deve ser no máximo 100 anos")
    .optional(),
    
  idadeMaxima: z.number()
    .min(16, "Idade máxima deve ser pelo menos 16 anos")
    .max(100, "Idade máxima deve ser no máximo 100 anos")
    .optional(),
  
  outrosRequisitos: z.string().max(1000, "Outros requisitos devem ter no máximo 1000 caracteres").optional(),
  
 
  cotas: z.object({
    pcd: z.number().min(0, "Vagas PCD deve ser 0 ou maior").optional(),
    negros: z.number().min(0, "Vagas para Negros deve ser 0 ou maior").optional(),
    indigenas: z.number().min(0, "Vagas para Indígenas deve ser 0 ou maior").optional(),
    outras: z.string().optional()
  }),
  
  
  taxaInscricao: z.number()
    .min(0, "Taxa de inscrição deve ser maior ou igual a zero")
    .optional()
    .or(z.literal(undefined)),
  
  documentosExigidos: z.array(z.string().min(2, "Nome do documento deve ter pelo menos 2 caracteres"))
    .min(1, "Selecione pelo menos um documento exigido"),
  
  cronograma: z.array(z.object({
    data: z.date(),
    evento: z.string().min(1, "Evento é obrigatório").max(200, "Evento deve ter no máximo 200 caracteres"),
    observacoes: z.string().optional()
  })).min(1, "Adicione pelo menos um evento no cronograma"),
  
  arquivoEdital: z.any().optional()
}).refine(
  (data) => data.dataFimInscricoes > data.dataInicioInscricoes,
  {
    message: "Data de fim das inscrições deve ser posterior à data de início",
    path: ["dataFimInscricoes"]
  }
).refine(
  (data) => data.dataProva > data.dataFimInscricoes,
  {
    message: "Data da prova deve ser posterior ao fim das inscrições",
    path: ["dataProva"]
  }
).refine(
  (data) => !data.idadeMinima || !data.idadeMaxima || data.idadeMaxima >= data.idadeMinima,
  {
    message: "Idade máxima deve ser maior ou igual à idade mínima",
    path: ["idadeMaxima"]
  }
).refine(
  (data) => {
    // Permitir datas de hoje para frente (mais flexível para testes)
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Resetar horário para comparação apenas de data
    const dataInicio = new Date(data.dataInicioInscricoes);
    dataInicio.setHours(0, 0, 0, 0);
    return dataInicio >= hoje;
  },
  {
    message: "Data de início das inscrições deve ser hoje ou futura",
    path: ["dataInicioInscricoes"]
  }
);

export type CadastrarEditalSchema = z.infer<typeof cadastrarEditalSchema>;