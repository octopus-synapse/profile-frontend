'use client';

/**
 * Institution Autocomplete Component
 * Search and select Brazilian educational institutions from MEC data
 */

import * as React from 'react';
import { Autocomplete, type AutocompleteOption } from '@/shared/components/ui/autocomplete';
import { useSearchInstitutions } from './hooks';
import type { MecInstitution } from './types';

export interface InstitutionAutocompleteProps {
  /** Selected institution code */
  value?: number | null;
  /** Display name for the institution (when value is set externally) */
  displayValue?: string;
  /** Called when selection changes */
  onValueChange?: (codigoIes: number | null, institution?: MecInstitution) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Additional class names */
  className?: string;
}

export function InstitutionAutocomplete({
  value,
  displayValue,
  onValueChange,
  placeholder = 'Selecione a instituição...',
  disabled = false,
  error = false,
  className,
}: InstitutionAutocompleteProps) {
  const [search, setSearch] = React.useState('');

  const { data, isLoading } = useSearchInstitutions(search);

  // Memoize institutions to avoid re-renders
  const institutions = React.useMemo(() => data?.data ?? [], [data]);

  // Transform institutions to autocomplete options
  const options: AutocompleteOption[] = React.useMemo(() => {
    return institutions.map((inst) => ({
      value: String(inst.codigoIes),
      label: inst.sigla ? `${inst.sigla} - ${inst.nome}` : inst.nome,
      description:
        `${inst.categoria ?? 'Instituição'} • ${inst.municipio ?? ''}, ${inst.uf}`.replace(
          ' , ',
          ' ',
        ),
    }));
  }, [institutions]);

  const handleValueChange = (val: string) => {
    if (!val) {
      onValueChange?.(null, undefined);
      return;
    }

    const codigoIes = Number(val);
    const institution = institutions.find((inst) => inst.codigoIes === codigoIes);
    onValueChange?.(codigoIes, institution);
  };

  return (
    <Autocomplete
      value={value ? String(value) : undefined}
      displayValue={displayValue}
      onValueChange={handleValueChange}
      onSearch={setSearch}
      options={options}
      placeholder={placeholder}
      searchPlaceholder="Digite o nome da instituição..."
      emptyMessage="Nenhuma instituição encontrada"
      isLoading={isLoading}
      disabled={disabled}
      error={error}
      className={className}
      minSearchLength={2}
    />
  );
}

InstitutionAutocomplete.displayName = 'InstitutionAutocomplete';
