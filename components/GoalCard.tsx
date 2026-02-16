
import React from 'react';
import { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
  onClick: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  const completedSteps = goal.steps.filter(s => s.isCompleted).length;
  const progress = goal.steps.length > 0 ? (completedSteps / goal.steps.length) * 100 : 0;

  const categoryColors: Record<string, string> = {
    'Saúde': 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10',
    'Carreira': 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
    'Finanças': 'border-amber-500/50 text-amber-400 bg-amber-500/10',
    'Pessoal': 'border-purple-500/50 text-purple-400 bg-purple-500/10',
    'Educação': 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10',
  };

  return (
    <div 
      onClick={() => onClick(goal.id)}
      className="bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-[40px] border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer flex flex-col h-full group shadow-2xl"
    >
      <div className="flex justify-between items-start mb-6 sm:mb-8 gap-2">
        <span className={`px-3 sm:px-4 py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border ${categoryColors[goal.category] || 'border-white/10 text-gray-500'}`}>
          {goal.category}
        </span>
        <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl border border-white/5 whitespace-nowrap">
          {new Date(goal.deadline).toLocaleDateString('pt-BR')}
        </span>
      </div>
      
      <h3 className="text-lg sm:text-xl font-black text-white mb-3 uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{goal.title}</h3>
      <p className="text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8 line-clamp-3 flex-grow font-medium leading-relaxed opacity-80">{goal.description}</p>
      
      <div className="mt-auto space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center text-[9px] sm:text-[11px] font-black uppercase tracking-widest">
          <span className="text-cyan-400">ANALYZING: {Math.round(progress)}%</span>
          <span className="text-gray-500">{completedSteps}/{goal.steps.length} NODES</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-1.5 sm:h-2 overflow-hidden border border-white/10 p-0.5">
          <div 
            className="bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
