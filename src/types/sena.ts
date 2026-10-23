export type ProjectPhase = 'ANALISIS' | 'PLANEACION' | 'EJECUCION' | 'EVALUACION';

export interface LearningOutcome {
  code: string;
  number: string; // e.g. "RA1", "RA2"
  title: string;
  competencyCode: string;
  phase: ProjectPhase;
  knowledgeSaber: string[];
  knowledgeSaberHacer: string[];
  knowledgeSer: string[];
  evaluationCriteria: string[];
}

export interface Competency {
  code: string;
  name: string;
  unitNorm: string;
  hours: number;
  type: 'Tecnica' | 'Transversal' | 'Basica';
  description: string;
  outcomes: LearningOutcome[];
}

export interface PhaseInfo {
  id: ProjectPhase;
  name: string;
  number: number;
  projectActivity: string;
  durationMonths: number;
  objective: string;
  description: string;
  products: SimulatedProduct[];
  competencyCodes: string[];
}

export interface SimulatedProduct {
  id: string;
  phase: ProjectPhase;
  number: number;
  title: string;
  description: string;
  purpose: string;
  keyElements: string[];
  normativeReference?: string;
  associatedRAPs: string[];
  templateSample: {
    title: string;
    fields: { label: string; value: string; tip?: string }[];
    sampleText?: string;
  };
}

export interface ProgramInfo {
  code: string;
  version: string;
  name: string;
  titleObtained: string;
  line: string;
  technologicalNetwork: string;
  knowledgeNetwork: string;
  cuocCode: string;
  cuocOccupation: string;
  lectivaHours: number;
  productivaHours: number;
  totalHours: number;
  projectCode: string;
  projectName: string;
  generalObjective: string;
  specificObjectives: string[];
  center: string;
  regional: string;
}
