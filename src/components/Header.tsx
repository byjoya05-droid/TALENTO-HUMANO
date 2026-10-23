import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Briefcase, 
  CheckCircle2, 
  Bot, 
  HardDrive,
  ShieldCheck,
  GraduationCap,
  Key,
  Share2,
  Copy,
  Check,
  Eye,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useRole } from '../context/RoleContext';
import { SENA_LOGO_DATA_URI } from '../assets/senaLogo';
import { AutoSyncBadge } from './AutoSyncBadge';

export type ActiveTab =
  | 'overview'
  | 'curriculum'
  | 'company'
  | 'evaluation'
  | 'gamification'
  | 'mentor'
  | 'certificate'
  | 'drive'
  | 'instructor_panel';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { profile, isEligibleForCertificate } = useGamification();
  const { role, setRole, isInstructor, isAprendiz, switchRoleWithPin, copyApprenticeLink, logoutRole } = useRole();

  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Dynamic Navigation Items based on Role
  const instructorNavItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'instructor_panel', label: 'Panel Instructor', icon: ShieldCheck },
    { id: 'overview', label: 'Proyecto Formativo', icon: BookOpen },
    { id: 'curriculum', label: 'Matriz Curricular', icon: Layers },
    { id: 'company', label: 'Empresa Simulada', icon: Briefcase },
    { id: 'evaluation', label: 'Evaluación & Retos', icon: CheckCircle2 },
    { id: 'gamification', label: 'Gamificación', icon: Sparkles },
    { id: 'mentor', label: 'Mentor IA', icon: Bot },
    { id: 'certificate', label: 'Certificación', icon: Award },
    { id: 'drive', label: 'Drive & Sheets', icon: HardDrive },
  ];

  const apprenticeNavItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Proyecto Formativo', icon: BookOpen },
    { id: 'curriculum', label: 'Matriz Curricular', icon: Layers },
    { id: 'company', label: 'Empresa Simulada', icon: Briefcase },
    { id: 'evaluation', label: 'Evaluación & Retos', icon: CheckCircle2 },
    { id: 'gamification', label: 'Gamificación', icon: Sparkles },
    { id: 'mentor', label: 'Mentor IA', icon: Bot },
    { id: 'certificate', label: 'Mi Certificado', icon: Award },
  ];

  const navItems = isInstructor ? instructorNavItems : apprenticeNavItems;

  const handleCopyApprenticeLink = async () => {
    const success = await copyApprenticeLink();
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = switchRoleWithPin('instructor', pinInput);
    if (success) {
      setShowPinModal(false);
      setPinInput('');
      setPinError(null);
      setActiveTab('instructor_panel');
    } else {
      setPinError('Clave incorrecta. Debes ingresar: CATA2026');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      {/* Top Notification / Role Switcher Strip */}
      <div className={`px-4 py-1.5 text-[11px] font-medium flex items-center justify-between border-b transition-colors ${
        isInstructor
          ? 'bg-slate-900 text-slate-200 border-slate-800'
          : 'bg-emerald-50 text-emerald-950 border-emerald-200'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isInstructor ? (
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Perfil Activo: INSTRUCTOR LÍDER (Control Total y Sincronización)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-semibold text-emerald-900">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                <span>Perfil Activo: APRENDIZ SENA — {profile.name} (Ficha {profile.ficha})</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isInstructor ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyApprenticeLink}
                  className="px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Copiar enlace restringido para compartir con los aprendices"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-300" /> : <Share2 className="w-3 h-3" />}
                  <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace Aprendices'}</span>
                </button>

                <button
                  onClick={() => {
                    setRole('aprendiz');
                    setActiveTab('overview');
                  }}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Cambiar temporalmente a la vista de los aprendices"
                >
                  <Eye className="w-3 h-3 text-slate-400" />
                  <span>Ver como Aprendiz</span>
                </button>

                <button
                  onClick={logoutRole}
                  className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Salir y volver a la pantalla de selección de rol"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Cambiar Rol / Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPinModal(true)}
                  className="px-2 py-0.5 rounded bg-emerald-200 hover:bg-emerald-300 text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Acceder como Instructor (Requiere clave CATA2026)"
                >
                  <Key className="w-3 h-3 text-emerald-800" />
                  <span>Acceso Instructor (Clave)</span>
                </button>

                <button
                  onClick={logoutRole}
                  className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Salir y volver a la pantalla de selección de rol"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Cambiar Rol / Salir</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab(isInstructor ? 'instructor_panel' : 'overview')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0 p-0.5">
                <img
                  src={SENA_LOGO_DATA_URI}
                  alt="Logo SENA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 tracking-tight text-base whitespace-nowrap">
                    SENA
                  </span>
                  <span className="text-emerald-700 font-semibold text-base whitespace-nowrap">
                    Talento Humano
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap hidden sm:block">
                  Programa 134207 · Ficha 2894501
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links based on role */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isCertTab = item.id === 'certificate';
              const isInstructorTab = item.id === 'instructor_panel';

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? isInstructorTab
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 font-semibold'
                      : isInstructorTab
                      ? 'text-emerald-800 font-bold bg-emerald-50/70 hover:bg-emerald-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? isInstructorTab
                          ? 'text-emerald-400'
                          : 'text-emerald-700'
                        : isCertTab && isEligibleForCertificate
                        ? 'text-amber-500 animate-bounce'
                        : isInstructorTab
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isCertTab && isEligibleForCertificate && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Indicators */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* AutoSync Badge (Only visible to instructor to prevent apprentice tampering) */}
            {isInstructor && <AutoSyncBadge />}

            {/* Level & XP pill button */}
            <button
              onClick={() => setActiveTab('gamification')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-xs cursor-pointer group"
              title="Ver estado de gamificación y misiones"
            >
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {profile.level}
                </span>
                <span className="hidden sm:inline">Nivel {profile.level}</span>
              </div>
              <span className="text-slate-300" aria-hidden="true">
                |
              </span>
              <div className="flex items-center gap-1 font-mono tabular-nums text-emerald-700 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{profile.xp.toLocaleString()} XP</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isInstructorTab = item.id === 'instructor_panel';
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? isInstructorTab
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-emerald-700 text-white font-medium'
                    : isInstructorTab
                    ? 'bg-emerald-50 text-emerald-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal for PIN Access when changing to Instructor mode */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Acceso al Perfil de Instructor</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Ingresa el PIN de seguridad del instructor para acceder al panel de gestión, seguimiento de aprendices y sincronización de Google Drive.
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Clave de Instructor:
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(null);
                  }}
                  placeholder="Ingresa CATA2026"
                  className="w-full text-center text-sm font-mono tracking-widest p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-600"
                  autoFocus
                  required
                />
                <div className="text-[10px] text-slate-400 mt-1">
                  Clave de seguridad autorizada: <strong className="text-slate-700">CATA2026</strong>.
                </div>
              </div>

              {pinError && (
                <div className="text-xs font-semibold text-rose-600 animate-in fade-in">
                  {pinError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false);
                    setPinInput('');
                    setPinError(null);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Ingresar como Instructor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
