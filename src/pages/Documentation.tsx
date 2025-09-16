import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Clock, 
  CalendarClock, 
  Building2, 
  ShoppingCart, 
  Wrench, 
  Package, 
  CheckCircle2, 
  Hammer, 
  FilePenLine,
  Search,
  Filter,
  Edit,
  Trash,
  Eye,
  FileText,
  Share,
  Download
} from "lucide-react";

const Documentation = () => {
  const statusOptions = [
    { value: "ADE", label: "ADE - Aguardando Disponibilidade", color: "text-blue-900", bgColor: "bg-blue-100", icon: Clock },
    { value: "AVT", label: "AVT - Aguardando vinda técnica", color: "text-orange-600", bgColor: "bg-orange-100", icon: CalendarClock },
    { value: "EXT", label: "EXT - Serviço Externo", color: "text-purple-600", bgColor: "bg-purple-100", icon: Building2 },
    { value: "A.M", label: "A.M - Aquisição de Material", color: "text-red-600", bgColor: "bg-red-100", icon: ShoppingCart },
    { value: "INST", label: "INST - Instalação", color: "text-pink-600", bgColor: "bg-pink-100", icon: Wrench },
    { value: "M.S", label: "M.S - Material Solicitado", color: "text-cyan-600", bgColor: "bg-cyan-100", icon: Package },
    { value: "OSP", label: "OSP - Ordem de Serviço Pronta", color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle2 },
    { value: "E.E", label: "E.E - Em Execução", color: "text-orange-600", bgColor: "bg-orange-100", icon: Hammer },
    { value: "ADPD", label: "ADPD - Aguardando Decisão de Proposta de Desativação", color: "text-purple-600", bgColor: "bg-purple-100", icon: FilePenLine }
  ];

  const crudOperations = [
    {
      operation: "Create (Criar)",
      icon: Plus,
      description: "Adicionar nova Ordem de Serviço",
      steps: [
        "Clique no botão 'Adicionar OS' na interface principal",
        "Preencha os campos obrigatórios: Número OS, Patrimônio, Equipamento e Status",
        "Defina a prioridade (Normal, Alta, Baixa)",
        "Adicione observações se necessário",
        "Clique em 'Adicionar OS' para salvar"
      ],
      color: "border-green-200 bg-green-50"
    },
    {
      operation: "Read (Visualizar)",
      icon: Eye,
      description: "Consultar e filtrar Ordens de Serviço",
      steps: [
        "Visualize todas as OS na tabela principal",
        "Use a barra de pesquisa para buscar por número, patrimônio ou equipamento",
        "Filtre por status específico usando o dropdown",
        "Use filtros avançados para critérios específicos",
        "Visualize detalhes completos clicando na OS"
      ],
      color: "border-blue-200 bg-blue-50"
    },
    {
      operation: "Update (Editar)",
      icon: Edit,
      description: "Modificar dados de Ordens de Serviço existentes",
      steps: [
        "Clique no ícone de edição (lápis) na linha da OS",
        "Modifique os campos desejados no modal de edição",
        "Altere status, prioridade ou observações conforme necessário",
        "Clique em 'Salvar Alterações' para confirmar",
        "As mudanças são registradas no histórico automaticamente"
      ],
      color: "border-orange-200 bg-orange-50"
    },
    {
      operation: "Delete (Excluir)",
      icon: Trash,
      description: "Remover Ordens de Serviço (exclusão suave)",
      steps: [
        "Clique no ícone de lixeira na linha da OS",
        "Confirme a exclusão no diálogo de confirmação",
        "A OS é movida para a lixeira (não excluída permanentemente)",
        "Acesse 'Configurações > Lixeira' para restaurar se necessário",
        "Exclusão permanente disponível apenas na lixeira"
      ],
      color: "border-red-200 bg-red-50"
    }
  ];

  const features = [
    {
      title: "Sistema de Busca Avançado",
      icon: Search,
      description: "Pesquise por número OS, patrimônio, equipamento ou observações com filtros inteligentes."
    },
    {
      title: "Filtros por Status",
      icon: Filter,
      description: "Filtre rapidamente as OS por status específico para visualização organizada."
    },
    {
      title: "Geração de Relatórios",
      icon: FileText,
      description: "Exporte relatórios em PDF e Excel com dados filtrados e formatados."
    },
    {
      title: "Compartilhamento",
      icon: Share,
      description: "Compartilhe OS específicas com outros usuários do sistema de forma segura."
    }
  ];

  const downloadDocumentation = () => {
    const content = `
SISTEMA DE ORDENS DE SERVIÇO (OS)
Documentação Completa do Sistema

===========================================
VISÃO GERAL
===========================================

O Sistema de Ordens de Serviço (OS) é uma aplicação completa para gerenciamento 
eficiente de ordens de serviço, controle de status e acompanhamento de atividades.

===========================================
SISTEMA DE STATUS
===========================================

O sistema utiliza 9 status diferentes para acompanhar o ciclo de vida das ordens de serviço:

1. ADE - Aguardando Disponibilidade
   - Cor: Azul escuro
   - Ícone: Relógio
   - Significado: OS criada, aguardando recursos ou disponibilidade

2. AVT - Aguardando Vinda Técnica
   - Cor: Laranja
   - Ícone: Calendário com relógio
   - Significado: Aguardando agendamento ou chegada do técnico

3. EXT - Serviço Externo
   - Cor: Roxo
   - Ícone: Prédio
   - Significado: Serviço será executado por empresa externa

4. A.M - Aquisição de Material
   - Cor: Vermelho
   - Ícone: Carrinho de compras
   - Significado: Aguardando compra/aquisição de materiais necessários

5. INST - Instalação
   - Cor: Rosa
   - Ícone: Chave inglesa
   - Significado: Em processo de instalação

6. M.S - Material Solicitado
   - Cor: Ciano
   - Ícone: Pacote
   - Significado: Material foi solicitado, aguardando entrega

7. OSP - Ordem de Serviço Pronta
   - Cor: Verde
   - Ícone: Círculo com check
   - Significado: Serviço concluído com sucesso

8. E.E - Em Execução
   - Cor: Laranja
   - Ícone: Martelo
   - Significado: Serviço sendo executado atualmente

9. ADPD - Aguardando Decisão de Proposta de Desativação
   - Cor: Magenta
   - Ícone: Arquivo com caneta
   - Significado: Aguardando decisão sobre desativação do equipamento

===========================================
OPERAÇÕES CRUD
===========================================

CREATE (CRIAR) - Adicionar nova Ordem de Serviço
--------------------------------------------------
Passos:
1. Clique no botão 'Adicionar OS' na interface principal
2. Preencha os campos obrigatórios: Número OS, Patrimônio, Equipamento e Status
3. Defina a prioridade (Normal, Alta, Baixa)
4. Adicione observações se necessário
5. Clique em 'Adicionar OS' para salvar

READ (VISUALIZAR) - Consultar e filtrar Ordens de Serviço
----------------------------------------------------------
Passos:
1. Visualize todas as OS na tabela principal
2. Use a barra de pesquisa para buscar por número, patrimônio ou equipamento
3. Filtre por status específico usando o dropdown
4. Use filtros avançados para critérios específicos
5. Visualize detalhes completos clicando na OS

UPDATE (EDITAR) - Modificar dados de Ordens de Serviço existentes
-----------------------------------------------------------------
Passos:
1. Clique no ícone de edição (lápis) na linha da OS
2. Modifique os campos desejados no modal de edição
3. Altere status, prioridade ou observações conforme necessário
4. Clique em 'Salvar Alterações' para confirmar
5. As mudanças são registradas no histórico automaticamente

DELETE (EXCLUIR) - Remover Ordens de Serviço (exclusão suave)
-------------------------------------------------------------
Passos:
1. Clique no ícone de lixeira na linha da OS
2. Confirme a exclusão no diálogo de confirmação
3. A OS é movida para a lixeira (não excluída permanentemente)
4. Acesse 'Configurações > Lixeira' para restaurar se necessário
5. Exclusão permanente disponível apenas na lixeira

===========================================
FUNCIONALIDADES DO SISTEMA
===========================================

1. Sistema de Busca Avançado
   - Pesquise por número OS, patrimônio, equipamento ou observações
   - Filtros inteligentes para localização rápida

2. Filtros por Status
   - Filtre rapidamente as OS por status específico
   - Visualização organizada por categoria

3. Geração de Relatórios
   - Exporte relatórios em PDF e Excel
   - Dados filtrados e formatados profissionalmente

4. Compartilhamento
   - Compartilhe OS específicas com outros usuários
   - Sistema seguro de permissões

===========================================
COMO USAR O SISTEMA
===========================================

1. Acessando o Sistema
-------------------
Faça login com suas credenciais para acessar o dashboard principal onde você 
encontrará a interface de gerenciamento de ordens de serviço.

2. Navegação Principal
--------------------
• Dashboard: Visão geral das OS e estatísticas
• Ordens de Serviço: Gerenciamento completo das OS
• Estatísticas: Relatórios e gráficos detalhados
• Configurações: Preferências e gerenciamento do sistema

3. Fluxo de Trabalho Recomendado
-------------------------------
1. Criar nova OS com informações básicas
2. Definir status inicial baseado na situação atual
3. Acompanhar progresso através das mudanças de status
4. Utilizar observações para registrar detalhes importantes
5. Finalizar OS quando o serviço estiver concluído (OSP)

4. Boas Práticas
---------------
• Sempre preencha observações detalhadas
• Mantenha os status atualizados conforme o progresso
• Use prioridades para organizar o trabalho
• Revise regularmente as OS em aberto
• Utilize os relatórios para análise de desempenho

===========================================
ESTRUTURA DO SISTEMA
===========================================

Campos Obrigatórios:
- Número OS: Identificador único
- Patrimônio: Código do equipamento
- Equipamento: Descrição do item
- Status: Estado atual da OS

Campos Opcionais:
- Prioridade: Normal, Alta ou Baixa
- Observações: Detalhes adicionais
- Data de Criação: Preenchida automaticamente
- Usuário: Responsável pela OS

===========================================
SUPORTE E AJUDA
===========================================

Para suporte técnico ou dúvidas sobre o sistema, consulte:
- Documentação online no sistema
- Manual do usuário disponível no menu Ajuda
- Contato com administrador do sistema

Este documento foi gerado automaticamente pelo Sistema de OS
Data de geração: ${new Date().toLocaleDateString('pt-BR')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Documentacao_Sistema_OS_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Sistema de Ordens de Serviço (OS)
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Documentação completa do sistema para gerenciamento eficiente de ordens de serviço, 
          controle de status e acompanhamento de atividades.
        </p>
      </div>

      {/* Status System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="w-fit">
              Status
            </Badge>
            Sistema de Status das Ordens de Serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            O sistema utiliza 9 status diferentes para acompanhar o ciclo de vida das ordens de serviço:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statusOptions.map((status) => {
              const IconComponent = status.icon;
              return (
                <div key={status.value} className={`p-4 rounded-lg border-2 ${status.bgColor}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className={`h-5 w-5 ${status.color}`} />
                    <Badge variant="secondary" className="font-mono">
                      {status.value}
                    </Badge>
                  </div>
                  <p className={`font-medium ${status.color}`}>
                    {status.label}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* CRUD Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="w-fit">
              CRUD
            </Badge>
            Operações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            O sistema oferece operações completas de CRUD (Create, Read, Update, Delete) para gerenciamento das ordens de serviço:
          </p>
          <div className="space-y-6">
            {crudOperations.map((operation, index) => {
              const IconComponent = operation.icon;
              return (
                <div key={index} className={`p-6 rounded-lg border-2 ${operation.color}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent className="h-6 w-6" />
                    <h3 className="text-xl font-semibold">{operation.operation}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{operation.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Passos:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      {operation.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-muted-foreground">{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="w-fit">
              Recursos
            </Badge>
            Funcionalidades do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="w-fit">
              Tutorial
            </Badge>
            Como Usar o Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">1. Acessando o Sistema</h3>
            <p className="text-muted-foreground">
              Faça login com suas credenciais para acessar o dashboard principal onde você encontrará 
              a interface de gerenciamento de ordens de serviço.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">2. Navegação Principal</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>Dashboard:</strong> Visão geral das OS e estatísticas</li>
              <li>• <strong>Ordens de Serviço:</strong> Gerenciamento completo das OS</li>
              <li>• <strong>Estatísticas:</strong> Relatórios e gráficos detalhados</li>
              <li>• <strong>Configurações:</strong> Preferências e gerenciamento do sistema</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">3. Fluxo de Trabalho Recomendado</h3>
            <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
              <li>Criar nova OS com informações básicas</li>
              <li>Definir status inicial baseado na situação atual</li>
              <li>Acompanhar progresso através das mudanças de status</li>
              <li>Utilizar observações para registrar detalhes importantes</li>
              <li>Finalizar OS quando o serviço estiver concluído (OSP)</li>
            </ol>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">4. Boas Práticas</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Sempre preencha observações detalhadas</li>
              <li>• Mantenha os status atualizados conforme o progresso</li>
              <li>• Use prioridades para organizar o trabalho</li>
              <li>• Revise regularmente as OS em aberto</li>
              <li>• Utilize os relatórios para análise de desempenho</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* System Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="w-fit">
              Arquitetura
            </Badge>
            Estrutura do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Campos Obrigatórios</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>Número OS:</strong> Identificador único</li>
                <li>• <strong>Patrimônio:</strong> Código do equipamento</li>
                <li>• <strong>Equipamento:</strong> Descrição do item</li>
                <li>• <strong>Status:</strong> Estado atual da OS</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Campos Opcionais</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>Prioridade:</strong> Normal, Alta ou Baixa</li>
                <li>• <strong>Observações:</strong> Detalhes adicionais</li>
                <li>• <strong>Data de Criação:</strong> Preenchida automaticamente</li>
                <li>• <strong>Usuário:</strong> Responsável pela OS</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center pt-8 space-y-4">
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Começar a Usar o Sistema
          </Button>
          <Button size="lg" variant="outline" onClick={downloadDocumentation}>
            <Download className="h-4 w-4 mr-2" />
            Baixar Documentação
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Clique em "Baixar Documentação" para obter um arquivo de texto completo com todas as informações
        </p>
      </div>
    </div>
  );
};

export default Documentation;