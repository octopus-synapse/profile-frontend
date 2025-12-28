/**
 * MEC Types
 * Types for Brazilian Ministry of Education data
 */

export interface MecInstitution {
  id: string;
  codigoIes: number;
  nome: string;
  sigla: string | null;
  uf: string;
  municipio: string | null;
  categoria: string | null;
  organizacao: string | null;
}

export interface MecCourse {
  id: string;
  codigoCurso: number;
  nome: string;
  grau: string | null;
  modalidade: string | null;
  areaConhecimento: string | null;
  institution: {
    nome: string;
    sigla: string | null;
    uf: string;
  };
}

export interface MecSearchParams {
  q: string;
  limit?: number;
}

export interface MecInstitutionSearchResult {
  total: number;
  data: MecInstitution[];
}

export interface MecCourseSearchResult {
  total: number;
  data: MecCourse[];
}
