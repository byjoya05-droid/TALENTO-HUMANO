import React, { useState } from 'react';
import { 
  Award, 
  Printer, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Edit3, 
  Sparkles,
  Lock,
  Download,
  Building2,
  Save,
  RotateCcw,
  Check
} from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useRole } from '../context/RoleContext';
import { PROGRAM_INFO } from '../data/senaData';
import { SENA_LOGO_DATA_URI } from '../assets/senaLogo';
import { GoogleDriveSyncPanel } from './GoogleDriveSyncPanel';
import { AutoSyncBadge } from './AutoSyncBadge';

export const CertificateModule: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    overallApropiacionPercent, 
    isEligibleForCertificate,
    triggerCelebration,
    addXp,
    unlockBadge
  } = useGamification();

  const { isInstructor } = useRole();

  // Keep the editing tool permanently visible and functional in the prototype
  const [learnerName, setLearnerName] = useState<string>(profile.name);
  const [docNumber, setDocNumber] = useState<string>(profile.documentNumber);
  const [fichaNumber, setFichaNumber] = useState<string>(profile.ficha);
  const [centerName, setCenterName] = useState<string>(profile.center);
  const [regionalName, setRegionalName] = useState<string>(profile.regional);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const verificationCode = `SENA-TH-134207-${fichaNumber || profile.ficha}-2026`;
  const currentDate = new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateProfile({
      name: learnerName,
      documentNumber: docNumber,
      ficha: fichaNumber,
      center: centerName,
      regional: regionalName,
    });
    setSavedNotice(true);
    triggerCelebration();
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handlePrint = () => {
    triggerCelebration();
    window.print();
  };

  const handleForceUnlock = () => {
    addXp(1200, 'Culminación integral de las 4 fases formativas');
    unlockBadge('badge-integral');
    triggerCelebration();
  };

  const handleResetDefault = () => {
    const defaultName = 'María Alejandra Gómez Suárez';
    const defaultDoc = '1.032.489.712';
    const defaultFicha = '2894501';
    const defaultCenter = 'Centro de Gestión Administrativa (CGA)';
    const defaultReg = 'Regional Distrito Capital';
    setLearnerName(defaultName);
    setDocNumber(defaultDoc);
    setFichaNumber(defaultFicha);
    setCenterName(defaultCenter);
    setRegionalName(defaultReg);
    updateProfile({
      name: defaultName,
      documentNumber: defaultDoc,
      ficha: defaultFicha,
      center: defaultCenter,
      regional: defaultReg,
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Permanent Editing Tool in the Prototype (Herramienta de Edición) */}
      <div className="no-print bg-white rounded-xl border-2 border-emerald-600/40 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Herramienta de Edición y Personalización del Aprendiz</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded">
                  ACTIVA EN EL PROTOTIPO
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Modifica los datos del aprendiz en tiempo real. Cualquier cambio se reflejará al instante en el certificado oficial y en todo el prototipo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <AutoSyncBadge />
            <button
              onClick={handleResetDefault}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Valores por Defecto</span>
            </button>
          </div>
        </div>

        {/* Live Form Fields */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Nombre Completo del Aprendiz:
              </label>
              <input
                type="text"
                value={learnerName}
                onChange={(e) => {
                  setLearnerName(e.target.value);
                  updateProfile({ name: e.target.value });
                }}
                placeholder="Ej: Juan Carlos Pérez..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-600 font-medium text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Documento de Identidad (C.C.):
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => {
                  setDocNumber(e.target.value);
                  updateProfile({ documentNumber: e.target.value });
                }}
                placeholder="Ej: 1.020.304.506"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-600 font-mono text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Ficha de Caracterización SOFIA:
              </label>
              <input
                type="text"
                value={fichaNumber}
                onChange={(e) => {
                  setFichaNumber(e.target.value);
                  updateProfile({ ficha: e.target.value });
                }}
                placeholder="Ej: 2894501"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-600 font-mono text-slate-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Centro de Formación SENA:
              </label>
              <input
                type="text"
                value={centerName}
                onChange={(e) => {
                  setCenterName(e.target.value);
                  updateProfile({ center: e.target.value });
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-600 text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Regional SENA:
              </label>
              <input
                type="text"
                value={regionalName}
                onChange={(e) => {
                  setRegionalName(e.target.value);
                  updateProfile({ regional: e.target.value });
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-600 text-slate-800"
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>

              {savedNotice && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" /> ¡Datos actualizados!
                </span>
              )}
            </div>

            {/* Print / Unlock controls */}
            <div className="flex items-center gap-2">
              {!isEligibleForCertificate ? (
                <button
                  type="button"
                  onClick={handleForceUnlock}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Habilitar Emisión (+1200 XP)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Descargar PDF</span>
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Status banner */}
        <div className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
          isEligibleForCertificate
            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
            : 'bg-amber-50/70 border-amber-300 text-amber-950'
        }`}>
          <div className="flex items-center gap-2">
            {isEligibleForCertificate ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>
              {isEligibleForCertificate
                ? '¡Acreditación completa! Has superado los niveles de apropiación del programa. Tu certificado se encuentra validado y listo.'
                : `Apropiación actual del programa: ${overallApropiacionPercent}%. Puedes usar el botón "Habilitar Emisión" para pruebas o completar las actividades en los otros módulos.`}
            </span>
          </div>

          <span className="font-mono font-bold text-[11px] shrink-0">
            {overallApropiacionPercent}% Apropiado
          </span>
        </div>
      </div>

      {/* Google Drive / Google Sheets Synchronization Panel (Exclusive to Instructor) */}
      {isInstructor && (
        <div className="no-print">
          <GoogleDriveSyncPanel />
        </div>
      )}

      {/* Official Certificate Paper Container */}
      <div className="bg-white p-4 sm:p-10 rounded-2xl shadow-xl border-4 border-emerald-900/80 max-w-4xl mx-auto relative overflow-hidden print:m-0 print:p-6 print:border-4 print:shadow-none">
        {/* Subtle Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <div className="w-[500px] h-[500px] rounded-full border-[40px] border-emerald-900" />
        </div>

        {/* Outer decorative golden/emerald border frame */}
        <div className="border-2 border-emerald-700/60 p-6 sm:p-10 rounded-xl space-y-8 relative z-10 bg-gradient-to-b from-white via-white to-slate-50/50">
          
          {/* Header Logos & Institution */}
          <div className="text-center space-y-2 border-b-2 border-emerald-800/20 pb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 flex items-center justify-center shrink-0">
                <img
                  src={SENA_LOGO_DATA_URI}
                  alt="Logo Oficial SENA"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">
              República de Colombia · Ministerio del Trabajo
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-emerald-900 tracking-tight uppercase">
              Servicio Nacional de Aprendizaje — SENA
            </h2>

            <div className="text-xs font-mono text-slate-600">
              {regionalName.toUpperCase()} · {centerName.toUpperCase()}
            </div>
          </div>

          {/* Certificate Main Title */}
          <div className="text-center space-y-3">
            <div className="inline-block px-4 py-1 bg-emerald-50 rounded-full border border-emerald-200 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
              Acreditación Académica y Práctica
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Certificación de Apropiación Integral del Programa de Formación SENA
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto italic">
              El Centro de Gestión Administrativa del SENA hace constar que:
            </p>
          </div>

          {/* Recipient Name and ID */}
          <div className="text-center space-y-2 py-2">
            <div className="text-2xl sm:text-4xl font-extrabold text-emerald-950 font-serif tracking-wide border-b-2 border-dashed border-emerald-300 pb-2 inline-block px-8">
              {learnerName || profile.name}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Identificado(a) con Cédula de Ciudadanía No. <strong className="text-slate-900 font-mono">{docNumber || profile.documentNumber}</strong>
            </div>
          </div>

          {/* Program and Project Justification */}
          <div className="text-xs text-slate-700 leading-relaxed text-center max-w-2xl mx-auto space-y-3">
            <p>
              Ha cursado, comprendido, apropiado y dominado satisfactoriamente la totalidad de las 
              <strong className="text-slate-900"> 2.208 horas</strong> (1.344 horas en Etapa Lectiva y 864 horas en Etapa Productiva)
              del programa de formación titulada:
            </p>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center font-bold text-slate-900 text-sm sm:text-base">
              TÉCNICO EN TALENTO HUMANO (CÓDIGO 134207)
            </div>

            <p>
              En el marco del Proyecto Formativo <strong className="text-slate-900">Código 3456077</strong>:
              <br />
              <span className="italic font-medium text-slate-800">
                "{PROGRAM_INFO.projectName}"
              </span>
            </p>

            <p className="text-[11px] text-slate-500 pt-1">
              Habiendo demostrado las competencias del Saber, Saber Hacer y Ser en las 
              <strong> 4 Fases (Análisis, Planeación, Ejecución y Evaluación)</strong> y consolidado con éxito
              los 10 productos requeridos de la empresa simulada bajo estándares del CUOC 1342 y del Archivo General de la Nación (AGN).
            </p>
          </div>

          {/* Competency Badges Strip */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-600 font-mono">
            <span className="bg-slate-100 px-2.5 py-1 rounded">210201066 Provisión TH</span>
            <span className="bg-slate-100 px-2.5 py-1 rounded">210601031 Gestión Documental</span>
            <span className="bg-slate-100 px-2.5 py-1 rounded">220501121 TIC & IA</span>
            <span className="bg-slate-100 px-2.5 py-1 rounded">210601020 Servicio al Cliente</span>
            <span className="bg-slate-100 px-2.5 py-1 rounded">210201501 Derechos Laborales</span>
          </div>

          {/* Signatures & QR Verification */}
          <div className="pt-8 border-t-2 border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 items-end gap-6 text-center">
            {/* Signature 1 */}
            <div className="space-y-1">
              <div className="w-40 h-10 border-b border-slate-700 mx-auto flex items-end justify-center font-serif italic text-sm text-slate-700">
                Dr. Gabriel E. Restrepo
              </div>
              <div className="text-[11px] font-bold text-slate-900">Subdirector de Centro</div>
              <div className="text-[10px] text-slate-500">{centerName}</div>
            </div>

            {/* Official Stamp & QR */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-16 h-16 rounded-xl border border-slate-300 bg-white p-1 flex items-center justify-center shadow-xs">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                Cód: {verificationCode}
              </div>
              <div className="text-[9px] font-semibold text-emerald-800">
                Verificación Digital Válida
              </div>
            </div>

            {/* Signature 2 */}
            <div className="space-y-1">
              <div className="w-40 h-10 border-b border-slate-700 mx-auto flex items-end justify-center font-serif italic text-sm text-slate-700">
                Dra. Patricia M. Soto
              </div>
              <div className="text-[11px] font-bold text-slate-900">Coordinadora Académica</div>
              <div className="text-[10px] text-slate-500">Coordinación de Gestión del Talento</div>
            </div>
          </div>

          {/* Certificate Footer Notice */}
          <div className="text-center pt-4 text-[10px] text-slate-400 font-mono border-t border-slate-100">
            Expedido en Bogotá D.C., Colombia, a los {currentDate} · Ficha de Caracterización: {fichaNumber || profile.ficha}
          </div>
        </div>
      </div>
    </div>
  );
};
