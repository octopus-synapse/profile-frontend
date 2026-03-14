/**
 * MEC Course and Institution Types
 * Wrapper types for MEC-related data from Brazilian Ministry of Education
 */

export interface MecCourse {
  codigoCurso: number;
  nome: string;
  grau?: string;
  modalidade?: string;
  codigoIes?: number;
  nomeIes?: string;
  situacao?: string;
}

export interface MecInstitution {
  codigoIes: number;
  nome: string;
  sigla?: string;
  categoria?: string;
  municipio?: string;
  uf: string;
  situacao?: string;
}
