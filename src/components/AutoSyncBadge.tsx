import React, { useState } from 'react';
import { 
  HardDrive, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  CloudCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAutoSync } from '../context/AutoSyncContext';

interface AutoSyncBadgeProps {
  variant?: 'compact' | 'expanded';
}

export const AutoSyncBadge: React.FC<AutoSyncBadgeProps> = ({ variant = 'compact' }) => {
  const { 
    currentUser, 
    spreadsheet, 
    syncStatus, 
    lastSyncedTime, 
    login, 
    syncNow, 
    openSpreadsheet 
  } = useAutoSync();

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // If user is not logged in
  if (!currentUser) {
    return (
      <button
        onClick={login}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
        title="Conectar con Google Drive para habilitar guardado automático"
      >
        <HardDrive className="w-3.5 h-3.5 text-emerald-700" />
        <span>Conectar Google Drive</span>
      </button>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all cursor-pointer ${
          syncStatus === 'syncing'
            ? 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse'
            : syncStatus === 'synced'
            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-400/40'
            : syncStatus === 'error'
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
        }`}
        title="Estado de sincronización automática en Google Drive"
      >
        {syncStatus === 'syncing' ? (
          <>
            <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
            <span className="font-semibold">Guardando en Drive...</span>
          </>
        ) : syncStatus === 'synced' ? (
          <>
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span className="font-semibold text-emerald-800">Sincronizado en Drive</span>
          </>
        ) : syncStatus === 'error' ? (
          <>
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span className="font-semibold">Reintentar guardado</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="hidden sm:inline">Drive Conectado</span>
            <span className="sm:hidden">Drive</span>
          </>
        )}

        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {/* Dropdown details */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-1.5 w-72 rounded-xl bg-white border border-slate-200 shadow-xl p-3 z-50 text-xs space-y-2.5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Guardado Automático
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded font-mono">
                ACTIVO
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-800 truncate">
                {currentUser.displayName || currentUser.email}
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <span>Última sincronización:</span>
                <strong className="text-slate-700 font-mono">
                  {lastSyncedTime ? `${lastSyncedTime}` : 'En espera de cambios'}
                </strong>
              </div>
            </div>

            {spreadsheet?.url && (
              <div className="pt-1">
                <a
                  href={spreadsheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold transition-colors"
                >
                  <span className="truncate max-w-[200px]">{spreadsheet.name}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                </a>
              </div>
            )}

            <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  syncNow();
                  setShowDropdown(false);
                }}
                disabled={syncStatus === 'syncing'}
                className="flex-1 py-1 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <span>Sincronizar Ya</span>
              </button>

              {spreadsheet?.url && (
                <button
                  onClick={() => {
                    openSpreadsheet();
                    setShowDropdown(false);
                  }}
                  className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Abrir Hoja
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
