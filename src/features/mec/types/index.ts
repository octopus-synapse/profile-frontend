/**
 * MEC Types
 * Types for Brazilian Ministry of Education data
 */

export interface MecInstitution {
  codigoIes: number;
  nomeIes: string;
  siglaIes?: string;
  categoriaAdministrativa: string;
  organizacaoAcademica: string;
  uf: string;
  municipio: string;
}

export interface MecCourse {
  codigoCurso: number;
  nomeCurso: string;
  grau: string;
  modalidade: string;
  areaOcde: string;
  situacaoCurso: string;
  codigoIes: number;
  nomeIes?: string;
  uf?: string;
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
