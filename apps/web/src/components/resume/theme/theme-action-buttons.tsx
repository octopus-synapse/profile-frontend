/**
 * ThemeActionButtons — import and create buttons for theme manager.
 */

import { Button } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';

interface ImportButtonProps {
  onClick: () => void;
}

export function ImportButton({ onClick }: ImportButtonProps) {
  const { t } = useI18n();

  return (
    <Button
      type="button"
      variant="outline"
      tone="neutral"
      size="sm"
      leftIcon={<span>📥</span>}
      onPress={onClick}
    >
      {t('resume.theme.myThemes.importJson')}
    </Button>
  );
}

interface CreateButtonProps {
  onClick: () => void;
}

export function CreateButton({ onClick }: CreateButtonProps) {
  const { t } = useI18n();

  return (
    <Button
      type="button"
      variant="solid"
      tone="primary"
      size="sm"
      leftIcon={<span>➕</span>}
      onPress={onClick}
    >
      {t('resume.theme.myThemes.newTheme')}
    </Button>
  );
}
