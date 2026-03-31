/**
 * Portuguese (Brazil) translations - Settings
 */

export const settings = {
  // Settings Page Navigation
  'settings.nav.sections': 'Seções',
  'settings.nav.account': 'Conta',

  // Profile Section
  'settings.profile.title': 'Perfil público',
  'settings.profile.description':
    'Mantenha a identidade da conta aqui. A identidade do currículo fica na seção Currículo.',
  'settings.profile.contact': 'Contato',
  'settings.profile.social': 'Social',
  'settings.profile.saveChanges': 'Salvar Alterações',
  'settings.profile.failedUpdate': 'Falha ao atualizar perfil',
  'settings.profile.failedLoad': 'Falha ao carregar perfil',
  'settings.profile.unexpectedError': 'Ocorreu um erro inesperado. Por favor, tente novamente.',
  'settings.profile.displayName': 'Nome de Exibição',
  'settings.profile.displayNamePlaceholder': 'Como você quer ser conhecido',
  'settings.profile.bio': 'Bio',
  'settings.profile.bioPlaceholder': 'Um breve resumo sobre você',
  'settings.profile.location': 'Localização',
  'settings.profile.locationPlaceholder': 'Cidade, País',
  'settings.profile.phone': 'Telefone',
  'settings.profile.website': 'Website',
  'settings.profile.linkedin': 'LinkedIn',
  'settings.profile.linkedinTooltip':
    'Link para seu perfil do LinkedIn. Visível como link social no seu perfil público.',
  'settings.profile.github': 'GitHub',
  'settings.profile.githubTooltip':
    'Link para seu perfil do GitHub. Ótimo para mostrar suas contribuições open source.',
  'settings.profile.savedSuccess': 'Alterações salvas com sucesso',
  'settings.profile.failedSave': 'Falha ao salvar alterações',

  // Preferences Section
  'settings.preferences.title': 'Preferências',
  'settings.preferences.description': 'Personalize sua experiência',
  'settings.preferences.visibility.title': 'Visibilidade do Perfil',
  'settings.preferences.visibility.description': 'Controle quem pode ver seu perfil público',
  'settings.preferences.visibility.public': 'Público',
  'settings.preferences.visibility.publicDesc': 'Qualquer pessoa pode ver',
  'settings.preferences.visibility.private': 'Privado',
  'settings.preferences.visibility.privateDesc': 'Apenas você pode ver',
  'settings.preferences.visibility.updating': 'Atualizando...',
  'settings.preferences.language.title': 'Idioma da Interface',
  'settings.preferences.language.description': 'Escolha seu idioma de interface preferido',

  // Danger Zone
  'settings.danger.title': 'Zona de Perigo',
  'settings.danger.description': 'Ações irreversíveis que afetam sua conta.',
  'settings.danger.export.title': 'Exportar seus dados',
  'settings.danger.export.description':
    'Baixe todos os seus dados em formato JSON (LGPD / GDPR Artigo 20).',
  'settings.danger.export.exporting': 'Exportando…',
  'settings.danger.export.button': 'Exportar Dados',
  'settings.danger.export.success': 'Exportação de dados baixada',
  'settings.danger.export.error': 'Falha ao exportar dados',
  'settings.danger.deactivate.title': 'Desativar conta',
  'settings.danger.deactivate.description':
    'Desative temporariamente sua conta. Você pode reativá-la depois.',
  'settings.danger.deactivate.button': 'Desativar',
  'settings.danger.deactivate.dialogTitle': 'Desativar Conta?',
  'settings.danger.deactivate.dialogDesc':
    'Sua conta será desativada, mas seus dados serão preservados. Você pode reativar entrando em contato com o suporte.',
  'settings.danger.deactivate.deactivating': 'Desativando…',
  'settings.danger.deactivate.success': 'Conta desativada',
  'settings.danger.deactivate.error': 'Falha ao desativar conta',
  'settings.danger.delete.title': 'Excluir conta',
  'settings.danger.delete.description':
    'Exclua permanentemente sua conta e todos os dados. Isso não pode ser desfeito.',
  'settings.danger.delete.button': 'Excluir Conta',
  'settings.danger.delete.dialogTitle': 'Excluir Conta Permanentemente',
  'settings.danger.delete.dialogDesc':
    'Esta ação é irreversível. Todos os seus dados, currículos e configurações serão removidos permanentemente.',
  'settings.danger.delete.confirmPrompt': 'Digite {phrase} para confirmar:',
  'settings.danger.delete.deleting': 'Excluindo…',
  'settings.danger.delete.deleteForever': 'Excluir Para Sempre',
  'settings.danger.delete.success': 'Conta excluída permanentemente',
  'settings.danger.delete.error': 'Falha ao excluir conta',

  // Two-Factor Authentication
  'settings.twoFactor.title': 'Autenticação em Dois Fatores',
  'settings.twoFactor.description': 'Adicione uma camada extra de segurança à sua conta.',
  'settings.twoFactor.enabled': 'Ativado',
  'settings.twoFactor.disabled': 'Desativado',
  'settings.twoFactor.enable': 'Ativar 2FA',
  'settings.twoFactor.disable': 'Desativar 2FA',
  'settings.twoFactor.backupCodesRemaining': 'Códigos de backup restantes:',
  'settings.twoFactor.regenerateBackup': 'Regenerar Códigos de Backup',
  'settings.twoFactor.disableDialogTitle': 'Desativar Autenticação em Dois Fatores?',
  'settings.twoFactor.disableDialogDesc':
    'Isso removerá a camada extra de segurança da sua conta. Você pode reativá-la a qualquer momento.',
  'settings.twoFactor.disabling': 'Desativando…',
  'settings.twoFactor.disableSuccess': 'Autenticação em dois fatores desativada',
  'settings.twoFactor.disableError': 'Falha ao desativar 2FA',
  'settings.twoFactor.regenDialogTitle': 'Regenerar Códigos de Backup',
  'settings.twoFactor.regenDialogDescAfter':
    'Salve estes novos códigos de backup. Os códigos anteriores agora são inválidos.',
  'settings.twoFactor.regenDialogDescBefore':
    'Isso invalidará todos os códigos de backup existentes.',
  'settings.twoFactor.copyAllCodes': 'Copiar todos os códigos',
  'settings.twoFactor.done': 'Concluído',
  'settings.twoFactor.generating': 'Gerando…',
  'settings.twoFactor.regenerate': 'Regenerar',
  'settings.twoFactor.regenSuccess': 'Novos códigos de backup gerados',
  'settings.twoFactor.regenError': 'Falha ao regenerar códigos de backup',
  'settings.twoFactor.copySuccess': 'Códigos de backup copiados',
  'settings.twoFactor.copyError': 'Falha ao copiar códigos de backup',
  'settings.twoFactor.notEnabled': '2FA não ativado',

  // Add Section Dialog
  'settings.sections.addNew': 'Adicionar seção',
  'settings.sections.addNewDescription': 'Escolha um tipo de seção para adicionar ao seu currículo',
  'settings.sections.addItemDescription': 'Preencha os detalhes abaixo',
  'settings.sections.editItemTitle': 'Editar {section}',
  'settings.sections.editItemDescription': 'Atualize os detalhes abaixo',
  'settings.sections.searchPlaceholder': 'Buscar seções...',
  'settings.sections.noResults': 'Nenhuma seção encontrada',
  'settings.sections.yourSections': 'Suas seções',
  'settings.sections.availableSections': 'Disponíveis',

  // Username Field
  'settings.username.title': 'Nome de usuário',
  'settings.username.viewProfile': 'Ver perfil público',
  'settings.username.restricted': 'Alteração de nome de usuário restrita',
  'settings.username.updateFailed':
    'Falha ao atualizar nome de usuário. Por favor, tente novamente.',

  // Resume Basics
  'settings.resume.title': 'Essenciais do currículo',
  'settings.resume.description': 'Edite as informações principais criadas durante o onboarding.',
  'settings.resume.titlePlaceholder': 'Meu Currículo',
  'settings.resume.headlinePlaceholder': 'Engenheiro de Software Sênior',
  'settings.resume.fullNamePlaceholder': 'Maria Silva',
  'settings.resume.locationPlaceholder': 'São Paulo, BR',
  'settings.resume.summaryPlaceholder': 'Diga aos recrutadores o que mais importa...',
  'settings.resume.failedLoad': 'Falha ao carregar configurações do currículo',
  'settings.resume.failedLoadDesc':
    'Não foi possível carregar suas configurações de currículo ainda.',
  'settings.resume.summary': 'Resumo',
  'settings.resume.theme': 'Tema do currículo',
  'settings.resume.themeDescription': 'Aplique um estilo visual diferente...',
  'settings.resume.updateSuccess': 'Currículo atualizado com sucesso',
  'settings.resume.updateFailed': 'Falha ao atualizar currículo',

  // Resume Sections Card
  'settings.resume.sections.title': 'Seções do currículo',
  'settings.resume.sections.description':
    'Construa seu perfil adicionando experiências, educação, habilidades,...',
  'settings.resume.sections.loading': 'Carregando tipos de seção...',
} as const;
