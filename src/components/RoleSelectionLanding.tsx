import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  Key, 
  User, 
  FileSpreadsheet, 
  Layers, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Eye, 
  EyeOff, 
  School, 
  Mail, 
  Users, 
  AlertCircle, 
  Sparkles,
  BookOpen,
  ArrowLeft,
  IdCard,
  Briefcase
} from 'lucide-react';
import { useRole, INSTRUCTOR_PASSCODE, AprendizCharacterization } from '../context/RoleContext';
import { useGamification } from '../context/GamificationContext';
import { SENA_LOGO_DATA_URI } from '../assets/senaLogo';
import { PROGRAM_INFO } from '../data/senaData';

type LandingView = 'selection' | 'instructor_auth' | 'aprendiz_form';

export const RoleSelectionLanding: React.FC = () => {
  const { loginAsInstructor, loginAsAprendiz } = useRole();
  const { profile, updateProfile } = useGamification();

  // Navigation flow state: 'selection' (default two buttons), 'instructor_auth', or 'aprendiz_form'
  const [activeView, setActiveView] = useState<LandingView>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('role') === 'aprendiz') return 'aprendiz_form';
      if (params.get('role') === 'instructor') return 'instructor_auth';
    }
    return 'selection';
  });

  // Instructor Passcode state
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [instructorError, setInstructorError] = useState<string | null>(null);

  // Aprendiz Characterization Form State
  const [aprendizData, setAprendizData] = useState<AprendizCharacterization>({
    name: profile.name || '',
    documentType: profile.documentType || 'Cédula de Ciudadanía (CC)',
    documentNumber: profile.documentNumber || '',
    ficha: profile.ficha || '2894501',
    center: profile.center || 'Centro de Gestión Administrativa (CGA)',
    regional: profile.regional || 'Regional Distrito Capital',
    email: profile.email || '',
    teamName: profile.teamName || 'GAES 1 - Consultores TH',
  });
  const [aprendizError, setAprendizError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role');
      if (urlRole === 'aprendiz') {
        setActiveView('aprendiz_form');
      } else if (urlRole === 'instructor') {
        setActiveView('instructor_auth');
      }
    }
  }, []);

  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInstructorError(null);

    const clean = passcode.trim();
    if (!clean) {
      setInstructorError('Por favor ingresa la contraseña.');
      return;
    }

    const result = loginAsInstructor(clean);
    if (!result.success) {
      setInstructorError('Contraseña incorrecta. Debes ingresar la contraseña autorizada: cata2026');
    }
  };

  const handleAprendizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAprendizError(null);

    if (!aprendizData.name.trim()) {
      setAprendizError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!aprendizData.documentNumber.trim()) {
      setAprendizError('Por favor ingresa tu número de ID o documento.');
      return;
    }
    if (!aprendizData.ficha.trim()) {
      setAprendizError('Por favor ingresa el número de ficha.');
      return;
    }

    // Persist to Gamification profile and session
    updateProfile({
      name: aprendizData.name.trim(),
      documentType: aprendizData.documentType,
      documentNumber: aprendizData.documentNumber.trim(),
      ficha: aprendizData.ficha.trim(),
      center: aprendizData.center.trim(),
      regional: aprendizData.regional.trim(),
      email: aprendizData.email.trim(),
      teamName: aprendizData.teamName.trim(),
    });

    // Authorize apprentice into the app
    loginAsAprendiz(aprendizData);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] flex flex-col justify-between text-slate-100 p-4 sm:p-6 lg:p-8">
      
      {/* Top Institutional Header */}
      <header className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-white rounded-xl p-1.5 shadow-md flex items-center justify-center shrink-0">
            <img
              src={SENA_LOGO_DATA_URI}
              alt="Logo SENA"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-lg tracking-tight">SENA</span>
              <span className="text-emerald-400 font-semibold text-lg">Talento Humano</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Oficial
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Programa {PROGRAM_INFO.code} · Proyecto {PROGRAM_INFO.projectCode} · Ficha 2894501
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-xs font-semibold text-slate-200">{PROGRAM_INFO.center}</div>
          <div className="text-[11px] text-slate-400">{PROGRAM_INFO.regional} · Colombia</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto my-auto py-8">
        
        {/* ========================================================= */}
        {/* VIEW 1: INITIAL TWO BIG BUTTONS (SELECCIÓN DE ROL)       */}
        {/* ========================================================= */}
        {activeView === 'selection' && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Hero Heading */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Puerta de Entrada al Prototipo Formativo</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Ambiente Virtual de Aprendizaje
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Selecciona tu rol para ingresar con la configuración y privilegios correspondientes.
              </p>
            </div>

            {/* TWO BIG BUTTONS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4">
              
              {/* BIG BUTTON 1: ACCEDER COMO APRENDIZ */}
              <div className="group relative bg-slate-900/90 hover:bg-slate-900 border-2 border-emerald-500/30 hover:border-emerald-400 rounded-3xl p-7 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Sin Contraseña
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    Rol Aprendiz
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Accede al espacio pedagógico, retos, simulación de procesos de gestión humana, tutor IA y certificación digital.
                  </p>

                  <div className="space-y-2 mb-6 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Requiere diligenciar datos de caracterización</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Exploración interactiva del proyecto formativo</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('aprendiz_form')}
                  className="w-full py-4 px-6 rounded-2xl font-black text-base text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-400/30"
                >
                  <GraduationCap className="w-5 h-5 text-slate-950" />
                  <span>Acceder como Aprendiz</span>
                  <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* BIG BUTTON 2: ACCEDER COMO INSTRUCTOR */}
              <div className="group relative bg-slate-900/90 hover:bg-slate-900 border-2 border-slate-700/80 hover:border-emerald-500/60 rounded-3xl p-7 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-slate-900/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Requiere Contraseña</span>
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    Rol Instructor
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Control total del prototipo, panel de seguimiento de cohorte, sincronización con Google Drive y enlace para aprendices.
                  </p>

                  <div className="space-y-2 mb-6 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Acceso seguro mediante clave de instructor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Sincronización en la nube con Google Sheets</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('instructor_auth')}
                  className="w-full py-4 px-6 rounded-2xl font-black text-base text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-600 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg group-hover:shadow-emerald-900/20"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Acceder como Instructor</span>
                  <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: INSTRUCTOR AUTH (SOLICITUD CONTRASEÑA cata2026)  */}
        {/* ========================================================= */}
        {activeView === 'instructor_auth' && (
          <div className="max-w-md mx-auto bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-7 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setActiveView('selection');
                  setInstructorError(null);
                  setPasscode('');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a selección de rol</span>
              </button>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Seguridad
              </span>
            </div>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-white">Acceso de Instructor</h2>
              <p className="text-xs text-slate-300">
                Ingresa la contraseña autorizada para desbloquear el panel de instructor y la sincronización con Google Drive.
              </p>
            </div>

            <form onSubmit={handleInstructorSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Contraseña de Instructor:</span>
                  <span className="text-[10px] font-mono text-emerald-400">Contraseña: cata2026</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setInstructorError(null);
                    }}
                    placeholder="Ingresa cata2026"
                    autoFocus
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pr-10 font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {instructorError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{instructorError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verificar e Ingresar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: APRENDIZ FORM (CARACTERIZACIÓN ANTES DEL INGRESO) */}
        {/* ========================================================= */}
        {activeView === 'aprendiz_form' && (
          <div className="max-w-2xl mx-auto bg-slate-900/95 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <button
                type="button"
                onClick={() => {
                  setActiveView('selection');
                  setAprendizError(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a selección de rol</span>
              </button>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Sin Contraseña</span>
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                <GraduationCap className="w-7 h-7 text-emerald-400" />
                <span>Caracterización del Aprendiz</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Por favor diligencia tus datos de identificación para personalizar tu portafolio pedagógico, empresa simulada y registro en la plataforma.
              </p>
            </div>

            <form onSubmit={handleAprendizSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Nombre Completo */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nombres y Apellidos Completos *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={aprendizData.name}
                    onChange={(e) => setAprendizData({ ...aprendizData, name: e.target.value })}
                    placeholder="Ej: María Alejandra Gómez Suárez"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                {/* 2. Tipo de ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <IdCard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tipo de ID / Documento *</span>
                  </label>
                  <select
                    value={aprendizData.documentType}
                    onChange={(e) => setAprendizData({ ...aprendizData, documentType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="Cédula de Ciudadanía (CC)">Cédula de Ciudadanía (CC)</option>
                    <option value="Tarjeta de Identidad (TI)">Tarjeta de Identidad (TI)</option>
                    <option value="Cédula de Extranjería (CE)">Cédula de Extranjería (CE)</option>
                    <option value="Permiso por Protección Temporal (PPT)">Permiso de Protección (PPT)</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>

                {/* 3. Número de ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Número de ID / Documento *
                  </label>
                  <input
                    type="text"
                    required
                    value={aprendizData.documentNumber}
                    onChange={(e) => setAprendizData({ ...aprendizData, documentNumber: e.target.value })}
                    placeholder="Ej: 1.032.489.712"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                {/* 4. Programa de Formación */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Programa de Formación</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${PROGRAM_INFO.name} (${PROGRAM_INFO.code})`}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-medium select-none cursor-not-allowed"
                  />
                </div>

                {/* 5. Ficha */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ficha SOFIA Plus *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={aprendizData.ficha}
                    onChange={(e) => setAprendizData({ ...aprendizData, ficha: e.target.value })}
                    placeholder="2894501"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                {/* Centro y Regional */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Centro de Formación</span>
                  </label>
                  <input
                    type="text"
                    value={aprendizData.center}
                    onChange={(e) => setAprendizData({ ...aprendizData, center: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Correo Institucional o de Contacto</span>
                  </label>
                  <input
                    type="email"
                    value={aprendizData.email}
                    onChange={(e) => setAprendizData({ ...aprendizData, email: e.target.value })}
                    placeholder="aprendiz@soy.sena.edu.co"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {aprendizError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{aprendizError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 mt-4"
              >
                <GraduationCap className="w-5 h-5 text-slate-950" />
                <span>Ingresar al Ambiente de Aprendizaje</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Institutional Footer */}
      <footer className="max-w-5xl w-full mx-auto py-4 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>Servicio Nacional de Aprendizaje — SENA</span>
          <span>·</span>
          <span>Centro de Gestión Administrativa (CGA)</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Prototipo Curricular 134207 · Control de Autenticación de Roles
        </div>
      </footer>
    </div>
  );
};
