import React, { useState } from 'react';
import { 
  Building2, 
  Target, 
  Calendar, 
  Clock, 
  Layers, 
  CheckCircle2, 
  GraduationCap, 
  Cpu, 
  Users, 
  Compass, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PROGRAM_INFO, PHASES_DATA } from '../data/senaData';
import { useGamification } from '../context/GamificationContext';
import { SENA_LOGO_DATA_URI } from '../assets/senaLogo';

interface OverviewModuleProps {
  onNavigateTab: (tab: any) => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({ onNavigateTab }) => {
  const { addXp, completeMission, profile } = useGamification();
  const [selectedPhase, setSelectedPhase] = useState<'ANALISIS' | 'PLANEACION' | 'EJECUCION' | 'EVALUACION'>('ANALISIS');

  const activePhaseData = PHASES_DATA.find((p) => p.id === selectedPhase) || PHASES_DATA[0];

  const handleExploreProject = () => {
    completeMission('mis-1');
    addXp(50, 'Exploración de la estructura del proyecto formativo');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Official SENA Academic Styling */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-10 shadow-lg border border-emerald-900/50">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-300">
                <span>SENA · REGIONAL DISTRITO CAPITAL</span>
                <span>·</span>
                <span>CENTRO DE GESTIÓN ADMINISTRATIVA</span>
                <span>·</span>
                <span>CÓDIGO 134207</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Programa de Formación: <span className="text-emerald-400">Técnico en Talento Humano</span>
              </h1>
            </div>
            <div className="w-14 h-14 bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-xs shrink-0 flex items-center justify-center">
              <img src={SENA_LOGO_DATA_URI} alt="Logo SENA" className="w-full h-full object-contain" />
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Prototipo educativo inteligente diseñado para que los aprendices comprendan, apropien y dominen
            de manera integral todos los componentes de su proceso formativo: articulando el 
            <strong className="text-white"> Proyecto Formativo 3456077</strong>, las competencias laborales, los resultados de aprendizaje (RAPs), 
            los conocimientos del <strong className="text-white">Saber, Saber Hacer y Ser</strong>, y los productos de la empresa simulada.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-800/40">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" /> Duración Total
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                {PROGRAM_INFO.totalHours} <span className="text-xs font-normal text-slate-300">horas</span>
              </div>
              <div className="text-[10px] text-slate-400">1344h Lectiva + 864h Productiva</div>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5" /> Tiempo Ejecución
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                15 <span className="text-xs font-normal text-slate-300">meses</span>
              </div>
              <div className="text-[10px] text-slate-400">4 Fases Formativas</div>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                <Building2 className="w-3.5 h-3.5" /> Campo CUOC
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                1342
              </div>
              <div className="text-[10px] text-slate-400">Auxiliares de Talento Humano</div>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                <GraduationCap className="w-3.5 h-3.5" /> Certificación
              </div>
              <div className="text-sm font-semibold text-emerald-200 mt-1 truncate">
                Técnico Laboral
              </div>
              <div className="text-[10px] text-slate-400">Acreditación Oficial SENA</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('curriculum')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              Explorar Matriz Curricular
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('company')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              Ver Empresa Simulada & Productos
            </button>
          </div>
        </div>
      </div>

      {/* Proyecto Formativo Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Proyecto Formativo SOFIA Plus · Código {PROGRAM_INFO.projectCode}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              {PROGRAM_INFO.projectName}
            </h2>
          </div>
          <button
            onClick={handleExploreProject}
            className="self-start md:self-auto px-3.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Completar Misión de Inducción (+100 XP)
          </button>
        </div>

        {/* General Objective Callout */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
            <Target className="w-4 h-4 text-emerald-600" />
            Objetivo General del Proyecto
          </div>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            "{PROGRAM_INFO.generalObjective}"
          </p>
        </div>

        {/* 4 Specific Objectives */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Objetivos Específicos del Proyecto Formativo (Relacionados con las 4 Fases)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROGRAM_INFO.specificObjectives.map((obj, idx) => {
              const phaseNames = ['Fase de Análisis', 'Fase de Planeación', 'Fase de Ejecución', 'Fase de Evaluación'];
              const phaseKeys: ('ANALISIS' | 'PLANEACION' | 'EJECUCION' | 'EVALUACION')[] = ['ANALISIS', 'PLANEACION', 'EJECUCION', 'EVALUACION'];
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPhase(phaseKeys[idx])}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    selectedPhase === phaseKeys[idx]
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-emerald-700">0{idx + 1}. {phaseNames[idx]}</span>
                    <span className="text-[11px] font-mono text-slate-400">Hito {idx + 1}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {obj}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Phase Flow Navigator */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Las 4 Fases del Proyecto Formativo
            </h2>
            <p className="text-xs text-slate-500">
              Selecciona una fase para explorar su actividad de proyecto, duración y productos entregables en la empresa simulada.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Ciclo PHVA SENA
          </div>
        </div>

        {/* Phase Stepper Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PHASES_DATA.map((phase) => {
            const isSelected = selectedPhase === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`p-3 rounded-lg text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-700 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                    Fase 0{phase.number}
                  </span>
                  <span className={`text-[10px] font-semibold ${isSelected ? 'text-emerald-100' : 'text-emerald-700'}`}>
                    {phase.durationMonths} meses
                  </span>
                </div>
                <div className="font-bold text-sm truncate">{phase.name.replace('Fase de ', '')}</div>
                <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {phase.products.length} {phase.products.length === 1 ? 'Producto' : 'Productos'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Phase Detail Card */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-xs font-mono text-emerald-700 font-semibold uppercase">
                Fase Seleccionada: {activePhaseData.name}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Actividad de Proyecto
              </h3>
            </div>
            <div className="text-xs text-slate-500">
              Duración estimada: <strong className="text-slate-800">{activePhaseData.durationMonths} meses</strong>
            </div>
          </div>

          <div className="text-sm text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200/60 leading-relaxed font-medium">
            "{activePhaseData.projectActivity}"
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Productos Exigidos para la Empresa Simulada en esta Fase:
            </h4>
            <div className="space-y-2">
              {activePhaseData.products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">
                      {prod.number}. {prod.title}
                    </div>
                    <p className="text-slate-600 leading-normal">
                      {prod.description}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('company')}
                    className="shrink-0 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors"
                  >
                    Ver Taller
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Perfil Ocupacional CUOC 1342 & 4 Fuentes de Conocimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CUOC 1342 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              CUOC
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Perfil de Egreso · Auxiliar de Talento Humano
              </h3>
              <div className="text-xs text-slate-500">
                Clasificación Única de Ocupaciones para Colombia (Código 1342)
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            El egresado está capacitado para apoyar procesos operativos de provisión de cargos, contratación,
            seguridad social, inducción, bienestar y evaluación del desempeño, administrando registros físicos,
            digitales y electrónicos con estricto apego a la normatividad técnica y legal vigente.
          </p>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-900">Funciones Principales en la Empresa:</div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Actualizar y custodiar el expediente de historia laboral bajo directrices archivísticas.</li>
              <li>Tramitar, verificar y registrar novedades de personal en sistemas ofimáticos y HRIS.</li>
              <li>Apoyar procesos de reclutamiento, preselección, entrevistas y exámenes médicos.</li>
              <li>Gestionar afiliaciones al Sistema General de Seguridad Social (Salud, Pensión, ARL, CCF).</li>
              <li>Diligenciar el Formato Único de Inventario Documental (FUID) para archivo de gestión.</li>
            </ul>
          </div>
        </div>

        {/* Las 4 Fuentes del Conocimiento SENA */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <Compass className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Las 4 Fuentes de Construcción del Conocimiento SENA
              </h3>
              <div className="text-xs text-slate-500">
                Modelo pedagógico para la formación profesional integral
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            La metodología SENA estimula la autocrítica y la autonomía del aprendiz mediante la vinculación activa
            de cuatro fuentes esenciales:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                1. El Instructor - Tutor
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Orientador del aprendizaje, guía técnico y facilitador de las situaciones problema.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                2. El Entorno Productivo
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                La empresa simulada, el contexto real laboral y el marco normativo legal.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-600" />
                3. Las TIC & IA
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Herramientas ofimáticas, gestores de bases de datos, biblioteca digital e IA tutora.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                4. Trabajo Colaborativo
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Construcción conjunta con pares de equipo en la ficha y resolución de casos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
