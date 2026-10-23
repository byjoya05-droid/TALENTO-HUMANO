import React, { useState, useEffect } from 'react';
import { GamificationProvider } from './context/GamificationContext';
import { AutoSyncProvider } from './context/AutoSyncContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { Header, ActiveTab } from './components/Header';
import { OverviewModule } from './components/OverviewModule';
import { CurriculumMatrixModule } from './components/CurriculumMatrixModule';
import { SimulatedCompanyModule } from './components/SimulatedCompanyModule';
import { EvaluationCenterModule } from './components/EvaluationCenterModule';
import { GamificationModule } from './components/GamificationModule';
import { AITutorModule } from './components/AITutorModule';
import { CertificateModule } from './components/CertificateModule';
import { GoogleDriveSyncPanel } from './components/GoogleDriveSyncPanel';
import { InstructorDashboard } from './components/InstructorDashboard';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { BadgeNotificationModal } from './components/BadgeNotificationModal';
import { PROGRAM_INFO } from './data/senaData';
import { SENA_LOGO_DATA_URI } from './assets/senaLogo';

function AppContent() {
  const { isInstructor, isAprendiz, hasSelectedRole } = useRole();
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    // Check URL role initially
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('role') === 'aprendiz') return 'overview';
    }
    return 'instructor_panel';
  });

  // Guard: if role changes to apprentice, redirect away from instructor-only tabs
  useEffect(() => {
    if (isAprendiz && (activeTab === 'instructor_panel' || activeTab === 'drive')) {
      setActiveTab('overview');
    }
  }, [isAprendiz, activeTab]);

  // When user has not selected a role or logs out, show the dedicated role selection landing page
  if (!hasSelectedRole) {
    return <RoleSelectionLanding />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header with Role Switcher & Nav */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Instructor Dedicated Dashboard */}
        {activeTab === 'instructor_panel' && isInstructor && <InstructorDashboard />}

        {/* Core Pedagogical Modules (Available to both) */}
        {activeTab === 'overview' && (
          <OverviewModule onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'curriculum' && <CurriculumMatrixModule />}
        {activeTab === 'company' && <SimulatedCompanyModule />}
        {activeTab === 'evaluation' && <EvaluationCenterModule />}
        {activeTab === 'gamification' && (
          <GamificationModule onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'mentor' && <AITutorModule />}
        {activeTab === 'certificate' && <CertificateModule />}

        {/* Google Drive panel (Only accessible by Instructor) */}
        {activeTab === 'drive' && isInstructor && <GoogleDriveSyncPanel />}
      </main>

      {/* Celebratory Badge Modal */}
      <BadgeNotificationModal />

      {/* Institutional Footer (Hidden during print) */}
      <footer className="no-print bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <img
                src={SENA_LOGO_DATA_URI}
                alt="Logo SENA"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-slate-800">
                Servicio Nacional de Aprendizaje — SENA
              </div>
              <div className="text-[11px] text-slate-400">
                {PROGRAM_INFO.center} · {PROGRAM_INFO.regional} · Colombia
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            {isInstructor && (
              <>
                <button
                  onClick={() => setActiveTab('instructor_panel')}
                  className="font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
                >
                  Panel Instructor
                </button>
                <span aria-hidden="true">·</span>
              </>
            )}
            <button
              onClick={() => setActiveTab('overview')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Proyecto 3456077
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('curriculum')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Diseño Curricular 134207
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('company')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Empresa Simulada
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('certificate')}
              className="hover:text-emerald-700 font-semibold transition-colors cursor-pointer"
            >
              Certificación Digital
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Prototipo Educativo Inteligente v1.0
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <GamificationProvider>
      <AutoSyncProvider>
        <RoleProvider>
          <AppContent />
        </RoleProvider>
      </AutoSyncProvider>
    </GamificationProvider>
  );
}
