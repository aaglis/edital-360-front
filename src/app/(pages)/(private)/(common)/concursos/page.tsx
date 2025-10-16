"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Filter, Calendar, Users, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { editaisService, Edital, StatusNotice } from '@/core/services/editaisService';
import { toast } from 'sonner';

const statusOptions: { value: StatusNotice; label: string; color: string }[] = [
  { value: 'PUBLICADO', label: 'Publicado', color: 'bg-blue-100 text-blue-800' },
  { value: 'PEDIDO_ISENCAO', label: 'Pedido Isenção', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'EM_ANALISE', label: 'Em Análise', color: 'bg-orange-100 text-orange-800' },
  { value: 'INSCRICOES_ABERTAS', label: 'Inscrições Abertas', color: 'bg-green-100 text-green-800' },
  { value: 'INSCRICOES_ENCERRADAS', label: 'Inscrições Encerradas', color: 'bg-red-100 text-red-800' },
  { value: 'RESULTADO_PRELIMINAR', label: 'Resultado Preliminar', color: 'bg-purple-100 text-purple-800' },
  { value: 'RESULTADO_FINAL', label: 'Resultado Final', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'ENCERRADO', label: 'Encerrado', color: 'bg-gray-100 text-gray-800' },
  { value: 'CANCELADO', label: 'Cancelado', color: 'bg-red-200 text-red-900' },
];

export default function ConcursoDisponiveisPage() {
  const router = useRouter();
  const [editais, setEditais] = useState<Edital[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<StatusNotice>('INSCRICOES_ABERTAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(12);

  const fetchEditais = useCallback(async (page: number = 0, status: StatusNotice = selectedStatus) => {
    try {
      setLoading(true);
      
      const response = await editaisService.obterEditais({
        statusNotice: status,
        page,
        size: pageSize,
        sort: 'initialDate,desc'
      });

      if (response.success && response.data) {
        setEditais(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setCurrentPage(response.data.number);
      } else {
        toast.error(response.message || 'Erro ao carregar editais');
        setEditais([]);
      }
    } catch (error) {
      toast.error('Erro ao carregar editais');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, pageSize]);

  useEffect(() => {
    fetchEditais(0, selectedStatus);
  }, [selectedStatus, pageSize, fetchEditais]);

  const handleStatusChange = (status: StatusNotice) => {
    setSelectedStatus(status);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchEditais(page, selectedStatus);
  };

  const filteredEditais = editais.filter(edital =>
    edital.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edital.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusInfo = (status: StatusNotice) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Concursos Públicos</h1>
        <p className="text-gray-600">Explore todos os editais disponíveis e acompanhe o status de cada processo seletivo</p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar editais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status */}
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Status do edital" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Itens por página */}
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 por página</SelectItem>
                <SelectItem value="12">12 por página</SelectItem>
                <SelectItem value="24">24 por página</SelectItem>
                <SelectItem value="48">48 por página</SelectItem>
              </SelectContent>
            </Select>

            {/* Info de resultados */}
            <div className="flex items-center text-sm text-gray-600">
              {totalElements} editais encontrados
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando editais...</p>
          </div>
        </div>
      )}

      {/* Lista de Editais */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredEditais.map((edital) => {
              const statusInfo = getStatusInfo(edital.statusNotice);
              
              return (
                <Card key={edital.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                        {edital.title}
                      </CardTitle>
                      <Badge className={`${statusInfo.color} shrink-0 text-xs`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {edital.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Informações principais */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{edital.vacancies} vagas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{formatCurrency(edital.subscription)}</span>
                        </div>
                      </div>

                      {/* Datas */}
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Inscrições: {formatDate(edital.initialDate)} - {formatDate(edital.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Prova: {formatDate(edital.examDate)}</span>
                        </div>
                      </div>

                      {/* Remuneração (se houver) */}
                      {edital.remuneration > 0 && (
                        <div className="bg-green-50 px-2 py-1 rounded text-xs text-green-800">
                          💰 Remuneração: {formatCurrency(edital.remuneration)}
                        </div>
                      )}

                      {/* Botões de ação */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => router.push(`/edital/${edital.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                        {edital.pdfUrl && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(edital.pdfUrl, '_blank')}
                          >
                            📄 PDF
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredEditais.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum edital encontrado</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? `Não encontramos editais que correspondam à busca "${searchTerm}"`
                  : `Não há editais com status "${getStatusInfo(selectedStatus).label}" no momento`
                }
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Limpar busca
                </Button>
              )}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                      className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const page = index;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
