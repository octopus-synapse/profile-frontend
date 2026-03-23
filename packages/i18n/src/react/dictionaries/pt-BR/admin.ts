/**
 * Portuguese (Brazil) translations - Admin
 */

export const admin = {
  // Dashboard
  'admin.dashboard.title': 'Painel Administrativo',
  'admin.dashboard.welcome': 'Bem-vindo ao painel admin',
  'admin.dashboard.totalUsers': 'Total de Usuários',
  'admin.dashboard.totalResumes': 'Total de Currículos',
  'admin.dashboard.activeUsers': 'Usuários Ativos',
  'admin.dashboard.recentActivity': 'Atividade Recente',

  // Users
  'admin.users.title': 'Gerenciamento de Usuários',
  'admin.users.search': 'Buscar usuários...',
  'admin.users.table.name': 'Nome',
  'admin.users.table.email': 'Email',
  'admin.users.table.role': 'Função',
  'admin.users.table.status': 'Status',
  'admin.users.table.created': 'Criado em',
  'admin.users.table.actions': 'Ações',
  'admin.users.noUsers': 'Nenhum usuário encontrado',
  'admin.users.deleteConfirm': 'Tem certeza que deseja excluir este usuário?',

  // Roles
  'admin.role.user': 'Usuário',
  'admin.role.admin': 'Admin',

  // Access
  'admin.access.denied': 'Acesso Negado',
  'admin.access.deniedMessage': 'Você não tem permissão para acessar esta página.',

  // Dashboard extended
  'admin.dashboard.subtitle': 'Visão geral das principais métricas e atividades da sua plataforma',
  'admin.dashboard.allOperational': 'Todos os sistemas operacionais',
  'admin.dashboard.servicesRunning': 'Os serviços estão funcionando normalmente. Verificado agora.',
  'admin.dashboard.publicProfiles': 'Perfis Públicos',
  'admin.dashboard.resumesCreated': 'Currículos Criados',

  // Users table extended
  'admin.users.table.user': 'Usuário',
  'admin.users.table.resumes': 'Currículos',
  'admin.users.table.joined': 'Cadastro',
  'admin.users.table.lastLogin': 'Último Login',
  'admin.users.table.noName': 'Sem nome',
  'admin.users.table.never': 'Nunca',
  'admin.users.table.removeAdmin': 'Remover Admin',
  'admin.users.table.makeAdmin': 'Tornar Admin',
  'admin.users.table.viewProfile': 'Ver Perfil',
  'admin.users.table.deleteUser': 'Excluir Usuário',
  'admin.users.deleteTitle': 'Excluir Usuário',
  'admin.users.deleteDescription':
    'Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita. Todos os dados serão removidos permanentemente.',
  'admin.users.deleteSuccess': 'Usuário excluído com sucesso',
  'admin.users.deleteFailed': 'Falha ao excluir usuário',
  'admin.users.roleUpdated': 'Função do usuário atualizada',
  'admin.users.roleUpdateFailed': 'Falha ao atualizar função',
  'admin.users.filterAllRoles': 'Todas as Funções',
  'admin.users.adjustSearch': 'Tente ajustar sua busca ou filtros',
  'admin.users.usersWillAppear': 'Os usuários aparecerão aqui quando se cadastrarem',
  'admin.users.unnamedUser': 'Usuário sem nome',

  // Recent users widget
  'admin.recentUsers.title': 'Usuários Recentes',
  'admin.recentUsers.viewAll': 'Ver todos',
  'admin.recentUsers.noUsers': 'Nenhum usuário ainda',
  'admin.recentUsers.noUsersDesc': 'Os usuários aparecerão aqui quando se cadastrarem',

  // Recent activity widget
  'admin.recentActivity.title': 'Atividade Recente',
  'admin.recentActivity.noActivity': 'Nenhuma atividade ainda',
  'admin.recentActivity.noActivityDesc': 'A atividade dos usuários aparecerá aqui',
  'admin.recentActivity.signedUp': 'se cadastrou',
  'admin.recentActivity.loggedIn': 'fez login',
  'admin.recentActivity.createdResume': 'criou um currículo',
  'admin.recentActivity.updatedProfile': 'atualizou o perfil',

  // Section types
  'admin.sectionTypes.search': 'Buscar tipos de seção...',
  'admin.sectionTypes.allKinds': 'Todos os Tipos',
  'admin.sectionTypes.statusAll': 'Todos',
  'admin.sectionTypes.active': 'Ativo',
  'admin.sectionTypes.inactive': 'Inativo',
  'admin.sectionTypes.new': 'Novo Tipo de Seção',
  'admin.sectionTypes.notFound': 'Nenhum tipo de seção encontrado',
  'admin.sectionTypes.adjustSearch': 'Tente ajustar sua busca ou filtros',
  'admin.sectionTypes.willAppear': 'Os tipos de seção aparecerão aqui quando criados',
  'admin.sectionTypes.deleted': 'Tipo de seção excluído',
  'admin.sectionTypes.deleteFailed': 'Falha ao excluir tipo de seção',

  // Section type form
  'admin.sectionTypes.form.key': 'Chave',
  'admin.sectionTypes.form.title': 'Título',
  'admin.sectionTypes.form.description': 'Descrição',
  'admin.sectionTypes.form.semanticKind': 'Tipo Semântico',
  'admin.sectionTypes.form.iconType': 'Tipo de Ícone',
  'admin.sectionTypes.form.icon': 'Ícone',
  'admin.sectionTypes.form.minItems': 'Mín. Itens',
  'admin.sectionTypes.form.maxItems': 'Máx. Itens',
  'admin.sectionTypes.form.active': 'Ativo',
  'admin.sectionTypes.form.repeatable': 'Repetível',
  'admin.sectionTypes.form.translations': 'Traduções',
  'admin.sectionTypes.form.label': 'Rótulo',
  'admin.sectionTypes.form.noDataLabel': 'Rótulo Sem Dados',
  'admin.sectionTypes.form.placeholder': 'Placeholder',
  'admin.sectionTypes.form.addLabel': 'Rótulo Adicionar',

  // Theme approvals
  'admin.themes.title': 'Aprovação de Temas',
  'admin.themes.subtitle': 'Revise e aprove temas enviados por usuários para uso público',
  'admin.themes.pendingCount': '{count} tema(s) aguardando revisão',
  'admin.themes.reviewPrompt': 'Revise envios para disponibilizá-los para todos os usuários',
  'admin.themes.allCaughtUp': 'Tudo em dia!',
  'admin.themes.noPending': 'Nenhum tema pendente de revisão no momento',
  'admin.themes.pendingReview': 'Pendente de Revisão',
  'admin.themes.approvedToday': 'Aprovados Hoje',
  'admin.themes.rejectedToday': 'Rejeitados Hoje',
  'admin.themes.pendingReviews': 'Revisões Pendentes',
} as const;
