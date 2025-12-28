"use client";

/**
 * Course Autocomplete Component
 * Search and select Brazilian courses from MEC data
 * Can be filtered by institution or search all courses
 */

import * as React from "react";
import { Autocomplete, type AutocompleteOption } from "@/shared/components/ui/autocomplete";
import { useSearchCourses, useCoursesByInstitution } from "../hooks";
import type { MecCourse } from "../types";

export interface CourseAutocompleteProps {
  /** Selected course code */
  value?: number | null;
  /** Display name for the course (when value is set externally) */
  displayValue?: string;
  /** Filter courses by institution code */
  institutionCode?: number | null;
  /** Called when selection changes */
  onValueChange?: (codigoCurso: number | null, course?: MecCourse) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Additional class names */
  className?: string;
}

export function CourseAutocomplete({
  value,
  displayValue,
  institutionCode,
  onValueChange,
  placeholder = "Selecione o curso...",
  disabled = false,
  error = false,
  className,
}: CourseAutocompleteProps) {
  const [search, setSearch] = React.useState("");

  // If institution is selected, get courses from that institution
  const { data: institutionCourses, isLoading: isLoadingInstitutionCourses } =
    useCoursesByInstitution(institutionCode ?? null);

  // Otherwise, search all courses
  const { data: searchResults, isLoading: isLoadingSearch } = useSearchCourses(
    search,
    !institutionCode
  );

  // Determine which courses to show
  const courses = React.useMemo(() => {
    if (institutionCode && institutionCourses) {
      // Filter by search if provided
      if (search.length >= 2) {
        const searchLower = search.toLowerCase();
        return institutionCourses.filter((course) =>
          course.nomeCurso.toLowerCase().includes(searchLower)
        );
      }
      return institutionCourses;
    }
    return searchResults?.data ?? [];
  }, [institutionCode, institutionCourses, searchResults, search]);

  const isLoading = institutionCode ? isLoadingInstitutionCourses : isLoadingSearch;

  // Transform courses to autocomplete options
  const options: AutocompleteOption[] = React.useMemo(() => {
    return courses.map((course) => ({
      value: String(course.codigoCurso),
      label: course.nomeCurso,
      description: `${course.grau} • ${course.modalidade}`,
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
      searchPlaceholder={institutionCode ? "Filtrar cursos..." : "Digite o nome do curso..."}
      emptyMessage={
        institutionCode && !isLoading && courses.length === 0
          ? "Nenhum curso encontrado nesta instituição"
          : "Nenhum curso encontrado"
      }
      isLoading={isLoading}
      disabled={disabled}
      error={error}
      className={className}
      minSearchLength={institutionCode ? 0 : 2}
    />
  );
}

CourseAutocomplete.displayName = "CourseAutocomplete";
