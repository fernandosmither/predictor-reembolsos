// Enum definitions matching the backend
export const ISAPRE_OPTIONS = [
  'Banmédica',
  'Colmena', 
  'Consalud',
  'Cruz Blanca',
  'Esencial',
  'FONASA',
  'Isapre Fundación BancoEstado',
  'Masvida',
  'Vida Tres'
] as const;

export const TIPO_OPTIONS = [
  'Dental',
  'Examen / Imágenes', 
  'Fonoaudiología',
  'Hora Médica',
  'Kinesiología',
  'Medicamentos',
  'Otro',
  'Proced. Ambulatorio',
  'Proced. Hospitalización', 
  'Psicología',
  'Terapia Ocupacional',
  'Urgencia'
] as const;

export type IsapreOption = typeof ISAPRE_OPTIONS[number];
export type TipoOption = typeof TIPO_OPTIONS[number];

// API Request/Response types
export interface PredictionRequest {
  isapre: IsapreOption;
  tipo: TipoOption;
  total: number;
}

export interface LogisticRegressionResponse {
  probability: number;
  chosen_class: boolean;
}

export interface BayesianNetworkResponse {
  probability: number;
  expected_reimbursement: number;
  expected_wait: number;
}

export interface GMMResponse {
  probability: number;
}

export interface PredictionResponse {
  logistic_regression: LogisticRegressionResponse;
  bayesian_network: BayesianNetworkResponse;
  gmm: GMMResponse;
}

// UI State types
export interface FormData {
  isapre: IsapreOption | '';
  tipo: TipoOption | '';  
  total: string;
}

export interface FormErrors {
  isapre?: string;
  tipo?: string;
  total?: string;
}

export interface PredictionState {
  isLoading: boolean;
  data: PredictionResponse | null;
  error: string | null;
} 