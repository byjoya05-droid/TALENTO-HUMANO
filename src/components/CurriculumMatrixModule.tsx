import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  BookOpen, 
  CheckSquare, 
  Heart, 
  Wrench, 
  Lightbulb, 
  ChevronRight, 
  Sparkles,
  Calendar,
  Building2,
  CheckCircle2,
  ArrowRight,
  Filter,
  Columns
} from 'lucide-react';
import { COMPETENCIES_DATA, PHASES_DATA, PROGRAM_INFO } from '../data/senaData';
import { ProjectPhase, LearningOutcome } from '../types/sena';
import { useGamification } from '../context/GamificationContext';

export const CurriculumMatrixModule: React.FC = () => {
  const { addXp, completeMission } = useGamification();
  // Default to Phase 1: Análisis so it's immediately organized by phase
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase>('ANALISIS');
  const [viewMode, setViewMode] = useState<'by-phase' | 'all-phases'>('by-phase');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompetencyFilter, setSelectedCompetencyFilter] = useState<string>('ALL');
  const [expandedRapCode, setExpandedRapCode] = useState<string>('730069');
  const [activeKnowledgeTab, setActiveKnowledgeTab] = useState<'saber' | 'hacer' | 'ser' | 'criterios'>('saber');

  // Flatten all learning outcomes with competency metadata
  const allOutcomes: (LearningOutcome & { 
    competencyName: string; 
    competencyNorm: string; 
    competencyType: 'Tecnica' | 'Transversal' | 'Basica';
  })[] = [];

  COMPETENCIES_DATA.forEach((comp) => {
    comp.outcomes.forEach((outcome) => {
      allOutcomes.push({
        ...outcome,
        competencyName: comp.name,
        competencyNorm: comp.unitNorm,
        competencyType: comp.type,
      });
    });
  });

  const phasesList: ProjectPhase[] = ['ANALISIS', 'PLANEACION', 'EJECUCION', 'EVALUACION'];

  // Helper to filter outcomes for a specific phase
  const getOutcomesForPhase = (phaseId: ProjectPhase) => {
    return allOutcomes.filter((item) => {
      if (item.phase !== phaseId) return false;
      if (selectedCompetencyFilter !== 'ALL' && item.competencyCode !== selectedCompetencyFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchComp = item.competencyName.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchNumber = item.number.toLowerCase().includes(q);
        const matchSaber = item.knowledgeSaber.some((s) => s.toLowerCase().includes(q));
        const matchHacer = item.knowledgeSaberHacer.some((s) => s.toLowerCase().includes(q));
        const matchCriterios = item.evaluationCriteria.some((c) => c.toLowerCase().includes(q));
        return matchTitle || matchComp || matchCode || matchNumber || matchSaber || matchHacer || matchCriterios;
      }
      return true;
    });
  };

  const handleInspectRap = (rapCode: string) => {
    setExpandedRapCode(rapCode);
    completeMission('mis-2');
    addXp(30, 'Inspección de alineación curricular Saber-Hacer-Ser');
  };

  const currentOutcome = allOutcomes.find((o) => o.code === expandedRapCode) || allOutcomes[0];
  const currentPhaseData = PHASES_DATA.find((p) => p.id === currentOutcome?.phase);
  const activePhaseMeta = PHASES_DATA.find((p) => p.id === selectedPhase) || PHASES_DATA[0];

  const phaseOutcomes = getOutcomesForPhase(selectedPhase);
  const technicalOutcomes = phaseOutcomes.filter((o) => o.competencyType === 'Tecnica');
  const transversalOutcomes = phaseOutcomes.filter((o) => o.competencyType !== 'Tecnica');

  return (
    <div className="space-y-6 pb-12">
      {/* Module Title & Context */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Alineación Curricular Integral · Programa {PROGRAM_INFO.code}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Matriz Curricular: Resultados de Aprendizaje (RA) Organizados por Cada Fase
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Los Resultados de Aprendizaje (RA) se encuentran articulados de manera lógica a las 4 Fases del Proyecto Formativo 3456077.
              Explora cada fase para comprender su <strong>Actividad de Proyecto</strong>, sus <strong>RAs técnicos y transversales</strong>, 
              y su desglose en <strong>Saber, Saber Hacer, Ser y Criterios de Evaluación</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setViewMode('by-phase')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'by-phase'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vista Fase a Fase
              </button>
              <button
                onClick={() => setViewMode('all-phases')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'all-phases'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Tablero 4 Fases</span>
              </button>
            </div>
          </div>
        </div>

        {/* Phase Navigation Tabs - Large & Clear */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          {PHASES_DATA.map((p) => {
            const isSelected = selectedPhase === p.id;
            const count = allOutcomes.filter((o) => o.phase === p.id).length;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPhase(p.id);
                  setViewMode('by-phase');
                  const firstOfPhase = allOutcomes.find((o) => o.phase === p.id);
                  if (firstOfPhase) setExpandedRapCode(firstOfPhase.code);
                }}
                className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                  isSelected && viewMode === 'by-phase'
                    ? 'border-emerald-600 bg-emerald-700 text-white shadow-md ring-2 ring-emerald-600/30'
                    : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className={isSelected && viewMode === 'by-phase' ? 'text-emerald-200 font-bold' : 'text-slate-400 font-bold'}>
                    FASE 0{p.number}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isSelected && viewMode === 'by-phase' ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {count} RAs
                  </span>
                </div>
                <div className="text-sm font-bold truncate">{p.name}</div>
                <div className={`text-[10px] mt-0.5 truncate ${
                  isSelected && viewMode === 'by-phase' ? 'text-emerald-100' : 'text-slate-500'
                }`}>
                  {p.durationMonths} meses · {p.products.length} {p.products.length === 1 ? 'Producto' : 'Productos'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Search & Competency Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar en todos los RAs (título, saber, hacer, criterios)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-slate-800 focus:outline-emerald-600"
            />
          </div>

          <div>
            <select
              value={selectedCompetencyFilter}
              onChange={(e) => setSelectedCompetencyFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-emerald-600 cursor-pointer"
            >
              <option value="ALL">Todas las Competencias</option>
              {COMPETENCIES_DATA.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: BY PHASE (FASE A FASE CON DETALLE) */}
      {viewMode === 'by-phase' && (
        <div className="space-y-6">
          {/* Phase Banner Information */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-xl p-5 shadow-xs border border-emerald-900/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono font-bold text-xs rounded">
                  FASE 0{activePhaseMeta.number}
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {activePhaseMeta.name.toUpperCase()}
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-200 font-mono">
                <span>Duración: {activePhaseMeta.durationMonths} meses</span>
                <span>·</span>
                <span>{phaseOutcomes.length} Resultados de Aprendizaje</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide">
                Actividad de Proyecto en esta Fase:
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed italic bg-white/5 p-3 rounded-lg border border-white/10">
                "{activePhaseMeta.projectActivity}"
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-emerald-300 font-bold">Productos de la Empresa Simulada en esta Fase:</span>
              {activePhaseMeta.products.map((p) => (
                <span key={p.id} className="bg-white/10 text-white px-2.5 py-0.5 rounded text-[11px] font-medium border border-white/10">
                  {p.number}. {p.title}
                </span>
              ))}
            </div>
          </div>

          {/* Two-Column Explorer: Left = RAs in this Phase, Right = Selected RA Pedagogical Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: RAs belonging strictly to this Phase (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Technical Outcomes */}
              {technicalOutcomes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase px-1">
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <Wrench className="w-3.5 h-3.5" />
                      RAs de Competencias Técnicas ({technicalOutcomes.length})
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Talento Humano & Ofimática</span>
                  </div>

                  <div className="space-y-2">
                    {technicalOutcomes.map((item) => {
                      const isSelected = item.code === (currentOutcome?.code || '');
                      return (
                        <button
                          key={item.code}
                          onClick={() => handleInspectRap(item.code)}
                          className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600/30'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] font-mono font-bold text-emerald-800">
                              {item.number} · Código {item.code}
                            </span>
                            <span className="text-[10px] font-mono font-semibold text-slate-500">
                              Norma {item.competencyCode}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">
                            {item.title}
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span className="truncate max-w-[200px]">{item.competencyName}</span>
                            <span className="text-emerald-700 font-bold flex items-center gap-0.5 shrink-0">
                              Inspeccionar
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Transversal Outcomes */}
              {transversalOutcomes.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase px-1">
                    <span className="flex items-center gap-1.5 text-blue-800">
                      <BookOpen className="w-3.5 h-3.5" />
                      RAs de Competencias Transversales & Básicas ({transversalOutcomes.length})
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">SST, Paz, Ética, Inglés</span>
                  </div>

                  <div className="space-y-2">
                    {transversalOutcomes.map((item) => {
                      const isSelected = item.code === (currentOutcome?.code || '');
                      return (
                        <button
                          key={item.code}
                          onClick={() => handleInspectRap(item.code)}
                          className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600/30'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] font-mono font-bold text-blue-800">
                              {item.number} · Código {item.code}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              Norma {item.competencyCode}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">
                            {item.title}
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span className="truncate max-w-[200px]">{item.competencyName}</span>
                            <span className="text-blue-700 font-bold flex items-center gap-0.5 shrink-0">
                              Inspeccionar
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Deep Pedagogical Breakdown for Selected RA (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="text-emerald-700 font-bold">Fase de {currentOutcome.phase}</span>
                  <span>·</span>
                  <span>Norma {currentOutcome.competencyCode}</span>
                  <span>·</span>
                  <span className="font-mono text-slate-800 font-bold">{currentOutcome.number}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {currentOutcome.title}
                </h2>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-slate-900">Competencia Asociada:</div>
                  <div className="text-slate-600">
                    <strong className="text-slate-800">{currentOutcome.competencyName}</strong> ({currentOutcome.competencyNorm})
                  </div>
                </div>
              </div>

              {/* Context Alignment Callout */}
              {currentPhaseData && (
                <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                    Articulación con el Proyecto en la {currentPhaseData.name}:
                  </div>
                  <p className="text-emerald-950 font-medium leading-relaxed">
                    "{currentPhaseData.projectActivity}"
                  </p>
                </div>
              )}

              {/* Knowledge Classification Tabs */}
              <div className="space-y-4">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
                  <button
                    onClick={() => setActiveKnowledgeTab('saber')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0 ${
                      activeKnowledgeTab === 'saber'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Saber (Conceptos)</span>
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-500">
                      {currentOutcome.knowledgeSaber.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveKnowledgeTab('hacer')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0 ${
                      activeKnowledgeTab === 'hacer'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Saber Hacer (Procesos)</span>
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-500">
                      {currentOutcome.knowledgeSaberHacer.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveKnowledgeTab('ser')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0 ${
                      activeKnowledgeTab === 'ser'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Ser (Actitudinal)</span>
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-500">
                      {currentOutcome.knowledgeSer.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveKnowledgeTab('criterios')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0 ${
                      activeKnowledgeTab === 'criterios'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                    <span>Criterios Evaluación</span>
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-500">
                      {currentOutcome.evaluationCriteria.length}
                    </span>
                  </button>
                </div>

                {/* Tab Content Display */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 min-h-[220px]">
                  {activeKnowledgeTab === 'saber' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          Conocimientos Conceptuales y de Principios (El "Saber")
                        </span>
                        <span className="text-[11px] font-normal text-slate-500">Marco teórico & normativo</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Fundamentos cognitivos, normas legales, estándares técnicos y teorías administrativas requeridas.
                      </p>
                      <ul className="space-y-2 pt-1">
                        {currentOutcome.knowledgeSaber.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/60">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeKnowledgeTab === 'hacer' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <Wrench className="w-4 h-4 text-emerald-600" />
                          Conocimientos de Proceso y Procedimientos (El "Saber Hacer")
                        </span>
                        <span className="text-[11px] font-normal text-slate-500">Habilidades técnicas</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Habilidades operativas y técnicas: diligenciamiento de formatos, tramitación, manejo ofimático y archivo.
                      </p>
                      <ul className="space-y-2 pt-1">
                        {currentOutcome.knowledgeSaberHacer.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/60">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeKnowledgeTab === 'ser' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-rose-500" />
                          Conocimientos Actitudinales, Conductuales y Valores (El "Ser")
                        </span>
                        <span className="text-[11px] font-normal text-slate-500">Ética & Ciudadanía</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Valores éticos, confidencialidad, comunicación asertiva, empatía y respeto por la dignidad humana.
                      </p>
                      <ul className="space-y-2 pt-1">
                        {currentOutcome.knowledgeSer.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/60">
                            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeKnowledgeTab === 'criterios' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4 text-amber-600" />
                          Criterios de Evaluación Oficiales SENA
                        </span>
                        <span className="text-[11px] font-normal text-slate-500">Pautas de Calificación</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Criterios objetivos con los que el instructor SENA califica y certifica el logro de este resultado de aprendizaje.
                      </p>
                      <ul className="space-y-2 pt-1">
                        {currentOutcome.evaluationCriteria.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/60">
                            <CheckSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span className="leading-relaxed font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Validation & XP CTA */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-slate-700">
                    ¿Has interiorizado este Resultado de Aprendizaje para la {currentPhaseData?.name}?
                  </span>
                </div>
                <button
                  onClick={() => {
                    addXp(40, `Validación técnica de ${currentOutcome.number}`);
                    completeMission('mis-2');
                  }}
                  className="shrink-0 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Validar Apropiación (+40 XP)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: TABLERO COMPARATIVO DE LAS 4 FASES */}
      {viewMode === 'all-phases' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Tablero Comparativo de las 4 Fases del Proyecto Formativo
            </h2>
            <p className="text-xs text-slate-500">
              Visualiza en columnas paralelas todos los Resultados de Aprendizaje articulados cronológicamente desde el Análisis hasta la Evaluación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {phasesList.map((phaseId) => {
              const phaseMeta = PHASES_DATA.find((p) => p.id === phaseId)!;
              const outcomesInPhase = getOutcomesForPhase(phaseId);

              return (
                <div key={phaseId} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[750px]">
                  {/* Phase Column Header */}
                  <div className="p-3.5 bg-slate-900 text-white space-y-1 shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">
                        FASE 0{phaseMeta.number}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-300 font-bold">
                        {outcomesInPhase.length} RAs
                      </span>
                    </div>

                    <h3 className="font-bold text-sm tracking-tight text-white">
                      {phaseMeta.name.toUpperCase()}
                    </h3>

                    <p className="text-[10px] text-slate-300 line-clamp-2 italic">
                      "{phaseMeta.projectActivity}"
                    </p>
                  </div>

                  {/* Deliverables summary strip */}
                  <div className="bg-slate-50 p-2.5 border-b border-slate-200 text-[11px] text-slate-600 shrink-0">
                    <span className="font-bold text-slate-800">Entregables: </span>
                    <span>{phaseMeta.products.map((p) => p.number + '. ' + p.title.slice(0, 24) + '...').join(' | ')}</span>
                  </div>

                  {/* List of Outcomes inside the phase */}
                  <div className="p-2 space-y-2 overflow-y-auto flex-1 divide-y divide-slate-100">
                    {outcomesInPhase.map((item) => {
                      const isSelected = item.code === (currentOutcome?.code || '');
                      return (
                        <div
                          key={item.code}
                          onClick={() => {
                            handleInspectRap(item.code);
                            setSelectedPhase(item.phase);
                            setViewMode('by-phase');
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/80 shadow-xs'
                              : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="font-mono font-bold text-emerald-800">
                              {item.number} · {item.code}
                            </span>
                            <span className="text-slate-400 font-mono text-[9px]">
                              {item.competencyCode}
                            </span>
                          </div>

                          <div className="text-[11px] font-semibold text-slate-900 leading-snug line-clamp-2">
                            {item.title}
                          </div>

                          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                            <span className="truncate max-w-[140px]">{item.competencyName}</span>
                            <span className="text-emerald-700 font-bold">Ver</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
