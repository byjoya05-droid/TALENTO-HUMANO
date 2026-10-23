import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAutoSync } from './AutoSyncContext';

export type UserRole = 'instructor' | 'aprendiz';

export interface AprendizCharacterization {
  name: string;
  documentType: string;
  documentNumber: string;
  ficha: string;
  center: string;
  regional: string;
  email: string;
  teamName: string;
}

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  hasSelectedRole: boolean;
  isInstructor: boolean;
  isAprendiz: boolean;
  loginAsInstructor: (passcode: string) => { success: boolean; error?: string };
  loginAsAprendiz: (characterization: AprendizCharacterization) => void;
  logoutRole: () => void;
  switchRoleWithPin: (targetRole: UserRole, pin?: string) => boolean;
  apprenticeShareUrl: string;
  instructorShareUrl: string;
  instructorEmail: string;
  copyApprenticeLink: () => Promise<boolean>;
}

export const INSTRUCTOR_PASSCODE = 'CATA2026';
const ROLE_STORAGE_KEY = 'sena_active_user_role';
const ROLE_SESSION_KEY = 'sena_role_session_active';
const INSTRUCTOR_AUTHORIZED_EMAIL = 'byjoya05@gmail.com';

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAutoSync();

  // Track whether the user has passed through the Landing Page selection
  const [hasSelectedRole, setHasSelectedRole] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const sessionActive = localStorage.getItem(ROLE_SESSION_KEY);
      return sessionActive === 'true';
    }
    return false;
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      // 1. Check URL parameters first (e.g. ?role=aprendiz)
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role');
      if (urlRole === 'aprendiz' || urlRole === 'instructor') {
        return urlRole;
      }
      // 2. Check localStorage
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      if (savedRole === 'aprendiz' || savedRole === 'instructor') {
        return savedRole;
      }
    }
    return 'instructor';
  });

  // Automatically authorize instructor if signed in with the instructor's Google email
  useEffect(() => {
    if (currentUser?.email === INSTRUCTOR_AUTHORIZED_EMAIL) {
      setRoleState('instructor');
      setHasSelectedRole(true);
      localStorage.setItem(ROLE_STORAGE_KEY, 'instructor');
      localStorage.setItem(ROLE_SESSION_KEY, 'true');
    }
  }, [currentUser]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem(ROLE_STORAGE_KEY, newRole);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('role', newRole);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const loginAsInstructor = (passcode: string): { success: boolean; error?: string } => {
    const cleanPass = passcode.trim().toUpperCase();
    if (
      cleanPass === INSTRUCTOR_PASSCODE ||
      cleanPass === '134207' ||
      currentUser?.email === INSTRUCTOR_AUTHORIZED_EMAIL
    ) {
      setRole('instructor');
      setHasSelectedRole(true);
      localStorage.setItem(ROLE_SESSION_KEY, 'true');
      return { success: true };
    }
    return {
      success: false,
      error: 'Contraseña de instructor incorrecta. Debes ingresar: cata2026',
    };
  };

  const loginAsAprendiz = (characterization: AprendizCharacterization) => {
    setRole('aprendiz');
    setHasSelectedRole(true);
    localStorage.setItem(ROLE_SESSION_KEY, 'true');

    // Also persist characterization for quick reload
    try {
      localStorage.setItem('sena_aprendiz_characterization', JSON.stringify(characterization));
    } catch (e) {
      console.warn('Could not cache characterization', e);
    }
  };

  const logoutRole = () => {
    setHasSelectedRole(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ROLE_SESSION_KEY);
    }
  };

  const switchRoleWithPin = (targetRole: UserRole, pin?: string): boolean => {
    if (targetRole === 'aprendiz') {
      setRole('aprendiz');
      setHasSelectedRole(true);
      localStorage.setItem(ROLE_SESSION_KEY, 'true');
      return true;
    }
    const cleanPin = pin?.trim().toUpperCase();
    if (
      currentUser?.email === INSTRUCTOR_AUTHORIZED_EMAIL ||
      cleanPin === INSTRUCTOR_PASSCODE ||
      cleanPin === '134207'
    ) {
      setRole('instructor');
      setHasSelectedRole(true);
      localStorage.setItem(ROLE_SESSION_KEY, 'true');
      return true;
    }
    return false;
  };

  const apprenticeShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?role=aprendiz`
    : '';

  const instructorShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?role=instructor`
    : '';

  const copyApprenticeLink = async (): Promise<boolean> => {
    try {
      if (apprenticeShareUrl) {
        await navigator.clipboard.writeText(apprenticeShareUrl);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        hasSelectedRole,
        isInstructor: role === 'instructor',
        isAprendiz: role === 'aprendiz',
        loginAsInstructor,
        loginAsAprendiz,
        logoutRole,
        switchRoleWithPin,
        apprenticeShareUrl,
        instructorShareUrl,
        instructorEmail: INSTRUCTOR_AUTHORIZED_EMAIL,
        copyApprenticeLink,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
