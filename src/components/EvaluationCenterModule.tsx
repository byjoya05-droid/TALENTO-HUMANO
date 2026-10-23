import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  FileText, 
  ShieldCheck, 
  Gamepad2, 
  Award,
  Layers,
  MoveUp,
  MoveDown,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

type EvalMode = 'diagnostic' | 'simulators' | 'cases' | 'trivia';

export const EvaluationCenterModule: React.FC = () => {
  const { addXp, unlockBadge, completeMission, profile, updateProfile } = useGamification();
  const [evalMode, setEvalMode] = useState<EvalMode>('simulators');

  // --- DIAGNOSTIC QUIZ STATE ---
  const diagnosticQuestions = [
    {
      id: 1,
      question: '¿Cuál es el código y denominación de la ocupación según la Clasificación Única de Ocupaciones para Colombia (CUOC) correspondiente al egresado de este programa?',
      options: [
        'Código 1342 - Auxiliares de Talento Humano',
        'Código 2110 - Especialistas en Gestión Estratégica',
        'Código 4121 - Secretarios de Dirección',
        'Código 5220 - Asesores de Ventas Comerciales',
      ],
      correctIndex: 0,
      explanation: 'El programa Técnico en Talento Humano responde directamente a la ocupación CUOC 1342: Auxiliares de Talento Humano.',
    },
    {
      id: 2,
      question: '¿Cuáles son las 4 fases ordenadas que estructuran el Proyecto Formativo 3456077 del SENA?',
      options: [
        'Iniciación, Desarrollo, Seguimiento y Cierre',
        'Análisis, Planeación, Ejecución y Evaluación',
        'Diagnóstico, Presupuesto, Contratación y Auditoría',
        'Selección, Inducción, Capacitación y Desvinculación',
      ],
      correctIndex: 1,
      explanation: 'El ciclo metodológico SENA sigue las cuatro fases: Análisis, Planeación, Ejecución y Evaluación (PHVA).',
    },
    {
      id: 3,
      question: '¿Qué norma legal colombiana regula la custodia, reserva y tratamiento de datos personales en los expedientes laborales?',
      options: [
        'Ley 100 de 1993',
        'Ley 1581 de 2012 (Habeas Data)',
        'Código de Comercio',
        'Resolución 1401 de 2007',
      ],
      correctIndex: 1,
      explanation: 'La Ley 1581 de 2012 y su Decreto Reglamentario 1377 de 2013 regulan el régimen de protección de datos personales de los colaboradores.',
    },
    {
      id: 4,
      question: '¿Cuál es el documento estandarizado por el Archivo General de la Nación (AGN) para el inventario y transferencia de unidades documentales?',
      options: [
        'RUT (Registro Único Tributario)',
        'FUID (Formato Único de Inventario Documental)',
        'Planilla PILA de seguridad social',
        'Formato Minerva 1003',
      ],
      correctIndex: 1,
      explanation: 'El FUID (Formato Único de Inventario Documental) es el instrumento archivístico oficial dictado por el AGN.',
    },
    {
      id: 5,
      question: '¿Cuáles son los tres componentes del saber que articulan los Resultados de Aprendizaje en el modelo de formación por competencias del SENA?',
      options: [
        'Teoría, Práctica y Calificación',
        'Saber (Conceptual), Saber Hacer (Procedimental) y Ser (Actitudinal)',
        'Misión, Visión y Valores corporativos',
        'Reclutamiento, Selección y Contratación',
      ],
      correctIndex: 1,
      explanation: 'La formación integral SENA se fundamenta en el Saber (cognitivo), Saber Hacer (destrezas técnicas) y Ser (valores y ética).',
    },
  ];

  const [diagAnswers, setDiagAnswers] = useState<Record<number, number>>({});
  const [diagSubmitted, setDiagSubmitted] = useState<boolean>(false);
  const [diagScore, setDiagScore] = useState<number>(0);

  const handleSelectDiagOption = (qId: number, optIdx: number) => {
    if (diagSubmitted) return;
    setDiagAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitDiagnostic = () => {
    let correctCount = 0;
    diagnosticQuestions.forEach((q) => {
      if (diagAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
    const finalScore = Math.round((correctCount / diagnosticQuestions.length) * 100);
    setDiagScore(finalScore);
    setDiagSubmitted(true);
    addXp(150, 'Evaluación Diagnóstica completada');
    unlockBadge('badge-diag');
    updateProfile({ diagnosticScore: finalScore });
  };

  const handleResetDiagnostic = () => {
    setDiagAnswers({});
    setDiagSubmitted(false);
    setDiagScore(0);
  };

  // --- SIMULATOR: HISTORIA LABORAL ORDERING ---
  const initialDocs = [
    { id: 'doc-afiliacion', title: 'Afiliaciones al Sistema de Seguridad Social (EPS, AFP, ARL, CCF)', date: '2025-02-03', correctOrder: 5 },
    { id: 'doc-hv', title: 'Hoja de Vida de la Aspirante con Soportes Académicos', date: '2025-01-10', correctOrder: 1 },
    { id: 'doc-examen', title: 'Concepto de Examen Médico Pre-ocupacional de Ingreso', date: '2025-01-28', correctOrder: 3 },
    { id: 'doc-contrato', title: 'Contrato Individual de Trabajo a Término Fijo Firmado', date: '2025-02-01', correctOrder: 4 },
    { id: 'doc-entrevista', title: 'Informe de Entrevista por Competencias y Pruebas Psicotécnicas', date: '2025-01-18', correctOrder: 2 },
    { id: 'doc-induccion', title: 'Constancia de Inducción Institucional y Entrega de Reglamento', date: '2025-02-05', correctOrder: 6 },
  ];

  const [orderedDocs, setOrderedDocs] = useState(initialDocs);
  const [historyValidated, setHistoryValidated] = useState<boolean>(false);
  const [historySuccess, setHistorySuccess] = useState<boolean>(false);

  const moveDoc = (index: number, direction: 'up' | 'down') => {
    if (historyValidated) return;
    const newDocs = [...orderedDocs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newDocs.length) return;
    const temp = newDocs[index];
    newDocs[index] = newDocs[targetIndex];
    newDocs[targetIndex] = temp;
    setOrderedDocs(newDocs);
  };

  const handleValidateHistory = () => {
    const isPerfect = orderedDocs.every((doc, idx) => doc.correctOrder === idx + 1);
    setHistoryValidated(true);
    setHistorySuccess(isPerfect);
    if (isPerfect) {
      addXp(200, 'Simulador de Historia Laboral superado con orden cronológico perfecto');
      completeMission('mis-4');
      unlockBadge('badge-fuid');
    }
  };

  const handleResetHistory = () => {
    setOrderedDocs(initialDocs);
    setHistoryValidated(false);
    setHistorySuccess(false);
  };

  // --- SIMULATOR: FUID FILLING ---
  const [fuidFields, setFuidFields] = useState({
    numOrden: '01',
    codigoTRD: '100-24',
    nombreSerie: 'Historias Laborales',
    fechaIni: '2025',
    fechaFin: '2026',
    unidadCons: 'Caja 04 / Carpeta 12',
    numFolios: '28',
    soporte: 'Híbrido (Papel desacificado + PDF firmado digitalmente)',
  });
  const [fuidSubmitted, setFuidSubmitted] = useState<boolean>(false);

  const handleValidateFUID = () => {
    setFuidSubmitted(true);
    addXp(250, 'Simulador FUID completado según directrices del AGN');
    completeMission('mis-5');
    unlockBadge('badge-fuid');
  };

  // --- TRIVIA STATE ---
  const triviaQuestions = [
    {
      q: '¿Qué lápiz se debe utilizar para foliar un expediente de archivo según el AGN?',
      options: ['Esfero de tinta negra', 'Lápiz de grafito HB o 2B', 'Marcador permanente', 'Pluma estilográfica'],
      correct: 1,
      info: 'El Acuerdo 002 de 2014 del AGN prescribe la foliación en el extremo superior derecho con lápiz de mina suave (grafito) para preservar el soporte.',
    },
    {
      q: '¿Cuál es el porcentaje máximo legal de descuento por libranza o embargo común sobre el salario del trabajador?',
      options: ['Hasta el 50% según la normatividad laboral', 'El 100% si el jefe lo autoriza', 'Máximo el 10%', 'No hay límite legal'],
      correct: 0,
      info: 'En Colombia el salario mínimo es inembargable, excepto por alimentos o cooperativas hasta el 50% (Código Sustantivo del Trabajo).',
    },
    {
      q: '¿Cada cuánto tiempo deben realizarse los exámenes médicos ocupacionales periódicos a los colaboradores?',
      options: ['Cada 10 años', 'Anualmente o según el profesiograma y matriz de riesgos', 'Solo al retirarse', 'Nunca son obligatorios'],
      correct: 1,
      info: 'La Resolución 2346 de 2007 establece la obligatoriedad de evaluaciones periódicas según el perfil de riesgo del cargo.',
    },
    {
      q: '¿Cuál es el propósito principal del Comité de Convivencia Laboral en la empresa simulada?',
      options: ['Despedir trabajadores', 'Prevenir el acoso laboral y mediar pacíficamente conflictos (Ley 1010 de 2006)', 'Organizar la fiesta de fin de año', 'Comprar los suministros de oficina'],
      correct: 1,
      info: 'El Comité de Convivencia Laboral promueve la armonía laboral y gestiona quejas de presunto acoso de manera confidencial.',
    },
  ];

  const [triviaIndex, setTriviaIndex] = useState<number>(0);
  const [triviaSelectedOpt, setTriviaSelectedOpt] = useState<number | null>(null);
  const [triviaScore, setTriviaScore] = useState<number>(0);
  const [triviaFinished, setTriviaFinished] = useState<boolean>(false);

  const handleTriviaAnswer = (optIdx: number) => {
    if (triviaSelectedOpt !== null) return;
    setTriviaSelectedOpt(optIdx);
    if (optIdx === triviaQuestions[triviaIndex].correct) {
      setTriviaScore((prev) => prev + 1);
      addXp(40, 'Respuesta correcta en Trivia SENA');
    }
  };

  const handleNextTrivia = () => {
    setTriviaSelectedOpt(null);
    if (triviaIndex + 1 < triviaQuestions.length) {
      setTriviaIndex((prev) => prev + 1);
    } else {
      setTriviaFinished(true);
      addXp(100, 'Trivia SENA completada');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Sistema de Evaluación Integral · Diagnóstica, Formativa y Práctica
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Centro de Evaluación, Retos & Simuladores
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Demuestra tu apropiación del programa Técnico en Talento Humano mediante pruebas diagnósticas,
              simuladores interactivos de archivo y FUID, resolución de casos reales y trivia formativa.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start md:self-auto overflow-x-auto">
            <button
              onClick={() => setEvalMode('simulators')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                evalMode === 'simulators'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Simuladores FUID / Historia
            </button>
            <button
              onClick={() => setEvalMode('diagnostic')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                evalMode === 'diagnostic'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Evaluación Diagnóstica
            </button>
            <button
              onClick={() => setEvalMode('cases')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                evalMode === 'cases'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Casos Prácticos
            </button>
            <button
              onClick={() => setEvalMode('trivia')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                evalMode === 'trivia'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trivia SENA TH
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: SIMULATORS (FUID & HISTORIA LABORAL) */}
      {evalMode === 'simulators' && (
        <div className="space-y-6">
          {/* SIMULATOR 1: HISTORIA LABORAL ORDENATION */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Simulador 01 · Competencia 210601031 (Gestión Documental)
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Conformación Técnica de Historia Laboral (Principio de Orden Original)
                </h2>
                <p className="text-xs text-slate-500">
                  Colaboradora Simulada: <strong>Andrea Carolina Morales</strong> · Expediente en Carpeta Cuatro Aletas.
                  Reordena los documentos en riguroso orden cronológico y procedimental (desde el reclutamiento hasta la vinculación).
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={handleResetHistory}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reiniciar
                </button>
              </div>
            </div>

            {/* Document Ordering Canvas */}
            <div className="space-y-2">
              {orderedDocs.map((doc, idx) => {
                const isCorrectPosition = historyValidated && doc.correctOrder === idx + 1;
                const isWrongPosition = historyValidated && doc.correctOrder !== idx + 1;

                return (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 transition-colors ${
                      isCorrectPosition
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                        : isWrongPosition
                        ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white border border-slate-300 font-mono font-bold text-slate-700 flex items-center justify-center text-[11px] shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{doc.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Fecha de expedición: {doc.date} · Folios estimados: {(idx + 1) * 3}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        disabled={idx === 0 || historyValidated}
                        onClick={() => moveDoc(idx, 'up')}
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                        title="Subir documento"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={idx === orderedDocs.length - 1 || historyValidated}
                        onClick={() => moveDoc(idx, 'down')}
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                        title="Bajar documento"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Validation CTA */}
            {!historyValidated ? (
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  Usa las flechas arriba/abajo para ordenar los documentos cronológicamente.
                </span>
                <button
                  onClick={handleValidateHistory}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verificar Expediente y Foliación (+200 XP)
                </button>
              </div>
            ) : (
              <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                historySuccess
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                <div className="font-bold flex items-center gap-2">
                  {historySuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ¡Expediente de Historia Laboral Conforme según Acuerdo 002/2014 del AGN!
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Inconsistencia en el orden original. Revisa las fechas de emisión.
                    </>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {historySuccess
                    ? 'Has respetado el principio de procedencia y orden cronológico. Los documentos van desde la etapa precontractual (Hoja de Vida y Entrevista), pasando por exámenes de ingreso, contrato, hasta afiliaciones e inducción.'
                    : 'Recuerda que en archivística laboral ningún colaborador puede firmar contrato sin antes tener el concepto médico pre-ocupacional, ni puede tener inducción antes del contrato.'}
                </p>
              </div>
            )}
          </div>

          {/* SIMULATOR 2: FUID OFFICIAL AGN FILLING */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                  Simulador 02 · Archivo General de la Nación (AGN)
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Diligenciamiento del Formato Único de Inventario Documental (FUID)
                </h2>
                <p className="text-xs text-slate-500">
                  Acredita el registro archivístico oficial de las unidades documentales producidas en el área de talento humano.
                </p>
              </div>

              {fuidSubmitted && (
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold font-mono">
                  FUID Aprobado (+250 XP)
                </span>
              )}
            </div>

            {/* Interactive FUID Table Form */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-2.5">No. Orden</th>
                    <th className="p-2.5">Código TRD</th>
                    <th className="p-2.5">Nombre de la Serie / Subserie</th>
                    <th className="p-2.5">Fechas Extremas</th>
                    <th className="p-2.5">Unidad Conservación</th>
                    <th className="p-2.5">No. Folios</th>
                    <th className="p-2.5">Soporte</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-white">
                    <td className="p-2.5 font-mono font-bold text-slate-800">{fuidFields.numOrden}</td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={fuidFields.codigoTRD}
                        onChange={(e) => setFuidFields({ ...fuidFields, codigoTRD: e.target.value })}
                        className="p-1 border border-slate-200 rounded text-xs font-mono w-24 bg-slate-50"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={fuidFields.nombreSerie}
                        onChange={(e) => setFuidFields({ ...fuidFields, nombreSerie: e.target.value })}
                        className="p-1 border border-slate-200 rounded text-xs w-48 bg-slate-50 font-medium"
                      />
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={fuidFields.fechaIni}
                          onChange={(e) => setFuidFields({ ...fuidFields, fechaIni: e.target.value })}
                          className="p-1 border border-slate-200 rounded text-xs w-16 bg-slate-50 font-mono text-center"
                        />
                        <span>-</span>
                        <input
                          type="text"
                          value={fuidFields.fechaFin}
                          onChange={(e) => setFuidFields({ ...fuidFields, fechaFin: e.target.value })}
                          className="p-1 border border-slate-200 rounded text-xs w-16 bg-slate-50 font-mono text-center"
                        />
                      </div>
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={fuidFields.unidadCons}
                        onChange={(e) => setFuidFields({ ...fuidFields, unidadCons: e.target.value })}
                        className="p-1 border border-slate-200 rounded text-xs w-36 bg-slate-50"
                      />
                    </td>
                    <td className="p-2.5 font-mono">
                      <input
                        type="text"
                        value={fuidFields.numFolios}
                        onChange={(e) => setFuidFields({ ...fuidFields, numFolios: e.target.value })}
                        className="p-1 border border-slate-200 rounded text-xs w-16 bg-slate-50 text-center font-bold text-emerald-800"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={fuidFields.soporte}
                        onChange={(e) => setFuidFields({ ...fuidFields, soporte: e.target.value })}
                        className="p-1 border border-slate-200 rounded text-xs w-44 bg-slate-50"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Norma técnica: Circular 004 de 2003 del Archivo General de la Nación.
              </span>

              <button
                disabled={fuidSubmitted}
                onClick={handleValidateFUID}
                className={`px-4 py-2 font-semibold text-xs rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                  fuidSubmitted
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {fuidSubmitted ? 'FUID Validador Registrado' : 'Validar y Registrar FUID (+250 XP)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: DIAGNOSTIC QUIZ */}
      {evalMode === 'diagnostic' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                Evaluación Diagnóstica Inicial
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Cuestionario de Saberes Previos de Ingreso
              </h2>
              <p className="text-xs text-slate-500">
                Verifica tu comprensión inicial sobre el programa formativo, el perfil ocupacional y la normatividad.
              </p>
            </div>

            {diagSubmitted && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Resultado:</span>
                <span className={`px-3 py-1 rounded-md text-xs font-bold font-mono ${
                  diagScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {diagScore}% de Aciertos
                </span>
                <button
                  onClick={handleResetDiagnostic}
                  className="px-2.5 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600"
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {diagnosticQuestions.map((q, qIndex) => {
              const selectedOpt = diagAnswers[q.id];
              return (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-8">
                    {q.options.map((opt, optIndex) => {
                      const isChosen = selectedOpt === optIndex;
                      const isCorrect = q.correctIndex === optIndex;
                      let btnStyle = 'border-slate-200 bg-white hover:bg-slate-100 text-slate-800';

                      if (diagSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                        } else {
                          btnStyle = 'border-slate-200 bg-white opacity-60 text-slate-600';
                        }
                      } else if (isChosen) {
                        btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs';
                      }

                      return (
                        <button
                          key={optIndex}
                          disabled={diagSubmitted}
                          onClick={() => handleSelectDiagOption(q.id, optIndex)}
                          className={`p-2.5 text-xs rounded-lg border text-left transition-colors cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-[10px] text-slate-400 font-bold">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span className="leading-normal">{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {diagSubmitted && (
                    <div className="ml-8 p-2.5 rounded bg-white border border-slate-200 text-[11px] text-slate-600">
                      <strong>Explicación:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!diagSubmitted && (
            <div className="flex items-center justify-end pt-2">
              <button
                disabled={Object.keys(diagAnswers).length < diagnosticQuestions.length}
                onClick={handleSubmitDiagnostic}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <span>Finalizar y Calificar Diagnóstico (+150 XP)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: CASOS PRÁCTICOS */}
      {evalMode === 'cases' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">
              Caso 01 · Provisión & Reclutamiento
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Candidato con Título Técnico y sin Libreta Militar
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Un aspirante al cargo de Auxiliar de Talento Humano cumple con el perfil formativo y pasó las pruebas psicotécnicas,
              pero no tiene definida su situación militar. ¿Cuál es el procedimiento legal del área de TH según la Ley 1780 de 2016?
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <div className="font-bold">Dictamen Procedimental:</div>
              <p className="text-[11px]">
                La Ley 1780 de 2016 permite vincular laboralmente al ciudadano, otorgándole un plazo de gracia de 18 meses para normalizar
                su situación militar. No se puede excluir del proceso de contratación por este motivo.
              </p>
            </div>
            <button
              onClick={() => addXp(50, 'Resolución de caso de provisión de personal')}
              className="w-full py-2 bg-emerald-50 text-emerald-800 font-semibold text-xs rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Registrar Solución (+50 XP)
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">
              Caso 02 · Trámite de Ausentismo & Novedades
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Incapacidad Médica Común de 3 Días
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Una trabajadora presenta incapacidad de 3 días por enfermedad general expedida por su EPS.
              ¿Quién asume el pago de los primeros 2 días y quién el tercer día en Colombia?
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <div className="font-bold">Dictamen Procedimental:</div>
              <p className="text-[11px]">
                Los dos primeros días son pagados por el empleador al 66.67% del IBC (sin ser inferior al SMMLV).
                A partir del tercer día, la EPS asume el subsidio de incapacidad económica (Decreto 2943 de 2013).
              </p>
            </div>
            <button
              onClick={() => addXp(50, 'Resolución de caso de ausentismo laboral')}
              className="w-full py-2 bg-blue-50 text-blue-800 font-semibold text-xs rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Registrar Solución (+50 XP)
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: TRIVIA SENA TH */}
      {evalMode === 'trivia' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-900 text-base">Trivia Talento SENA</h2>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Pregunta {triviaIndex + 1} de {triviaQuestions.length} · Aciertos: {triviaScore}
            </div>
          </div>

          {!triviaFinished ? (
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {triviaQuestions[triviaIndex].q}
              </h3>

              <div className="space-y-2">
                {triviaQuestions[triviaIndex].options.map((opt, idx) => {
                  const isSelected = triviaSelectedOpt === idx;
                  const isCorrect = triviaQuestions[triviaIndex].correct === idx;
                  let style = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800';

                  if (triviaSelectedOpt !== null) {
                    if (isCorrect) style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                    else if (isSelected) style = 'bg-rose-50 border-rose-300 text-rose-950 line-through';
                    else style = 'bg-slate-50 border-slate-200 opacity-60 text-slate-600';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleTriviaAnswer(idx)}
                      disabled={triviaSelectedOpt !== null}
                      className={`w-full p-3 rounded-lg border text-left text-xs font-medium transition-colors cursor-pointer ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {triviaSelectedOpt !== null && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-950">
                  <strong>Dato Técnico:</strong> {triviaQuestions[triviaIndex].info}
                </div>
              )}

              {triviaSelectedOpt !== null && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextTrivia}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Siguiente Pregunta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <Award className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">
                ¡Trivia SENA Completada!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Has obtenido <strong className="text-emerald-700">{triviaScore} de {triviaQuestions.length} aciertos</strong>.
                Tus puntos de experiencia han sido sumados al perfil.
              </p>
              <button
                onClick={() => {
                  setTriviaIndex(0);
                  setTriviaSelectedOpt(null);
                  setTriviaScore(0);
                  setTriviaFinished(false);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Jugar Nuevamente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
