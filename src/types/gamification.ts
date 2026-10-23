export interface Badge {
  id: string;
  name: string;
  category: 'Fase' | 'Competencia' | 'Evaluacion' | 'Especial';
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpValue: number;
}

export interface LearningMission {
  id: string;
  title: string;
  description: string;
  category: 'Exploracion' | 'Practica' | 'Evaluacion' | 'Alineacion';
  phase?: 'ANALISIS' | 'PLANEACION' | 'EJECUCION' | 'EVALUACION';
  xpReward: number;
  completed: boolean;
  actionModule: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  groupName: string;
  avatarSeed: string;
  xp: number;
  level: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export interface TeamLeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  fichNumber: string;
  membersCount: number;
  averageXp: number;
  progressPercent: number;
  isCurrentTeam?: boolean;
}

export interface LearnerProfile {
  name: string;
  documentType?: string;
  documentNumber: string;
  ficha: string;
  center: string;
  regional: string;
  email?: string;
  teamName: string;
  level: number;
  xp: number;
  xpNextLevel: number;
  badges: Badge[];
  completedMissions: string[];
  diagnosticScore?: number;
  phaseScores: Record<string, number>;
  simulationsCompleted: Record<string, boolean>;
}
