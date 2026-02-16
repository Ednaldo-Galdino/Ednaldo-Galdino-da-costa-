
import React, { useState } from 'react';
import { Goal, CATEGORIES, Category } from '../types';
import { breakDownGoal } from '../services/geminiService';

interface GoalFormProps {
  onSave: (goal: Partial<Goal>) => void;
  onClose: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState<Category>('Pessoal');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const aiData = await breakDownGoal(title, description);
      const steps = aiData?.steps.map((s: string) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: s,
        isCompleted: false
      })) || [];

      onSave({
        title,
        description,
        deadline,
        category,
        steps,
        aiInsight: aiData?.motivation || ''
      });
    } catch (error: any) {
      console.error(error);
      alert("IA ocupada no momento. Tente novamente.");
    }
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0d1b2a]/95 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-6 z-[200] animate-in fade-in duration-300">
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl sm:rounded-[50px] w-full max-w-lg p-8 sm:p-12 shadow-2xl relative overflow-y-auto max-h-[95vh]">
        <h2 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8 text-white italic uppercase tracking-tighter">Protocolar <span className="text-indigo-500">Meta</span></h2>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 sm:mb-3">Objetivo</label>
            <input 
              required
              type="text" 
              placeholder="Ex: Dominar Python..."
              className="w-full p-4 sm:p-5 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl focus:border-indigo-500 outline-none text-white font-bold transition-all placeholder:text-gray-700 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 sm:mb-3">Contexto</label>
            <textarea 
              rows={2}
              className="w-full p-4 sm:p-5 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl focus:border-indigo-500 outline-none text-white font-medium transition-all text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 sm:mb-3">Deadline</label>
              <input 
                required
                type="date" 
                className="w-full p-4 sm:p-5 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl focus:border-indigo-500 outline-none text-white font-bold transition-all text-sm"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 sm:mb-3">Cluster</label>
              <select 
                className="w-full p-4 sm:p-5 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl focus:border-indigo-500 outline-none text-white font-bold transition-all appearance-none text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#0d1b2a]">{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="order-2 sm:order-1 flex-1 py-4 sm:py-5 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
            >
              Abortar
            </button>
            <button 
              disabled={isGenerating}
              type="submit" 
              className="order-1 sm:order-2 flex-1 py-4 sm:py-5 bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl sm:rounded-2xl hover:bg-indigo-500 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : 'Protocolar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
