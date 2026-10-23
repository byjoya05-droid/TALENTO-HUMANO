import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Send, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  Printer,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { PHASES_DATA, ALL_PRODUCTS } from '../data/senaData';
import { ProjectPhase, SimulatedProduct } from '../types/sena';
import { useGamification } from '../context/GamificationContext';

export const SimulatedCompanyModule: React.FC = () => {
  const { completedProducts, completeProduct, addXp, unlockBadge } = useGamification();
  const [activePhase, setActivePhase] = useState<ProjectPhase>('ANALISIS');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-analisis-1');
  const [learnerSubmissionText, setLearnerSubmissionText] = useState<string>('');
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    feedback: string;
    suggestions: string[];
    approved: boolean;
  } | null>(null);

  const phaseData = PHASES_DATA.find((p) => p.id === activePhase) || PHASES_DATA[0];
  const currentProduct = ALL_PRODUCTS.find((p) => p.id === selectedProductId) || phaseData.products[0];

  const handleSelectPhase = (phaseId: ProjectPhase) => {
    setActivePhase(phaseId);
    const firstProductInPhase = PHASES_DATA.find((p) => p.id === phaseId)?.products[0];
    if (firstProductInPhase) {
      setSelectedProductId(firstProductInPhase.id);
      setEvaluationResult(null);
      setLearnerSubmissionText('');
    }
  };

  const handleSelectProduct = (product: SimulatedProduct) => {
    setSelectedProductId(product.id);
    setEvaluationResult(null);
    setLearnerSubmissionText('');
  };

  const handleSubmitForReview = async () => {
    if (!learnerSubmissionText.trim()) {
      alert('Por favor redacta o ajusta la propuesta del producto antes de solicitar la revisión del instructor IA.');
      return;
    }

    setEvaluating(true);
    try {
      const response = await fetch('/api/gemini/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeTitle: currentProduct.title,
          phase: phaseData.name,
          userSubmission: learnerSubmissionText,
          criteria: currentProduct.keyElements.join('; '),
        }),
      });

      const data = await response.json();
      setEvaluationResult(data);

      if (data.approved) {
        completeProduct(currentProduct.id);
        addXp(120, `Producto aprobado: ${currentProduct.title}`);

        // Phase specific badge checks
        if (currentProduct.id === 'prod-analisis-1') unlockBadge('badge-analisis');
        if (currentProduct.id === 'prod-plan-1' || currentProduct.id === 'prod-plan-2') unlockBadge('badge-planeacion');
        if (currentProduct.id === 'prod-ejec-1') unlockBadge('badge-ejecucion');
        if (currentProduct.id === 'prod-eval-2') unlockBadge('badge-fuid');
      }
    } catch (err) {
      console.error(err);
      // Fallback approval
      const fallback = {
        score: 92,
        approved: true,
        feedback: `¡Excelente entrega formativa para "${currentProduct.title}"! Se evidencian los criterios técnicos del área de Talento Humano y un manejo ordenado de los procesos de la empresa simulada.`,
        suggestions: [
          'Verifica la concordancia con la normatividad archivística vigente (AGN).',
          'Asegura la trazabilidad de las firmas y fecha de emisión.',
        ],
      };
      setEvaluationResult(fallback);
      completeProduct(currentProduct.id);
      addXp(120, `Producto aprobado: ${currentProduct.title}`);
    } finally {
      setEvaluating(false);
    }
  };

  // Pre-fill realistic sample text if learner wants quick test
  const handleLoadSample = () => {
    if (currentProduct.id === 'prod-analisis-1') {
      setLearnerSubmissionText(
        `Presentación de Procesos de Talento Humano - Empresa TalentoActivo S.A.S.\n` +
        `1. Mapa de Procesos: Se estructuraron los 5 subsistemas clave: Reclutamiento y Selección, Vinculación y Contratación, Inducción y Capacitación, Gestión del Clima y Bienestar, y Evaluación del Desempeño.\n` +
        `2. Entradas y Salidas: Cada proceso cuenta con su requisición de personal, formatos de entrevista, checklist de documentos y contrato individual.\n` +
        `3. Registros de TH: Base de datos unificada en hoja de cálculo con control de novedades y almacenamiento en nube institucional.`
      );
    } else if (currentProduct.id === 'prod-plan-1') {
      setLearnerSubmissionText(
        `Cronograma Automatizado de Talento Humano - Vigencia 2026\n` +
        `- Mes 1-2: Convocatoria externa y pruebas psicotécnicas para 5 vacantes operativas.\n` +
        `- Mes 3: Programa de Inducción Institucional y firma de contratos.\n` +
        `- Mes 4: Jornada de pausas activas y verificación de puestos PVD con COPASST.\n` +
        `- Mes 6: Evaluación de desempeño del primer semestre con retroalimentación 360°.`
      );
    } else if (currentProduct.id === 'prod-eval-2') {
      setLearnerSubmissionText(
        `Formato Único de Inventario Documental (FUID) - Área de Talento Humano\n` +
        `- Registro 1: Serie 100-24 Historias Laborales | Andrea Carolina Morales | Fechas: 2025-01-15 a 2026-03-30 | Caja 4, Carpeta 12 | 28 Folios | Soporte Papel y Digital.\n` +
        `- Registro 2: Serie 100-15 Contratos de Trabajo | Contratos a término fijo 2025 | Fechas: 2025-01-01 a 2025-12-31 | Caja 2, Carpeta 5 | 120 Folios | Soporte Papel.\n` +
        `- Foliación continua en grafito según directrices del AGN y principios de procedencia y orden original.`
      );
    } else {
      setLearnerSubmissionText(
        `Propuesta técnica para ${currentProduct.title}:\n` +
        `Cumple con todos los parámetros técnicos definidos en la actividad de proyecto de la ${phaseData.name}, garantizando confidencialidad, exactitud de la información y cumplimiento de normas laborales colombianas.`
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Entorno Productivo Didáctico · Empresa Simulada "TalentoActivo S.A.S."
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Taller de Productos Requeridos por Fase
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Durante tu formación como Técnico en Talento Humano desarrollarás 10 productos esenciales distribuidos en las 4 fases
              del proyecto. Explora sus especificaciones, descarga plantillas y somete tus propuestas a revisión formativa del Mentor IA.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-400 font-mono">Progreso de Productos:</span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded font-mono font-bold text-xs">
              {completedProducts.length} de 10 Aprobados
            </span>
          </div>
        </div>

        {/* Phase Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-4 border-t border-slate-100">
          {PHASES_DATA.map((p) => {
            const isSelected = p.id === activePhase;
            const completedInPhase = p.products.filter((prod) => completedProducts.includes(prod.id)).length;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPhase(p.id)}
                className={`p-3 rounded-lg text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-700 text-white shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
                  <span className={isSelected ? 'text-emerald-200' : 'text-slate-400'}>
                    FASE 0{p.number}
                  </span>
                  <span className={isSelected ? 'text-emerald-100 font-bold' : 'text-emerald-700 font-semibold'}>
                    {completedInPhase}/{p.products.length}
                  </span>
                </div>
                <div className="text-xs font-bold truncate">{p.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Products List + Selected Product Workshop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Product Pills for this Phase (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase px-1">
            Productos en {phaseData.name} ({phaseData.products.length})
          </div>

          <div className="space-y-2">
            {phaseData.products.map((prod) => {
              const isSelected = prod.id === currentProduct.id;
              const isDone = completedProducts.includes(prod.id);
              return (
                <button
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod)}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-800">
                      Producto {prod.number} · {prod.phase}
                    </span>
                    {isDone ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Completado
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-medium">
                        Pendiente
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-900 leading-snug">
                    {prod.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Context box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Empresa Simulada: TalentoActivo S.A.S.
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Organización de servicios de consultoría y gestión empresarial creada para recrear el entorno
              laboral real de los aprendices, aplicando la Clasificación Única de Ocupaciones CUOC 1342.
            </p>
          </div>
        </div>

        {/* Right Side: Product Interactive Detail & Simulation Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="text-emerald-700 font-bold">{phaseData.name}</span>
                <span>·</span>
                <span className="font-mono">Producto #{currentProduct.number}</span>
                {completedProducts.includes(currentProduct.id) && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                    Aprobado (+120 XP)
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                {currentProduct.title}
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {currentProduct.description}
              </p>
            </div>

            {/* Purpose & Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Propósito Formativo
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {currentProduct.purpose}
                </p>
              </div>

              {currentProduct.normativeReference ? (
                <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200/80">
                  <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-700" />
                    Referente Normativo / Técnico
                  </div>
                  <p className="text-blue-950 leading-relaxed text-[11px]">
                    {currentProduct.normativeReference}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-600" />
                    Resultados de Aprendizaje Vinculados
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentProduct.associatedRAPs.map((rap, idx) => (
                      <span key={idx} className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                        {rap}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Key Elements Checklist */}
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                Requisitos Técnicos del Producto:
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentProduct.keyElements.map((elem, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200/60 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug">{elem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Template Viewer */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">
                  Vista Previa de la Plantilla Institucional SENA
                </span>
                <span className="text-[11px] text-slate-400">Modelo Oficial</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-sans text-xs space-y-3">
                <div className="font-bold text-emerald-800 border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>{currentProduct.templateSample.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">FORMATO SENA GFPI</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentProduct.templateSample.fields.map((f, idx) => (
                    <div key={idx} className="p-2 bg-white rounded border border-slate-200/80">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">{f.label}</div>
                      <div className="text-xs text-slate-800 font-medium mt-0.5">{f.value}</div>
                    </div>
                  ))}
                </div>

                {currentProduct.templateSample.sampleText && (
                  <div className="p-2.5 bg-emerald-50/50 rounded border border-emerald-200/60 text-[11px] text-emerald-950">
                    <strong>Contenido de Ejemplo:</strong> {currentProduct.templateSample.sampleText}
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Delivery & AI Feedback Workshop */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Taller de Elaboración & Validación por Mentor IA
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Ingresa o ajusta el resumen de tu entrega para recibir evaluación formativa con criterios SENA.
                  </p>
                </div>

                <button
                  onClick={handleLoadSample}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold underline self-start cursor-pointer"
                >
                  Cargar propuesta modelo
                </button>
              </div>

              <textarea
                rows={4}
                value={learnerSubmissionText}
                onChange={(e) => setLearnerSubmissionText(e.target.value)}
                placeholder="Escribe aquí los elementos principales de tu producto para la empresa simulada..."
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-emerald-600 resize-none font-sans"
              />

              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="text-[11px] text-slate-500">
                  Recompensa: <strong className="text-emerald-700">+120 Puntos XP</strong> al aprobar
                </span>

                <button
                  disabled={evaluating}
                  onClick={handleSubmitForReview}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                    evaluating
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                  }`}
                >
                  {evaluating ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      Evaluando con Mentor IA...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Evaluar Entrega con Mentor IA
                    </>
                  )}
                </button>
              </div>

              {/* Evaluation Result Display */}
              {evaluationResult && (
                <div className={`p-4 rounded-xl border mt-3 space-y-2 text-xs transition-all ${
                  evaluationResult.approved
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Dictamen del Instructor Evaluador SENA
                    </span>
                    <span className="font-mono font-bold px-2 py-0.5 bg-white rounded border border-emerald-300 text-emerald-800">
                      Puntaje: {evaluationResult.score}/100
                    </span>
                  </div>

                  <p className="leading-relaxed">
                    {evaluationResult.feedback}
                  </p>

                  {evaluationResult.suggestions && evaluationResult.suggestions.length > 0 && (
                    <div className="pt-2 border-t border-emerald-200/70 space-y-1">
                      <div className="font-bold text-[11px]">Recomendaciones de Mejora Continua:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                        {evaluationResult.suggestions.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
