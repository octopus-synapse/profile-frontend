'use client';

/**
 * Course Autocomplete Component
 * Search and select Brazilian courses from MEC data
 * Uses SDK hooks and types directly.
 */

import { Autocomplete, type AutocompleteOption } from '@octopus-synapse/profile-ui';
import {
  type MecCourseListDataDtoCoursesItem,
  useMecCoursesSearchCoursesByName,
  useMecInstitutionsListCoursesByInstitutionCode,
} from '@profile/api-client';
import * as React from 'react';

export interface CourseAutocompleteProps {
  value?: number | null;
  displayValue?: string;
  institutionCode?: number | null;
  onValueChange?: (codigoCurso: number | null, course?: MecCourseListDataDtoCoursesItem) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function CourseAutocomplete({
  value,
  displayValue,
  institutionCode,
  onValueChange,
  placeholder = 'Selecione o curso...',
  disabled = false,
  error = false,
  className,
}: CourseAutocompleteProps) {
  const [search, setSearch] = React.useState('');

  const { data: instResponse, isLoading: isLoadingInst } =
    useMecInstitutionsListCoursesByInstitutionCode(institutionCode ?? 0, {
      query: { enabled: institutionCode !== null },
    });

  const { data: searchResponse, isLoading: isLoadingSearch } = useMecCoursesSearchCoursesByName(
    { q: search },
    { query: { enabled: !institutionCode && search.length >= 2 } },
  );

  const institutionCourses =
    instResponse?.status === 200
      ? ((instResponse.data.data as { courses?: MecCourseListDataDtoCoursesItem[] })?.courses ?? [])
      : [];

  const searchCourses =
    searchResponse?.status === 200
      ? ((searchResponse.data.data as { courses?: MecCourseListDataDtoCoursesItem[] })?.courses ??
        [])
      : [];

  const courses = React.useMemo(() => {
    if (institutionCode && institutionCourses.length > 0) {
      if (search.length >= 2) {
        const searchLower = search.toLowerCase();
        return institutionCourses.filter((c) => c.nome.toLowerCase().includes(searchLower));
      }
      return institutionCourses;
    }
    return searchCourses;
  }, [institutionCode, institutionCourses, searchCourses, search]);

  const isLoading = institutionCode ? isLoadingInst : isLoadingSearch;

  const options: AutocompleteOption[] = React.useMemo(() => {
    return courses.map((course) => ({
      value: String(course.codigoCurso),
      label: course.nome,
      description: [course.grau, course.modalidade].filter(Boolean).join(' • ') || 'Curso',
    }));
  }, [courses]);

  const handleValueChange = (val: string) => {
    if (!val) {
      onValueChange?.(null, undefined);
      return;
    }
    const codigoCurso = Number(val);
    const course = courses.find((c) => c.codigoCurso === codigoCurso);
    onValueChange?.(codigoCurso, course);
  };

  return (
    <Autocomplete
      value={value ? String(value) : undefined}
      displayValue={displayValue}
      onValueChange={handleValueChange}
      onSearch={setSearch}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={institutionCode ? 'Filtrar cursos...' : 'Digite o nome do curso...'}
      emptyMessage={
        institutionCode && !isLoading && courses.length === 0
          ? 'Nenhum curso encontrado nesta instituição'
          : 'Nenhum curso encontrado'
      }
      isLoading={isLoading}
      disabled={disabled}
      error={error}
      className={className}
      minSearchLength={institutionCode ? 0 : 2}
    />
  );
}

CourseAutocomplete.displayName = 'CourseAutocomplete';

export type {
  MecCourseListDataDtoCoursesItem,
  MecInstitutionListDataDtoInstitutionsItem,
} from '@profile/api-client';
export {
  InstitutionAutocomplete,
  type InstitutionAutocompleteProps,
} from './institution-autocomplete';
