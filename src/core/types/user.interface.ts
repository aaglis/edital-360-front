export const escolaridadeMap = {
    FUNDAMENTAL_INCOMPLETO: "Fundamental Incompleto",
    FUNDAMENTAL_COMPLETO: "Fundamental Completo",
    MEDIO_INCOMPLETO: "Médio Incompleto",
    MEDIO_COMPLETO: "Médio Completo",
    SUPERIOR_INCOMPLETO: "Superior Incompleto",
    SUPERIOR_COMPLETO: "Superior Completo",
    POS_GRADUACAO: "Pós-Graduação",
    MESTRADO: "Mestrado",
    DOUTORADO: "Doutorado",
} as const;

export type Escolaridade = keyof typeof escolaridadeMap;
  

export interface UserData {
    id: string;
    cpf: string;
    nomeCompleto: string;
    dataNascimento: string;
    sex: "MASCULINO" | "FEMININO" | "OUTRO";
    email: string;
    nomeMae: string;
    nomePai: string;
    escolaridade: Escolaridade;
    documentoIdentidade: string;
    ufIdentidade: string;
    cep: string;
    uf: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    numeroCasa: string;
    complemento: string;
    telefoneDdd: string;
    telefoneNumero: string;
    celularDdd: string;
    celularNumero: string;
};