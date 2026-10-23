import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Users, 
  Lock, 
  Unlock, 
  Star, 
  ArrowRight, 
  Download,
  Shield,
  Layers,
  Medal
} from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { MOCK_INDIVIDUAL_LEADERBOARD, MOCK_TEAM_LEADERBOARD } from '../data/senaData';

export const GamificationModule: React.FC<{ onNavigateTab: (tab: any) => void }> = ({ onNavigateTab }) => {
  const { 
    profile, 
    badges, 
    missions, 
    completeMission, 
    overallApropiacionPercent, 
    isEligibleForCertificate,
    triggerCelebration
  } = useGamification();

  const [leaderboardTab, setLeaderboardTab] = useState<'individual' | 'teams'>('individual');

  const levelTitles: Record<number, string> = {
    1: 'Aprendiz Novato en Talento Humano',
    2: 'Explorador de Procesos Organizacionales',
    3: 'Técnico Operativo de Personal',
    4: 'Especialista en Gestión y Archivo Laboral',
    5: 'Gestor Integral SENA 4.0',
  };

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner: Learner Status & Level Progress */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-200">
              <span className="px-2 py-0.5 bg-black/20 rounded">FICHA {profile.ficha}</span>
              <span>·</span>
              <span>{profile.center}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {profile.name}
            </h1>

            <p className="text-emerald-100 text-xs sm:text-sm font-medium">
              Rango actual: <strong className="text-amber-300">{levelTitles[profile.level] || 'Aprendiz'}</strong>
            </p>

            {/* Level & XP Progression Bar */}
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-200 font-semibold">Nivel {profile.level}</span>
                <span className="text-white font-bold tabular-nums">
                  {profile.xp.toLocaleString()} / {profile.xpNextLevel.toLocaleString()} XP
                </span>
              </div>
              <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-300 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.min(100, Math.round((profile.xp / profile.xpNextLevel) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Summary Badge */}
          <div className="flex flex-row md:flex-col items-center justify-around md:justify-center p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-xs gap-3 shrink-0">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold">
                Apropiación Global
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300 tabular-nums">
                {overallApropiacionPercent}%
              </div>
            </div>

            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold">
                Insignias Ganadas
              </div>
              <div className="text-lg font-bold font-mono text-white tabular-nums">
                {unlockedBadgesCount} / {badges.length}
              </div>
            </div>

            {isEligibleForCertificate && (
              <button
                onClick={() => onNavigateTab('certificate')}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                Certificado Listo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Badge Showcase (Vitrina de Insignias Digitales) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Medal className="w-5 h-5 text-emerald-600" />
              Vitrina de Insignias Digitales de Competencia
            </h2>
            <p className="text-xs text-slate-500">
              Insignias que acreditan tus logros en el proyecto formativo 3456077 y empresa simulada.
            </p>
          </div>
          <button
            onClick={triggerCelebration}
            className="text-xs text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Celebrar Logros
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map((badge) => {
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all ${
                  badge.unlocked
                    ? 'border-emerald-300 bg-gradient-to-br from-white to-emerald-50/40 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                    badge.unlocked
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {badge.unlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>

                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    +{badge.xpValue} XP
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900">{badge.name}</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-normal line-clamp-2">
                  {badge.description}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-400 uppercase">{badge.category}</span>
                  {badge.unlocked ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> Desbloqueada
                    </span>
                  ) : (
                    <span className="text-slate-400">Bloqueada</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Misiones de Aprendizaje */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Misiones de Aprendizaje Activas
            </h2>
            <p className="text-xs text-slate-500">
              Supera estos retos pedagógicos para ganar puntos de experiencia (XP) y acelerar tu ruta hacia la certificación.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {missions.filter((m) => m.completed).length} / {missions.length} Realizadas
          </span>
        </div>

        <div className="space-y-2">
          {missions.map((mission) => {
            return (
              <div
                key={mission.id}
                className={`p-3.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  mission.completed
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-700'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => completeMission(mission.id)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 cursor-pointer border ${
                      mission.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white hover:border-emerald-500'
                    }`}
                  >
                    {mission.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div className="space-y-0.5">
                    <div className={`font-bold ${mission.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {mission.title}
                    </div>
                    <div className="text-[11px] text-slate-500">{mission.description}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <span className="font-mono text-[11px] font-bold text-emerald-800">
                    +{mission.xpReward} XP
                  </span>

                  {!mission.completed ? (
                    <button
                      onClick={() => onNavigateTab(mission.actionModule)}
                      className="px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded cursor-pointer transition-colors"
                    >
                      Ir a la Misión
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">
                      Completada
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rankings (Individual & Por Equipos de Proyecto) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Tablas de Clasificación & Rendimiento
            </h2>
            <p className="text-xs text-slate-500">
              Compite amistosamente y monitorea el avance formativo individual y de tu ficha de proyecto.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setLeaderboardTab('individual')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                leaderboardTab === 'individual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ranking Individual
            </button>
            <button
              onClick={() => setLeaderboardTab('teams')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                leaderboardTab === 'teams'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ranking por Equipos / Fichas
            </button>
          </div>
        </div>

        {leaderboardTab === 'individual' ? (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3 w-16">Puesto</th>
                  <th className="p-3">Aprendiz</th>
                  <th className="p-3">Ficha de Caracterización</th>
                  <th className="p-3">Nivel</th>
                  <th className="p-3">Insignias</th>
                  <th className="p-3 text-right">Puntos XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_INDIVIDUAL_LEADERBOARD.map((item) => {
                  const isCurrent = item.isCurrentUser;
                  return (
                    <tr
                      key={item.id}
                      className={isCurrent ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'}
                    >
                      <td className="p-3 font-mono font-bold">
                        {item.rank === 1 && '🥇 1'}
                        {item.rank === 2 && '🥈 2'}
                        {item.rank === 3 && '🥉 3'}
                        {item.rank > 3 && `#${item.rank}`}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCurrent ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {item.avatarSeed}
                          </div>
                          <span>{item.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-200/60 px-1.5 py-0.2 rounded">
                              Tú
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-slate-500 font-mono">{item.groupName}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-semibold text-[11px]">
                          Nivel {item.level}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 font-mono tabular-nums">
                        {item.badgesCount} insignias
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                        {isCurrent ? profile.xp.toLocaleString() : item.xp.toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_TEAM_LEADERBOARD.map((team) => {
              return (
                <div
                  key={team.id}
                  className={`p-4 rounded-xl border ${
                    team.isCurrentTeam
                      ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" />
                      {team.name}
                    </span>
                    <span className="font-mono text-emerald-800 font-bold">#{team.rank}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div>Ficha SOFIA: <strong className="font-mono text-slate-700">{team.fichNumber}</strong> · {team.membersCount} aprendices</div>
                    <div>Promedio de equipo: <strong className="font-mono text-emerald-700">{team.averageXp.toLocaleString()} XP</strong></div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>Apropiación Grupal</span>
                      <span className="font-bold text-slate-800">{team.progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${team.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recompensas Virtuales Desbloqueadas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          Recompensas Virtuales & Recursos de Apoyo
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
            <div className="font-bold text-slate-900">Plantilla FUID Automatizada</div>
            <p className="text-[11px] text-slate-600">
              Formato Excel con fórmulas de folios, series TRD normalizadas y macro de validación AGN.
            </p>
            <div className="text-[10px] font-bold text-emerald-700 uppercase">
              Disponible · Descarga Abierta
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
            <div className="font-bold text-slate-900">Kit de Entrevistas por Competencias</div>
            <p className="text-[11px] text-slate-600">
              Guía de preguntas conductuales bajo metodología STAR para auxiliares de talento humano.
            </p>
            <div className="text-[10px] font-bold text-emerald-700 uppercase">
              Disponible · Nivel 2 Superado
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/60 text-xs space-y-2">
            <div className="font-bold text-slate-900">Certificación Oficial SENA</div>
            <p className="text-[11px] text-slate-600">
              Certificación de Apropiación Integral del Programa con código de verificación QR.
            </p>
            <button
              onClick={() => onNavigateTab('certificate')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1 cursor-pointer"
            >
              Ir al Módulo de Certificación
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
