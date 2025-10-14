'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { editalDetalhesService, EditalDetalhes } from '@/core/services/editalDetalhesService';
import { pedidoIsencaoService } from '@/core/services/pedidoIsencaoService';

export default function EditalDetalhesPage() {
  const params = useParams();
  const id = params?.id as string;
  const [edital, setEdital] = useState<EditalDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para o pedido de isenção
  const [isIsencaoDialogOpen, setIsIsencaoDialogOpen] = useState(false);
  const [arquivosIsencao, setArquivosIsencao] = useState<File[]>([]);
  const [isSubmittingIsencao, setIsSubmittingIsencao] = useState(false);

  // Função para lidar com a seleção de arquivos
  const handleArquivosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setArquivosIsencao(files);
  };

  // Função para enviar pedido de isenção
  const handleSubmitIsencao = async () => {
    if (arquivosIsencao.length === 0) {
      toast.error('Selecione pelo menos um arquivo');
      return;
    }

    try {
      setIsSubmittingIsencao(true);
      
      const response = await pedidoIsencaoService.solicitar(id, arquivosIsencao);

      if (response.success) {
        toast.success(response.message || 'Pedido de isenção enviado com sucesso!');
        setIsIsencaoDialogOpen(false);
        setArquivosIsencao([]);
      } else {
        toast.error(response.message || 'Erro ao enviar pedido de isenção');
      }
    } catch (error) {
      toast.error('Erro ao enviar pedido de isenção');
      console.error('Erro:', error);
    } finally {
      setIsSubmittingIsencao(false);
    }
  };

  useEffect(() => {
    const fetchEditalDetalhes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await editalDetalhesService.buscarPorId(id);
        
        if (response.success && response.data) {
          setEdital(response.data);
        } else {
          setError(response.message || 'Erro ao carregar detalhes do edital');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEditalDetalhes();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando detalhes do edital...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Erro ao carregar edital</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.history.back()}>
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!edital) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Edital não encontrado</h2>
            <p className="text-gray-600 mb-4">O edital solicitado não foi encontrado.</p>
            <Button onClick={() => window.history.back()}>
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="mb-4"
        >
          ← Voltar
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{edital.title}</h1>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">ID: {edital.id}</Badge>
              <Badge variant="secondary">
                Taxa: {formatCurrency(edital.subscription)}
              </Badge>
              {edital.remuneration > 0 && (
                <Badge variant="default">
                  Remuneração: {formatCurrency(edital.remuneration)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Descrição */}
        <Card>
          <CardHeader>
            <CardTitle>Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{edital.description}</p>
          </CardContent>
        </Card>

        {/* Datas Importantes */}
        <Card>
          <CardHeader>
            <CardTitle>Datas Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">Início das Inscrições</h4>
                <p className="text-blue-600">{formatDate(edital.initialDate)}</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800">Fim das Inscrições</h4>
                <p className="text-orange-600">{formatDate(edital.endDate)}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Data da Prova</h4>
                <p className="text-green-600">{formatDate(edital.examDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cargos e Vagas */}
        <Card>
          <CardHeader>
            <CardTitle>Cargos e Vagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {edital.roles.map((role, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{role.role}</span>
                  <Badge variant="outline">{role.vacancies} vagas</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Requisitos */}
        <Card>
          <CardHeader>
            <CardTitle>Requisitos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Escolaridade:</span>
                <span>{edital.requirements.requirementType.replace(/_/g, ' ')}</span>
              </div>
              {edital.requirements.minimumAge && (
                <div className="flex justify-between">
                  <span className="font-medium">Idade mínima:</span>
                  <span>{edital.requirements.minimumAge} anos</span>
                </div>
              )}
              {edital.requirements.maximumAge && (
                <div className="flex justify-between">
                  <span className="font-medium">Idade máxima:</span>
                  <span>{edital.requirements.maximumAge} anos</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fases do Concurso */}
        <Card>
          <CardHeader>
            <CardTitle>Fases do Concurso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {edital.phases.map((phase, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {phase.order + 1}
                  </div>
                  <span>{phase.exam.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documentos Exigidos */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos Exigidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {edital.documents.map((document, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{document}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Cotas (se existir) */}
        {edital.quotas && (
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Cotas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {edital.quotas.vagasPcd > 0 && (
                  <div className="flex justify-between">
                    <span>Pessoas com Deficiência:</span>
                    <span className="font-medium">{edital.quotas.vagasPcd} vagas</span>
                  </div>
                )}
                {edital.quotas.vagasNegros > 0 && (
                  <div className="flex justify-between">
                    <span>Pessoas Negras:</span>
                    <span className="font-medium">{edital.quotas.vagasNegros} vagas</span>
                  </div>
                )}
                {edital.quotas.vagasIndigenas > 0 && (
                  <div className="flex justify-between">
                    <span>Pessoas Indígenas:</span>
                    <span className="font-medium">{edital.quotas.vagasIndigenas} vagas</span>
                  </div>
                )}
                {edital.quotas.outrasCotas && (
                  <div className="flex justify-between col-span-full">
                    <span>Outras Cotas:</span>
                    <span className="font-medium">{edital.quotas.outrasCotas}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cronograma (se existir) */}
        {edital.schedule && edital.schedule.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Cronograma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {edital.schedule.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <span>{item.description}</span>
                    <span className="text-sm text-gray-600">{formatDate(item.date)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="px-8">
                📝 Fazer Inscrição
              </Button>
              
              <Dialog open={isIsencaoDialogOpen} onOpenChange={setIsIsencaoDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="lg" className="px-8">
                    💰 Solicitar Isenção
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Solicitar Isenção de Taxa</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="arquivos">Documentos Comprobatórios *</Label>
                      <Input
                        id="arquivos"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleArquivosChange}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Selecione os documentos que comprovem a necessidade de isenção
                      </p>
                    </div>
                    
                    {arquivosIsencao.length > 0 && (
                      <div>
                        <Label>Arquivos selecionados:</Label>
                        <ul className="text-sm text-gray-600 mt-1">
                          {arquivosIsencao.map((arquivo, index) => (
                            <li key={index} className="flex items-center gap-2">
                              📎 {arquivo.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setIsIsencaoDialogOpen(false)}
                        disabled={isSubmittingIsencao}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSubmitIsencao}
                        disabled={isSubmittingIsencao || arquivosIsencao.length === 0}
                      >
                        {isSubmittingIsencao ? 'Enviando...' : 'Enviar Solicitação'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="lg" className="px-8">
                📄 Baixar Edital Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}