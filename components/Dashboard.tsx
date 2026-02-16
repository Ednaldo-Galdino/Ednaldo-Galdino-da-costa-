
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Subject, SUBJECTS, StudyStats } from '../types';

interface DashboardProps {
  stats: Record<string, StudyStats>;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const radarData = SUBJECTS.map(subject => {
    const s = stats[subject];
    const score = s && s.totalAnswered > 0 ? (s.correctAnswers / s.totalAnswered) * 100 : 0;
    return {
      subject,
      score: Math.round(score),
      fullMark: 100
    };
  });

  const statsValues = Object.values(stats) as StudyStats[];
  const totalQuestions = statsValues.reduce((acc, curr) => acc + curr.totalAnswered, 0);
  const totalCorrect = statsValues.reduce((acc, curr) => acc + curr.correctAnswers, 0);
  const averageAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  const getGlobalLevel = () => {
    if (totalQuestions > 100 && averageAccuracy >= 70) {
      return { 
        name: 'PRO', 
        color: 'text-cyan-400', 
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        desc: 'Sincronização Máxima'
      };
    }
    if (totalQuestions > 50 || (totalQuestions > 0 && averageAccuracy > 50)) {
      return { 
        name: 'OPERADOR', 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        desc: 'Conexão em Evolução'
      };
    }
    return { 
      name: 'RECRUTA', 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      desc: 'Inicializando Protocolos'
    };
  };

  const level = getGlobalLevel();

  return (
    <div className="space-y-6 sm:space-y-8 pb-32 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-blue-900/10 border border-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col items-center text-center shadow-lg">
          <span className="text-[9px] sm:text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">Eficiência Global</span>
          <h4 className="text-3xl sm:text-4xl font-black text-white italic drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">{Math.round(averageAccuracy)}%</h4>
        </div>
        <div className="bg-blue-900/10 border border-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col items-center text-center shadow-lg">
          <span className="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Nodes Ativos</span>
          <h4 className="text-3xl sm:text-4xl font-black text-white italic drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">{totalQuestions}</h4>
        </div>
        <div className={`bg-blue-900/10 border ${level.border} backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col items-center text-center relative overflow-hidden group shadow-lg`}>
          <div className={`absolute inset-0 ${level.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          <span className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 relative z-10">Status Neural</span>
          <h4 className={`text-3xl sm:text-4xl font-black italic relative z-10 transition-colors drop-shadow-[0_0_100px_rgba(34,211,238,0.3)] ${level.color}`}>{level.name}</h4>
          <p className="text-[8px] font-bold text-gray-500 uppercase mt-2 tracking-widest relative z-10">{level.desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-8 rounded-3xl sm:rounded-[40px] min-h-[400px] shadow-2xl">
          <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest mb-6 sm:mb-8 border-l-4 border-cyan-500 pl-4 italic">Mapa de Proficiência</h3>
          <div className="h-[300px] sm:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#ffffff30" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#e2e8f0', fontSize: 8, fontWeight: 800 }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Proficiência"
                  dataKey="score"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="#22d3ee"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-8 rounded-3xl sm:rounded-[40px] min-h-[400px] shadow-2xl">
          <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest mb-6 sm:mb-8 border-l-4 border-blue-500 pl-4 italic">Distribuição de Fluxo</h3>
          <div className="h-[300px] sm:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={radarData} margin={{ bottom: 80, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="subject" 
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fill: '#cbd5e1', fontSize: 7, fontWeight: 800 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000d2b', border: '1px solid #ffffff20', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#22d3ee', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Bar dataKey="score" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
