import React from 'react';
import { Award, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export const BadgeNotificationModal: React.FC = () => {
  const { recentUnlockedBadge, dismissBadgeNotification } = useGamification();

  if (!recentUnlockedBadge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-emerald-300 relative space-y-4">
        <button
          onClick={dismissBadgeNotification}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md">
          <Award className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            ¡Nueva Insignia Desbloqueada!
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {recentUnlockedBadge.name}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {recentUnlockedBadge.description}
          </p>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-800 flex items-center justify-center gap-2">
          <span>+{recentUnlockedBadge.xpValue} Puntos XP Añadidos a tu Perfil</span>
        </div>

        <button
          onClick={dismissBadgeNotification}
          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          Continuar Formación
        </button>
      </div>
    </div>
  );
};
