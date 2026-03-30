'use client';

/**
 * Institution Autocomplete Component
 * Search and select Brazilian educational institutions from MEC data
 * Uses SDK hooks and types directly.
 */

import { Autocomplete, type AutocompleteOption } from '@octopus-synapse/profile-ui';
import {
  type MecInstitutionListDataDtoInstitutionsItem,
  useMecInstitutionsSearchInstitutionsByName,
} from '@profile/api-client';
import * as React from 'react';

export interface InstitutionAutocompleteProps {
  value?: number | null;
  displayValue?: string;
  onValueChange?: (
    codigoIes: number | null,
    institution?: MecInstitutionListDataDtoInstitutionsItem,
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
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

  const { data: response, isLoading } = useMecInstitutionsSearchInstitutionsByName(
    { q: search },
    { query: { enabled: search.length >= 2 } },
  );

  const institutions =
    response?.status === 200
      ? ((response.data.data as { institutions?: MecInstitutionListDataDtoInstitutionsItem[] })
          ?.institutions ?? [])
      : [];

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
