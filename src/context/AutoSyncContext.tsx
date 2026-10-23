import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { initAuth, googleSignIn, googleLogout, getAccessToken } from '../services/googleAuth';
import { 
  getOrCreateLearnerSpreadsheet, 
  syncLearnerToSpreadsheet, 
  SpreadsheetInfo 
} from '../services/googleSheetsStorage';
import { useGamification } from './GamificationContext';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface AutoSyncContextType {
  currentUser: FirebaseUser | null;
  spreadsheet: SpreadsheetInfo | null;
  syncStatus: SyncStatus;
  lastSyncedTime: string | null;
  syncError: string | null;
  autoSyncEnabled: boolean;
  setAutoSyncEnabled: (enabled: boolean) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  syncNow: () => Promise<void>;
  openSpreadsheet: () => void;
}

const SPREADSHEET_STORAGE_KEY = 'sena_active_spreadsheet';
const LAST_SYNCED_KEY = 'sena_last_synced';

const AutoSyncContext = createContext<AutoSyncContextType | undefined>(undefined);

export const AutoSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, overallApropiacionPercent, isEligibleForCertificate, triggerCelebration } = useGamification();

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetInfo | null>(() => {
    try {
      const saved = localStorage.getItem(SPREADSHEET_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(() => {
    return localStorage.getItem(LAST_SYNCED_KEY);
  });
  const [syncError, setSyncError] = useState<string | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);

  // Debounce timer reference
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef<boolean>(true);

  // 1. Initialize Firebase Auth on app mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, accessToken) => {
        setCurrentUser(user);
        setToken(accessToken);
      },
      () => {
        setCurrentUser(null);
        setToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // 2. Automatically resolve or create the learner spreadsheet when authenticated
  useEffect(() => {
    if (!token) return;

    // If spreadsheet is not yet set or belongs to a different ficha, automatically initialize
    if (!spreadsheet || !spreadsheet.name.includes(profile.ficha)) {
      let isMounted = true;
      (async () => {
        try {
          const sheet = await getOrCreateLearnerSpreadsheet(token, profile.ficha);
          if (isMounted) {
            setSpreadsheet(sheet);
            localStorage.setItem(SPREADSHEET_STORAGE_KEY, JSON.stringify(sheet));
          }
        } catch (e: any) {
          console.warn('Auto-init spreadsheet warning:', e);
        }
      })();
      return () => {
        isMounted = false;
      };
    }
  }, [token, profile.ficha, spreadsheet]);

  // 3. Execution of sync logic
  const executeSync = useCallback(async () => {
    if (!token || !autoSyncEnabled) return;

    setSyncStatus('syncing');
    setSyncError(null);

    try {
      let activeSheet = spreadsheet;
      if (!activeSheet) {
        activeSheet = await getOrCreateLearnerSpreadsheet(token, profile.ficha);
        setSpreadsheet(activeSheet);
        localStorage.setItem(SPREADSHEET_STORAGE_KEY, JSON.stringify(activeSheet));
      }

      await syncLearnerToSpreadsheet(
        token,
        activeSheet.id,
        profile,
        overallApropiacionPercent,
        isEligibleForCertificate
      );

      const nowTime = new Date().toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastSyncedTime(nowTime);
      localStorage.setItem(LAST_SYNCED_KEY, nowTime);
      setSyncStatus('synced');

      // Revert status to 'idle' after 4 seconds
      setTimeout(() => {
        setSyncStatus((prev) => (prev === 'synced' ? 'idle' : prev));
      }, 4000);
    } catch (err: any) {
      console.error('Error en sincronización automática:', err);
      setSyncError(err.message || 'Error al sincronizar con Google Sheets');
      setSyncStatus('error');
    }
  }, [token, autoSyncEnabled, spreadsheet, profile, overallApropiacionPercent, isEligibleForCertificate]);

  // 4. Background debounced auto-sync whenever profile, XP or appropriation changes
  useEffect(() => {
    // Avoid syncing on immediate initial load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!token || !autoSyncEnabled) return;

    // Reset previous pending timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce by 2000 ms to aggregate continuous user actions (typing, multiple clicks)
    debounceTimerRef.current = setTimeout(() => {
      executeSync();
    }, 2000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    profile.name,
    profile.documentNumber,
    profile.ficha,
    profile.center,
    profile.regional,
    profile.xp,
    profile.level,
    overallApropiacionPercent,
    isEligibleForCertificate,
    token,
    autoSyncEnabled,
    executeSync,
  ]);

  const login = async () => {
    try {
      setSyncError(null);
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setToken(res.accessToken);
        triggerCelebration();
      }
    } catch (e: any) {
      console.error('Login error:', e);
      setSyncError('Error al iniciar sesión con Google.');
    }
  };

  const logout = async () => {
    await googleLogout();
    setCurrentUser(null);
    setToken(null);
    setSyncStatus('idle');
  };

  const syncNow = async () => {
    await executeSync();
  };

  const openSpreadsheet = () => {
    if (spreadsheet?.url) {
      window.open(spreadsheet.url, '_blank');
    }
  };

  return (
    <AutoSyncContext.Provider
      value={{
        currentUser,
        spreadsheet,
        syncStatus,
        lastSyncedTime,
        syncError,
        autoSyncEnabled,
        setAutoSyncEnabled,
        login,
        logout,
        syncNow,
        openSpreadsheet,
      }}
    >
      {children}
    </AutoSyncContext.Provider>
  );
};

export const useAutoSync = () => {
  const context = useContext(AutoSyncContext);
  if (!context) {
    throw new Error('useAutoSync must be used within an AutoSyncProvider');
  }
  return context;
};
