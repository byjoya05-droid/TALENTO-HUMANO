import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  HardDrive, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Filter, 
  Search, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  Eye, 
  RefreshCw, 
  Sparkles, 
  BookOpen, 
  FileSpreadsheet, 
  GraduationCap,
  ArrowUpRight,
  TrendingUp,
  Download
} from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { useAutoSync } from '../context/AutoSyncContext';
import { PROGRAM_INFO } from '../data/senaData';
import { COHORT_LEARNERS, CohortLearner } from '../data/mockLearners';
import { GoogleDriveSyncPanel } from './GoogleDriveSyncPanel';

export const InstructorDashboard: React.FC = () => {
  const { setRole, apprenticeShareUrl, copyApprenticeLink } = useRole();
  const { spreadsheet, syncStatus, lastSyncedTime } = useAutoSync();

  const [activeSubTab, setActiveSubTab] = useState<'monitoring' | 'drive' | 'settings'>('monitoring');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Certificable' | 'En Formación' | 'En Riesgo'>('ALL');
  const [selectedLearner, setSelectedLearner] = useState<CohortLearner | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleCopyLink = async () => {
    const success = await copyApprenticeLink();
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Filter learners
  const filteredLearners = COHORT_LEARNERS.filter((lrn) => {
    if (statusFilter !== 'ALL' && lrn.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = lrn.name.toLowerCase().includes(q);
      const matchDoc = lrn.docNumber.includes(q);
      const matchEmail = lrn.email.toLowerCase().includes(q);
      return matchName || matchDoc || matchEmail;
    }
    return true;
  });

  // Calculate cohort statistics
  const totalLearners = COHORT_LEARNERS.length;
  const certificables = COHORT_LEARNERS.filter((l) => l.status === 'Certificable').length;
  const enFormacion = COHORT_LEARNERS.filter((l) => l.status === 'En Formación').length;
  const enRiesgo = COHORT_LEARNERS.filter((l) => l.status === 'En Riesgo').length;
  const avgApropiacion = Math.round(
    COHORT_LEARNERS.reduce((acc, curr) => acc + curr.apropiacionPercent, 0) / totalLearners
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner: Instructor Identity & Share Link */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white shadow-md border border-emerald-900/50 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 uppercase">
                  MÓDULO EXCLUSIVO DE INSTRUCTOR
                </span>
                <span className="text-xs text-emerald-300 font-mono">Ficha {PROGRAM_INFO.code} / 2894501</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Panel de Gestión y Seguimiento de Aprendices
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                {PROGRAM_INFO.center} · {PROGRAM_INFO.regional}
              </p>
            </div>
          </div>

          {/* Quick Action: Switch to Apprentice View to test student perspective */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={() => setRole('aprendiz')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
              title="Cambiar temporalmente al rol aprendiz para ver cómo exploran la plataforma"
            >
              <Eye className="w-4 h-4 text-emerald-300" />
              <span>Ver como Aprendiz</span>
            </button>
          </div>
        </div>

        {/* Shareable URL Box for Apprentices */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Enlace de Consulta para Compartir con los Aprendices:
              </span>
            </div>
            <span className="text-[11px] text-emerald-300">
              🛡️ Modo restringido: sin acceso a configuraciones ni a Google Drive
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Comparte este enlace por Microsoft Teams, Territorium, Zajuna o correo. Los aprendices accederán a toda la matriz pedagógica, gamificación, tutor IA y simuladores sin ver tus privilegios de instructor.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              readOnly
              value={apprenticeShareUrl}
              className="w-full text-xs font-mono p-2.5 bg-black/40 border border-white/20 rounded-lg text-emerald-200 select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>¡Enlace Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Enlace</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-[11px] text-slate-400">Total Aprendices Ficha</div>
            <div className="text-xl font-bold text-white mt-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>{totalLearners}</span>
            </div>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-[11px] text-slate-400">Apropiación Promedio</div>
            <div className="text-xl font-bold text-emerald-300 mt-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{avgApropiacion}%</span>
            </div>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-[11px] text-slate-400">Listos para Certificación</div>
            <div className="text-xl font-bold text-white mt-1 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{certificables} / {totalLearners}</span>
            </div>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-[11px] text-slate-400">Almacenamiento Drive</div>
            <div className="text-sm font-bold text-emerald-300 mt-1 flex items-center gap-1.5 truncate">
              <HardDrive className="w-4 h-4 shrink-0" />
              <span className="truncate">{spreadsheet ? 'Sincronizado' : 'Pendiente'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('monitoring')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'monitoring'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Seguimiento de Aprendices ({totalLearners})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('drive')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'drive'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Gestión Google Drive & Sheets</span>
          {spreadsheet && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {/* SUBTAB 1: APPRENTICE COHORT MONITORING */}
      {activeSubTab === 'monitoring' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar aprendiz por nombre, cédula o correo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:outline-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-emerald-600 cursor-pointer"
              >
                <option value="ALL">Todos los Estados ({totalLearners})</option>
                <option value="Certificable">Certificables ({certificables})</option>
                <option value="En Formación">En Formación ({enFormacion})</option>
                <option value="En Riesgo">En Riesgo ({enRiesgo})</option>
              </select>
            </div>
          </div>

          {/* Table of Cohort Learners */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="p-3">Aprendiz SENA</th>
                    <th className="p-3">Documento & Ficha</th>
                    <th className="p-3">Nivel / XP</th>
                    <th className="p-3">Apropiación Curricular</th>
                    <th className="p-3">Entregables Empresa (10)</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLearners.map((lrn) => (
                    <tr key={lrn.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-slate-900 text-xs">{lrn.name}</div>
                        <div className="text-[11px] text-slate-500">{lrn.email}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">
                        <div>C.C. {lrn.docNumber}</div>
                        <div className="text-slate-400">Ficha {lrn.ficha}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        <span className="font-bold text-emerald-800">Nivel {lrn.level}</span>
                        <div className="text-slate-500">{lrn.xp.toLocaleString()} XP</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                lrn.apropiacionPercent >= 80
                                  ? 'bg-emerald-600'
                                  : lrn.apropiacionPercent >= 60
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${lrn.apropiacionPercent}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-800 font-mono text-[11px]">
                            {lrn.apropiacionPercent}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        <span className="font-bold text-slate-900">{lrn.completedProducts}</span>
                        <span className="text-slate-400"> / 10 productos</span>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          lrn.status === 'Certificable'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lrn.status === 'En Formación'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {lrn.status === 'Certificable' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {lrn.status === 'En Formación' && <Clock className="w-3 h-3 text-amber-600" />}
                          {lrn.status === 'En Riesgo' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                          <span>{lrn.status}</span>
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedLearner(lrn)}
                          className="px-2.5 py-1 text-xs text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-semibold cursor-pointer transition-colors"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal / Panel: Detalle del Aprendiz Seleccionado */}
          {selectedLearner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      FICHA DEL APRENDIZ
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {selectedLearner.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      C.C. {selectedLearner.docNumber} · Ficha {selectedLearner.ficha} · {selectedLearner.email}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLearner(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Progress summary */}
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-slate-500">Apropiación</div>
                    <div className="text-base font-bold text-emerald-700 mt-0.5">
                      {selectedLearner.apropiacionPercent}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-slate-500">Puntaje Diagnóstico</div>
                    <div className="text-base font-bold text-slate-800 mt-0.5">
                      {selectedLearner.diagnosticScore} / 100
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-slate-500">Nivel & XP</div>
                    <div className="text-base font-bold text-slate-800 mt-0.5">
                      Nivel {selectedLearner.level} ({selectedLearner.xp} XP)
                    </div>
                  </div>
                </div>

                {/* Check of the 10 deliverables */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Estado de los 10 Entregables de la Empresa Simulada:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedLearner.productsStatus.prod1 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <span>1. Presentación de procesos TH</span>
                      {selectedLearner.productsStatus.prod1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedLearner.productsStatus.prod2 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <span>2. Cronograma de actividades</span>
                      {selectedLearner.productsStatus.prod2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedLearner.productsStatus.prod3 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <span>3. Estructura empresa simulada</span>
                      {selectedLearner.productsStatus.prod3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedLearner.productsStatus.prod4 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <span>4. Documentos de procesos TH</span>
                      {selectedLearner.productsStatus.prod4 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedLearner.productsStatus.prod5 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <span>5. Registros físicos y digitales</span>
                      {selectedLearner.productsStatus.prod5 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedLearner.productsStatus.prod6 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <span>6. Agenda reuniones y eventos</span>
                      {selectedLearner.productsStatus.prod6 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedLearner.productsStatus.prod7 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <span>7. Presentaciones automatizadas</span>
                      {selectedLearner.productsStatus.prod7 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedLearner.productsStatus.prod8 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <span>8. Historia laboral simulada</span>
                      {selectedLearner.productsStatus.prod8 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedLearner.productsStatus.prod9 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <span>9. Formato Único Inventario FUID</span>
                      {selectedLearner.productsStatus.prod9 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${selectedLearner.productsStatus.prod10 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <span>10. Informe final de resultados</span>
                      {selectedLearner.productsStatus.prod10 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedLearner(null)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: GOOGLE DRIVE & SHEETS CONTROL (INSTRUCTOR ONLY) */}
      {activeSubTab === 'drive' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Privilegio de Instructor: </strong>
              Esta sección solo es accesible desde tu perfil de instructor. Los aprendices que accedan mediante el enlace compartido <strong>NO</strong> verán este panel ni podrán alterar la configuración de Google Drive.
            </div>
          </div>

          <GoogleDriveSyncPanel />
        </div>
      )}
    </div>
  );
};
