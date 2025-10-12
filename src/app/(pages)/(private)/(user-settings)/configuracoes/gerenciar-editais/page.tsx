"use client"

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, Filter } from "lucide-react";
import Link from "next/link";
import { EditalService } from "@/core/services/editalService";
import type { EditalData } from "@/core/types/editais.interface";

const STATUS_COLORS: Record<string, string> = {
  INSCRITO: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  CLASSIFICADO: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  APROVADO: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  ELIMINADO: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  ABERTO: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  FECHADO: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  EM_ANDAMENTO: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

export default function GerenciarEditais() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<EditalData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchEditais = async () => {
    setLoading(true);
    try {
      const response = await EditalService.fetchAll({
        statusNotice: statusFilter === 'All' ? undefined : statusFilter,
        search: searchTerm || undefined,
        page: currentPage - 1,
        size: pageSize,
        sort: sortOrder,
      });
  
      if (response && response.content) {
        setRows(response.content);
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.totalElements || 0);
      } else {
        setRows([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Erro ao buscar editais:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchEditais();
    }, 500); // espera 500ms após o último caractere
  
    return () => clearTimeout(delay);
  }, [statusFilter, currentPage, pageSize, sortOrder, searchTerm]);

  const filteredRows = rows.filter(row =>
    row.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              href="#" 
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            href="#" 
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              href="#" 
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            href="#" 
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Editais</h1>
        <p className="text-muted-foreground mt-2">
          Crie, altere ou exclua os editais do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-lg">Lista de Editais</CardTitle>
              <Link href="/cadastrar-edital">
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Edital
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-10"
                  placeholder="Buscar por nome do edital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Todos</SelectItem>
                    <SelectItem value="PUBLICADO">Publicado</SelectItem>
                    <SelectItem value="EM_ANALISE">Em análise</SelectItem>
                    <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
                    <SelectItem value="INSCRICOES_ABERTAS">Inscrições abertas</SelectItem>
                    <SelectItem value="INSCRICOES_ENCERRADAS">Inscrições encerradas</SelectItem>
                    <SelectItem value="PEDIDO_ISENCAO">Pedido de isenção</SelectItem>
                    <SelectItem value="RESULTADO_PRELIMINAR">Resultado preliminar</SelectItem>
                    <SelectItem value="RESULTADO_FINAL">Resultado final</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                    <SelectItem value="ENCERRADO">Encerrado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={pageSize.toString()} onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Itens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 itens</SelectItem>
                    <SelectItem value="10">10 itens</SelectItem>
                    <SelectItem value="20">20 itens</SelectItem>
                    <SelectItem value="50">50 itens</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Mais antigos</SelectItem>
                    <SelectItem value="desc">Mais recentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhum edital encontrado com esse termo." : "Nenhum edital cadastrado ainda."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-sm">Nome</th>
                        <th className="text-left p-4 font-medium text-sm w-[200px]">Data de Criação</th>
                        <th className="text-left p-4 font-medium text-sm w-[200px]">Data de Encerramento</th>
                        <th className="text-center p-4 font-medium text-sm w-[200px]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                        {filteredRows.map((edital) => (
                        <tr key={edital.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4 max-w-[400px] truncate">{edital.title}</td>
                          <td className="p-4 text-muted-foreground">
                            {edital.createdAt ? new Date(edital.createdAt).toLocaleDateString('pt-BR') : '-'}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {edital.endDate ? new Date(edital.endDate).toLocaleDateString('pt-BR') : '-'}
                          </td>
                          <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_COLORS[edital.statusNotice as keyof typeof STATUS_COLORS] || STATUS_COLORS.INSCRITO
                            }`}
                          >
                            {edital.statusNotice || 'N/A'}
                          </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando <span className="font-medium">{filteredRows.length}</span> de{" "}
                  <span className="font-medium">{totalItems}</span> editais
                </p>
                
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                          aria-disabled={currentPage === 1}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        >
                          Anterior
                        </PaginationPrevious>
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                          aria-disabled={currentPage === totalPages}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        >
                          Próxima
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}