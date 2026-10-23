import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Badge, LearningMission, LearnerProfile } from '../types/gamification';
import { INITIAL_BADGES, INITIAL_MISSIONS } from '../data/senaData';

interface GamificationContextType {
  profile: LearnerProfile;
  badges: Badge[];
  missions: LearningMission[];
  completedProducts: string[];
  addXp: (amount: number, reason?: string) => void;
  unlockBadge: (badgeId: string) => void;
  completeMission: (missionId: string) => void;
  completeProduct: (productId: string) => void;
  updateProfile: (data: Partial<LearnerProfile>) => void;
  triggerCelebration: () => void;
  recentUnlockedBadge: Badge | null;
  dismissBadgeNotification: () => void;
  overallApropiacionPercent: number;
  isEligibleForCertificate: boolean;
}

const STORAGE_KEY = 'sena_th_gamification_v1';

const defaultProfile: LearnerProfile = {
  name: 'María Alejandra Gómez Suárez',
  documentNumber: '1.032.489.712',
  ficha: '2894501',
  center: 'Centro de Gestión Administrativa (CGA)',
  regional: 'Regional Distrito Capital',
  teamName: 'Ficha 2894501 - Grupo Élite TH',
  level: 3,
  xp: 1450,
  xpNextLevel: 2000,
  badges: INITIAL_BADGES,
  completedMissions: ['mis-1'],
  diagnosticScore: 90,
  phaseScores: {
    ANALISIS: 85,
    PLANEACION: 70,
    EJECUCION: 60,
    EVALUACION: 50,
  },
  simulationsCompleted: {},
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<LearnerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read saved gamification state', e);
    }
    return defaultProfile;
  });

  const [badges, setBadges] = useState<Badge[]>(() => profile.badges || INITIAL_BADGES);
  const [missions, setMissions] = useState<LearningMission[]>(() => {
    return INITIAL_MISSIONS.map((m) => ({
      ...m,
      completed: profile.completedMissions?.includes(m.id) || m.completed,
    }));
  });
  const [completedProducts, setCompletedProducts] = useState<string[]>(() => [
    'prod-analisis-1',
    'prod-plan-1',
  ]);
  const [recentUnlockedBadge, setRecentUnlockedBadge] = useState<Badge | null>(null);

  // Auto calculate level based on XP
  // Level 1: 0 - 500 XP
  // Level 2: 501 - 1000 XP
  // Level 3: 1001 - 1800 XP
  // Level 4: 1801 - 2500 XP
  // Level 5: 2501+ XP (Gestor Integral)
  const calculateLevel = (currentXp: number): { level: number; nextLevelXp: number } => {
    if (currentXp < 500) return { level: 1, nextLevelXp: 500 };
    if (currentXp < 1000) return { level: 2, nextLevelXp: 1000 };
    if (currentXp < 1800) return { level: 3, nextLevelXp: 1800 };
    if (currentXp < 2500) return { level: 4, nextLevelXp: 2500 };
    return { level: 5, nextLevelXp: 3000 };
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#39A900', '#00324D', '#FBBF24', '#10B981'],
      });
    } catch {
      // fallback
    }
  };

  const addXp = (amount: number, reason?: string) => {
    setProfile((prev) => {
      const newXp = prev.xp + amount;
      const { level, nextLevelXp } = calculateLevel(newXp);
      const leveledUp = level > prev.level;

      if (leveledUp) {
        triggerCelebration();
      }

      const updated = {
        ...prev,
        xp: newXp,
        level,
        xpNextLevel: nextLevelXp,
      };
      return updated;
    });
  };

  const unlockBadge = (badgeId: string) => {
    setBadges((prev) => {
      const target = prev.find((b) => b.id === badgeId);
      if (!target || target.unlocked) return prev;

      const updated = prev.map((b) =>
        b.id === badgeId
          ? { ...b, unlocked: true, unlockedAt: new Date().toLocaleDateString('es-CO') }
          : b
      );

      const unlockedItem = updated.find((b) => b.id === badgeId) || null;
      setRecentUnlockedBadge(unlockedItem);
      triggerCelebration();

      if (unlockedItem?.xpValue) {
        addXp(unlockedItem.xpValue, `Insignia: ${unlockedItem.name}`);
      }
      return updated;
    });
  };

  const completeMission = (missionId: string) => {
    setMissions((prev) => {
      const target = prev.find((m) => m.id === missionId);
      if (!target || target.completed) return prev;

      addXp(target.xpReward, `Misión: ${target.title}`);
      return prev.map((m) => (m.id === missionId ? { ...m, completed: true } : m));
    });

    setProfile((prev) => ({
      ...prev,
      completedMissions: Array.from(new Set([...(prev.completedMissions || []), missionId])),
    }));
  };

  const completeProduct = (productId: string) => {
    setCompletedProducts((prev) => {
      if (prev.includes(productId)) return prev;
      const next = [...prev, productId];
      addXp(120, 'Producto de empresa simulada completado');
      return next;
    });
  };

  const updateProfile = (data: Partial<LearnerProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const dismissBadgeNotification = () => {
    setRecentUnlockedBadge(null);
  };

  // Save changes to localStorage
  useEffect(() => {
    try {
      const full = {
        ...profile,
        badges,
        completedMissions: missions.filter((m) => m.completed).map((m) => m.id),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [profile, badges, missions]);

  // Overall progress calculation: based on XP, products, and missions
  const missionRatio = missions.filter((m) => m.completed).length / Math.max(missions.length, 1);
  const productsRatio = completedProducts.length / 10;
  const xpRatio = Math.min(profile.xp / 2200, 1);
  const overallApropiacionPercent = Math.min(
    100,
    Math.round(missionRatio * 35 + productsRatio * 35 + xpRatio * 30)
  );

  const isEligibleForCertificate = overallApropiacionPercent >= 75 || profile.level >= 4;

  return (
    <GamificationContext.Provider
      value={{
        profile,
        badges,
        missions,
        completedProducts,
        addXp,
        unlockBadge,
        completeMission,
        completeProduct,
        updateProfile,
        triggerCelebration,
        recentUnlockedBadge,
        dismissBadgeNotification,
        overallApropiacionPercent,
        isEligibleForCertificate,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};
