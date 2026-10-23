export interface CohortLearner {
  id: string;
  name: string;
  docNumber: string;
  ficha: string;
  email: string;
  phone: string;
  level: number;
  xp: number;
  apropiacionPercent: number;
  status: 'Certificable' | 'En Formación' | 'En Riesgo';
  completedProducts: number; // Out of 10
  diagnosticScore: number;
  lastActive: string;
  productsStatus: {
    prod1: boolean; // Presentación automatizada
    prod2: boolean; // Cronograma automatizado
    prod3: boolean; // Estructura empresa
    prod4: boolean; // Documentos procesos TH
    prod5: boolean; // Registros físicos/digitales
    prod6: boolean; // Agenda reuniones/eventos
    prod7: boolean; // Presentaciones requeridas
    prod8: boolean; // Historia laboral
    prod9: boolean; // FUID
    prod10: boolean; // Informe resultados
  };
}

export const COHORT_LEARNERS: CohortLearner[] = [
  {
    id: 'lrn-001',
    name: 'María Alejandra Gómez Suárez',
    docNumber: '1.032.489.712',
    ficha: '2894501',
    email: 'magomez712@soy.sena.edu.co',
    phone: '310 458 9201',
    level: 4,
    xp: 1980,
    apropiacionPercent: 88,
    status: 'Certificable',
    completedProducts: 9,
    diagnosticScore: 92,
    lastActive: 'Hace 10 minutos',
    productsStatus: {
      prod1: true,
      prod2: true,
      prod3: true,
      prod4: true,
      prod5: true,
      prod6: true,
      prod7: true,
      prod8: true,
      prod9: true,
      prod10: false,
    },
  },
  {
    id: 'lrn-002',
    name: 'Carlos Eduardo Ramírez Torres',
    docNumber: '1.018.394.215',
    ficha: '2894501',
    email: 'ceramirez215@soy.sena.edu.co',
    phone: '320 781 4452',
    level: 3,
    xp: 1420,
    apropiacionPercent: 72,
    status: 'En Formación',
    completedProducts: 7,
    diagnosticScore: 84,
    lastActive: 'Hoy, 09:15 AM',
    productsStatus: {
      prod1: true,
      prod2: true,
      prod3: true,
      prod4: true,
      prod5: true,
      prod6: true,
      prod7: true,
      prod8: false,
      prod9: false,
      prod10: false,
    },
  },
  {
    id: 'lrn-003',
    name: 'Laura Natalia Vargas Mendoza',
    docNumber: '1.026.541.890',
    ficha: '2894501',
    email: 'lnvargas890@soy.sena.edu.co',
    phone: '315 623 8819',
    level: 5,
    xp: 2650,
    apropiacionPercent: 96,
    status: 'Certificable',
    completedProducts: 10,
    diagnosticScore: 98,
    lastActive: 'Hace 2 horas',
    productsStatus: {
      prod1: true,
      prod2: true,
      prod3: true,
      prod4: true,
      prod5: true,
      prod6: true,
      prod7: true,
      prod8: true,
      prod9: true,
      prod10: true,
    },
  },
  {
    id: 'lrn-004',
    name: 'Andrés Felipe Morales Castro',
    docNumber: '1.015.672.334',
    ficha: '2894501',
    email: 'afmorales334@soy.sena.edu.co',
    phone: '311 902 3341',
    level: 2,
    xp: 890,
    apropiacionPercent: 48,
    status: 'En Riesgo',
    completedProducts: 4,
    diagnosticScore: 68,
    lastActive: 'Ayer, 04:30 PM',
    productsStatus: {
      prod1: true,
      prod2: true,
      prod3: true,
      prod4: true,
      prod5: false,
      prod6: false,
      prod7: false,
      prod8: false,
      prod9: false,
      prod10: false,
    },
  },
  {
    id: 'lrn-005',
    name: 'Valentina Restrepo Henao',
    docNumber: '1.030.912.441',
    ficha: '2894501',
    email: 'vrestrepo441@soy.sena.edu.co',
    phone: '318 440 1290',
    level: 3,
    xp: 1350,
    apropiacionPercent: 68,
    status: 'En Formación',
    completedProducts: 6,
    diagnosticScore: 80,
    lastActive: 'Hace 30 minutos',
    productsStatus: {
      prod1: true,
      prod2: true,
      prod3: true,
      prod4: true,
      prod5: true,
      prod6: true,
      prod7: false,
      prod8: false,
      prod9: false,
      prod10: false,
    },
  },
  {
    id: 'lrn-006',
    name: 'Jhoan Sebastián Ortiz Rojas',
    docNumber: '1.012.839.601',
    ficha: '2894501',
    email: 'jsortiz601@soy.sena.edu.co',
    phone: '314 205 7712',
    level: 4,
    xp: 1840,
    apropiacionPercent: 82,
    status: 'Certificable',
    completedProducts: 8,
    diagnosticScore: 88,
    lastActive: 'Hoy, 08:00 AM',
    productsStatus: {
      prod1: true,
      prod2: true,
      prod3: true,
      prod4: true,
      prod5: true,
      prod6: true,
      prod7: true,
      prod8: true,
      prod9: false,
      prod10: false,
    },
  },
];
