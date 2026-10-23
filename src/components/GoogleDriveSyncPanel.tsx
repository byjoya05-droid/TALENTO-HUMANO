import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  HardDrive, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  LogOut, 
  User, 
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  Table,
  Search,
  ArrowUpRight,
  Zap,
  CheckCheck
} from 'lucide-react';
import { useAutoSync } from '../context/AutoSyncContext';
import { useGamification } from '../context/GamificationContext';
import { 
  fetchLearnersFromSpreadsheet, 
  SheetLearnerRecord 
} from '../services/googleSheetsStorage';
import { getAccessToken } from '../services/googleAuth';

export const GoogleDriveSyncPanel: React.FC = () => {
  const { profile, overallApropiacionPercent } = useGamification();
  const { 
    currentUser, 
    spreadsheet, 
    syncStatus, 
    lastSyncedTime, 
    syncError, 
    autoSyncEnabled, 
    setAutoSyncEnabled, 
    login, 
    logout, 
    syncNow 
  } = useAutoSync();

  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [storedRecords, setStoredRecords] = useState<SheetLearnerRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(false);

  // Load existing rows from sheet when spreadsheet is available
  useEffect(() => {
    if (currentUser && spreadsheet) {
      handleFetchStoredRecords();
    }
  }, [currentUser, spreadsheet]);

  const handleFetchStoredRecords = async () => {
    if (!spreadsheet?.id) return;
    const token = await getAccessToken();
    if (!token) return;

    setIsLoadingRecords(true);
    try {
      const records = await fetchLearnersFromSpreadsheet(token, spreadsheet.id);
      setStoredRecords(records);
    } catch (e) {
      console.error('Error fetching sheet rows:', e);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleCopyLink = () => {
    if (!spreadsheet?.url) return;
    navigator.clipboard.writeText(spreadsheet.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleManualSync = async () => {
    await syncNow();
    await handleFetchStoredRecords();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Integración Google Workspace</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                AUTO-SYNC ACTIVO
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Sincronización Automática con Google Drive & Google Sheets
            </h2>
            <p className="text-xs text-slate-500">
              Tus avances formativos, calificaciones y entregables se guardan continuamente en la nube sin requerir configuración manual.
            </p>
          </div>
        </div>

        {/* Google Authentication State */}
        <div className="self-start sm:self-auto">
          {!currentUser ? (
            <button
              onClick={login}
              className="flex items-center gap-2.5 px-3.5 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Conectar con Google Drive</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Usuario'}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <User className="w-4 h-4 text-slate-500" />
                )}
                <div className="text-left font-medium text-slate-800 truncate max-w-[150px]">
                  {currentUser.displayName || currentUser.email}
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Desconectar cuenta de Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Auto-Sync Status Bar Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
        syncStatus === 'syncing'
          ? 'bg-amber-50/90 border-amber-300 text-amber-950'
          : syncStatus === 'synced'
          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
          : syncStatus === 'error'
          ? 'bg-rose-50/90 border-rose-300 text-rose-950'
          : 'bg-slate-50/90 border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
            {syncStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
            ) : syncStatus === 'synced' ? (
              <CheckCheck className="w-4 h-4 text-emerald-600" />
            ) : syncStatus === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            ) : (
              <Zap className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div>
            <div className="font-bold flex items-center gap-2">
              <span>
                {syncStatus === 'syncing'
                  ? 'Guardando cambios automáticamente en Google Sheets...'
                  : syncStatus === 'synced'
                  ? '¡Cambios sincronizados en Google Drive!'
                  : syncStatus === 'error'
                  ? 'Error al sincronizar con Google Sheets'
                  : 'Sincronización Automática en Segundo Plano Activa'}
              </span>
              {lastSyncedTime && (
                <span className="font-mono text-[10px] text-slate-500 font-normal">
                  (Último guardado: {lastSyncedTime})
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Cualquier modificación en el perfil del aprendiz o avance formativo se guardará automáticamente en tu hoja de cálculo.
            </p>
          </div>
        </div>

        {/* Toggle switch & manual push */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="flex items-center gap-2 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px]">
            <input
              type="checkbox"
              checked={autoSyncEnabled}
              onChange={(e) => setAutoSyncEnabled(e.target.checked)}
              className="accent-emerald-600 w-3.5 h-3.5 rounded"
            />
            <span className="font-medium text-slate-700">Auto-Guardado</span>
          </label>

          {currentUser && (
            <button
              onClick={handleManualSync}
              disabled={syncStatus === 'syncing'}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>Forzar Sincronización</span>
            </button>
          )}
        </div>
      </div>

      {/* Spreadsheet Link Showcase Box */}
      <div className="p-4 rounded-xl border border-emerald-300/80 bg-gradient-to-r from-emerald-50/90 via-emerald-50/50 to-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
              ENLACE DIRECTO DE LA HOJA DE CÁLCULO
            </span>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2 mt-1">
              <span>{spreadsheet?.name || `SENA - Registro de Aprendices Talento Humano (Ficha ${profile.ficha})`}</span>
            </div>
          </div>

          {/* Quick link action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {spreadsheet?.url ? (
              <>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Copiar URL al portapapeles"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copiar Enlace</span>
                    </>
                  )}
                </button>

                <a
                  href={spreadsheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Abrir Hoja de Cálculo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </>
            ) : currentUser ? (
              <span className="text-xs text-emerald-800 font-semibold animate-pulse">
                Vinculando hoja automáticamente...
              </span>
            ) : null}
          </div>
        </div>

        {/* URL Box for easy visibility */}
        <div className="pt-2 border-t border-emerald-200/60">
          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
            URL permanente en Google Docs / Google Drive:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={spreadsheet?.url || (currentUser ? 'Generando y vinculando hoja de cálculo en tu Google Drive...' : 'Inicia sesión con Google para generar y visualizar el enlace de la hoja')}
              className="w-full text-xs font-mono p-2 bg-white/90 border border-slate-300 rounded-lg text-slate-800 select-all"
            />
            {spreadsheet?.url && (
              <a
                href={spreadsheet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition-colors shrink-0"
                title="Ir al enlace directo"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Google Drive links */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
          <span>Accesos directos:</span>
          <a
            href="https://drive.google.com/drive/my-drive"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
          >
            <HardDrive className="w-3 h-3" />
            <span>Mi Unidad en Google Drive</span>
          </a>
          <span>·</span>
          <a
            href="https://drive.google.com/drive/search?q=SENA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
          >
            <Search className="w-3 h-3" />
            <span>Buscar archivos 'SENA' en Drive</span>
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {currentUser ? (
          <div className="space-y-4">
            {/* Architecture Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <strong className="text-slate-800 flex items-center gap-1">
                  <Table className="w-3.5 h-3.5 text-emerald-600" />
                  Hoja 1: Aprendices_Registro
                </strong>
                <div className="text-slate-500 mt-1">
                  Datos personales, ficha, nivel, XP, % avance ({overallApropiacionPercent}%) y estado de certificación.
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <strong className="text-slate-800 flex items-center gap-1">
                  <Table className="w-3.5 h-3.5 text-blue-600" />
                  Hoja 2: Entregables_Empresa
                </strong>
                <div className="text-slate-500 mt-1">
                  Los 10 productos de las 4 fases con estado de entrega y evaluación por IA.
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <strong className="text-slate-800 flex items-center gap-1">
                  <Table className="w-3.5 h-3.5 text-amber-600" />
                  Hoja 3: Evaluaciones_Retos
                </strong>
                <div className="text-slate-500 mt-1">
                  Simuladores de FUID, historia laboral, diagnóstico y retos de gamificación.
                </div>
              </div>
            </div>

            {/* Error banner if any */}
            {syncError && (
              <div className="p-3 bg-rose-100/70 border border-rose-300 rounded-lg text-xs text-rose-950 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{syncError}</span>
              </div>
            )}

            {/* Live Data Inspection Table (Auditoría en tiempo real) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Table className="w-4 h-4 text-emerald-700" />
                    <span>Registros Almacenados en la Hoja 'Aprendices_Registro'</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Consulta en tiempo real las filas guardadas automáticamente en tu Google Drive.
                  </p>
                </div>

                <button
                  onClick={handleFetchStoredRecords}
                  disabled={isLoadingRecords || !spreadsheet}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingRecords ? 'animate-spin' : ''}`} />
                  <span>Refrescar Filas</span>
                </button>
              </div>

              {isLoadingRecords ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  Consultando filas en Google Sheets...
                </div>
              ) : storedRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                        <th className="p-2">Fecha y Hora</th>
                        <th className="p-2">Aprendiz</th>
                        <th className="p-2">Documento</th>
                        <th className="p-2">Ficha</th>
                        <th className="p-2">Nivel / XP</th>
                        <th className="p-2">Apropiación</th>
                        <th className="p-2">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {storedRecords.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2 font-mono text-[11px] text-slate-500 whitespace-nowrap">{row.timestamp}</td>
                          <td className="p-2 font-semibold text-slate-900">{row.name}</td>
                          <td className="p-2 font-mono text-[11px] text-slate-600">{row.docNumber}</td>
                          <td className="p-2 font-mono text-[11px] text-slate-600">{row.ficha}</td>
                          <td className="p-2 font-mono text-[11px] text-emerald-800">{row.level} · {row.xp} XP</td>
                          <td className="p-2 font-bold text-emerald-700">{row.apropiacion}</td>
                          <td className="p-2">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-6 text-center border-2 border-dashed border-slate-100 rounded-lg text-xs text-slate-500 space-y-2">
                  <p>Aún no hay registros en la hoja. La sincronización automática guardará tu perfil en breve.</p>
                  <button
                    onClick={handleManualSync}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    Guardar Primer Registro Ahora
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-3 bg-slate-50/50">
            <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-slate-200 flex items-center justify-center mx-auto text-emerald-700">
              <HardDrive className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                Conecta tu cuenta de Google una sola vez para activar el guardado automático
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Al iniciar sesión con tu cuenta de Google (<strong>byjoya05@gmail.com</strong>), la plataforma conectará tu Drive, creará la hoja de cálculo institucional y guardará automáticamente cada avance formativo.
              </p>
            </div>
            <button
              onClick={login}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Conectar Google Drive Ahora</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
