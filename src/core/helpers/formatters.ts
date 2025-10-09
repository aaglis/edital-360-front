export const formatPhone = (ddd: string, numero: string) => {
  if (numero.length === 9) {
    return `(${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`;
  }
  return `(${ddd}) ${numero.slice(0, 4)}-${numero.slice(4)}`;
};

export const formatCPF = (cpf: string) => {
  const cleanedCPF = cpf.replace(/\D/g, "");

  return cleanedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
};

export const getInitials = (name: string) => {
  const names = name.split(" ");
  return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
};